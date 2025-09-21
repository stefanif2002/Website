import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row, Steps, Typography, message } from "antd";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import AddonsStep from "./AddonsStep";
import SummaryCard from "./SummaryCard";
import { ADDONS } from "./addonsDef";
import MyInfo from "./MyInfo";
import Payment from "./Payment";
import {getLangPrefix, myApi} from "../../resources/service.ts";
import dayjs from "dayjs";

const { Title } = Typography;

type RouteStep = "extra" | "info" | "payment" | "done";

type Props = {
    baseTotal?: number;
    currency?: string;
    vehicleName?: string;
    vehicleImage?: string;
    pickupLabel?: string;
    dropoffLabel?: string;
    routeStep: RouteStep;
    goto: (s: RouteStep) => void;
};

type Driver = { telephone: string; full_name: string };
type ChecklistEntryDto = { item: string; quantity: number };

// ---- helpers: serialize/parse extras to query param -----------------
const serializeExtras = (cl: Record<string, boolean> = {}, clq: Record<string, number> = {}) => {
    const parts: string[] = [];
    for (const a of ADDONS) {
        if (cl[a.value]) {
            if (a.qty) {
                const q = Math.max(1, Number(clq[a.value] || 1));
                parts.push(`${encodeURIComponent(a.value)}.${q}`);
            } else {
                parts.push(encodeURIComponent(a.value));
            }
        }
    }
    return parts.join(",");
};

const parseExtras = (s?: string | null) => {
    const checklist: Record<string, boolean> = {};
    const checklistQty: Record<string, number> = {};
    if (!s) return { checklist, checklistQty };
    s.split(",")
        .filter(Boolean)
        .forEach((item) => {
            const [raw, q] = item.split(".");
            const key = decodeURIComponent(raw);
            checklist[key] = true;
            if (q) checklistQty[key] = Math.max(1, Number(q) || 1);
        });
    return { checklist, checklistQty };
};
// ---------------------------------------------------------------------

export default function BookingWizard({
                                          baseTotal = 0,
                                          currency = "EUR",
                                          vehicleName,
                                          vehicleImage,
                                          pickupLabel,
                                          dropoffLabel,
                                          routeStep,
                                          goto,
                                      }: Props) {
    const [form] = Form.useForm();
    const [addonsTotal, setAddonsTotal] = useState<number>(0);

    const [sp, setSp] = useSearchParams();
    const { pathname } = useLocation();

    const navigate = useNavigate();

    type FormValues = { checklist?: Record<string, boolean>; checklistQty?: Record<string, number> };

    const calcAddonsTotal = (values: FormValues): number => {
        const cl: Record<string, boolean> = values?.checklist ?? {};
        const clq: Record<string, number> = values?.checklistQty ?? {};
        return ADDONS.reduce((sum, a) => {
            if (!cl[a.value]) return sum;
            if (a.qty) {
                const q = Number(clq[a.value] || 0);
                return sum + (q > 0 ? a.price * q : 0);
            }
            return sum + a.price;
        }, 0);
    };

    // Pull extras from URL into the form once
    useEffect(() => {
        const { checklist: urlCl, checklistQty: urlClq } = parseExtras(sp.get("extras"));
        const current = form.getFieldsValue(["checklist", "checklistQty"]) as any;
        const has = current?.checklist && Object.keys(current.checklist).length > 0;
        if (!has && (Object.keys(urlCl).length || Object.keys(urlClq).length)) {
            form.setFieldsValue({ checklist: urlCl, checklistQty: urlClq });
            setAddonsTotal(calcAddonsTotal({ checklist: urlCl, checklistQty: urlClq }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // Initialize total
    useEffect(() => {
        const init = form.getFieldsValue(true) as FormValues;
        setAddonsTotal(calcAddonsTotal(init));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const grandTotal = +(baseTotal + addonsTotal).toFixed(2);

    // Create booking BEFORE payment to acquire a bookingId
    const saveDraftAndGoToPayment = async () => {
        try {
            // Minimal required fields before saving a draft
            await form.validateFields(["telephone", "email", "name", "last_name", "number_of_people"]);

            // Read form values
            const values = form.getFieldsValue(true);
            const {
                telephone,                  // -> BookingCreateDto.userId via @JsonProperty("telephone")
                email,
                name,
                last_name,
                flight = "",
                number_of_people,
                notes = "",
                drivers = [],
                checklist = {},
                checklistQty = {},
            } = values as {
                telephone: string;
                email: string;
                name: string;
                last_name: string;
                flight?: string;
                number_of_people?: number | string;
                notes?: string;
                drivers?: Array<Partial<Driver>>;
                checklist?: Record<string, boolean>;
                checklistQty?: Record<string, number>;
            };

            // Build drivers DTO [{ telephone, full_name }]
            const driverList: Driver[] = Array.isArray(drivers)
                ? (drivers as Partial<Driver>[]).map((d) => ({
                    telephone: d?.telephone ?? "",
                    full_name: d?.name ?? "",
                }))
                : [];

            // Build extras DTO [{ item, quantity }]
            const entries: ChecklistEntryDto[] = [];
            for (const a of ADDONS) {
                if (checklist[a.value]) {
                    if (a.qty) {
                        const q = Number(checklistQty[a.value] || 0);
                        if (q > 0) entries.push({ item: a.value, quantity: q });
                    } else {
                        entries.push({ item: a.value, quantity: 1 });
                    }
                }
            }

            // Derive category & date/location from URL
            const parts = pathname.replace(/\/+$/, "").split("/");
            const bookIdx = parts.indexOf("book");
            const categoryId = bookIdx >= 0 ? Number(parts[bookIdx + 1]) : undefined;

            const startIso = sp.get("start");
            const endIso = sp.get("end");
            const startLocation = sp.get("sl") || "";
            const endLocation = sp.get("dl") || "";

            if (!categoryId || !startIso || !endIso) {
                message.error("Λείπουν δεδομένα κράτησης (ημερομηνίες/όχημα). Επιστρέψτε στην αναζήτηση.");
                return;
            }

            // Format as LocalDateTime (no timezone), e.g. 2025-01-31T14:30:00
            const startLdt = dayjs(startIso).format("YYYY-MM-DDTHH:mm:ss");
            const endLdt   = dayjs(endIso).format("YYYY-MM-DDTHH:mm:ss");

            // ---- EXACT SHAPE FOR BookingCreateDto ----
            const payload = {
                telephone,                       // -> BookingCreateDto.userId (via @JsonProperty("telephone"))
                category_id: categoryId,         // -> BookingCreateDto.categoryId (via @JsonProperty)
                drivers: driverList,             // -> List<DriverDto>
                start: startLdt,                 // -> LocalDateTime
                end: endLdt,                     // -> LocalDateTime
                price: Number(grandTotal.toFixed(2)), // -> Float
                startLocation,                   // -> String
                endLocation,                     // -> String
                flight,                          // -> String
                notes,                           // -> String
                number_of_people: Number(number_of_people || 1), // -> Integer
                checklist: entries,              // -> List<ChecklistItemDto> { item, quantity }
            };

            const resp = await myApi.post("booking/create", payload);
            const bookingId = resp?.data;
            if (!bookingId) {
                message.error("Δεν ελήφθη bookingId από τον διακομιστή.");
                return;
            }

            // Persist bookingId to URL (?bid=)
            const next = new URLSearchParams(sp);
            next.set("bid", String(bookingId));
            setSp(next, { replace: true });

            // --- Send Booking Confirmation Email (non-blocking for UX) ---
            const fullName = `${name ?? ""} ${last_name ?? ""}`.trim();
            const emailDto = {
                email,
                telephone,
                name: fullName,
                bookingId,
                start: startLdt,          // LocalDateTime
                end: endLdt,              // LocalDateTime
                startLocation,
                endLocation,
            };

            try {
                // If your controller is @RequestMapping("/api/v1/email")
                await myApi.post("email/sendBookingConfirmationEmail", emailDto);
                // If your controller is @RequestMapping("/api/email") instead, use:
                // await myApi.post("/api/email/sendBookingConfirmationEmail", emailDto);
            } catch (e) {
                // Don’t block: just warn and keep going to payment
                console.warn("Failed to send confirmation email", e);
            }

            // Go to payment (ensure URL includes bid)
            const langPrefix = getLangPrefix(pathname);          // <- "/el" if none found
            const target = `${langPrefix}/book/${categoryId}/payment${
                next.toString() ? `?${next.toString()}` : ""
            }`;
            navigate(target, { replace: true });

        } catch (err: any) {
            if (err?.errorFields) return; // AntD validation already shown
            message.error("Αποτυχία δημιουργίας κράτησης. Προσπαθήστε ξανά.");
        }
    };



    // Keep ?extras in URL + keep totals
    const handleValuesChange = () => {
        const all = form.getFieldsValue(true) as FormValues;
        setAddonsTotal(calcAddonsTotal(all));
        const extras = serializeExtras(all.checklist ?? {}, all.checklistQty ?? {});
        const next = new URLSearchParams(sp);
        if (extras) next.set("extras", extras);
        else next.delete("extras");
        setSp(next, { replace: true });
    };

    const step = routeStep === "extra" ? 0 : routeStep === "info" ? 1 : routeStep === "payment" ? 2 : 3;

    return (
        <div style={{ marginTop: 10, width: "90%", margin: "20px auto" }}>
            <Steps
                current={step}
                items={[{ title: "Εξοπλισμός" }, { title: "Προσωπικά Στοιχεία" }, { title: "Πληρωμή" }]}
                style={{ marginBottom: 16 }}
            />

            <Row gutter={16} align="top">
                <Col xs={24} md={step === 2 ? 24 : 16}>
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{ checklist: {}, checklistQty: {} }}
                        onValuesChange={handleValuesChange}
                    >
                        {routeStep === "extra" && (
                            <AddonsStep
                                form={form}
                                onNext={() => goto("info")}
                                onTotalsChange={(t) => setAddonsTotal(t)}
                            />
                        )}

                        {routeStep === "info" && (
                            <Card style={{ borderRadius: 12 }} title={<Title level={4} style={{ margin: 0 }}>Η Πληροφορία Σου</Title>}>
                                <MyInfo
                                    form={form}
                                    onPrev={() => goto("extra")}
                                    onNext={saveDraftAndGoToPayment}   // <-- create booking first, then go to payment
                                />
                            </Card>
                        )}

                        {routeStep === "payment" && (
                            <Card style={{ borderRadius: 12 }} title={<Title level={4} style={{ margin: 0 }}>Πληρωμή</Title>}>
                                <Payment
                                    form={form}
                                    amount={grandTotal}
                                    currency={currency}
                                    onPrev={() => goto("info")}
                                    onPaid={() => goto("done")}        // booking already exists; just go to success
                                />
                            </Card>
                        )}
                    </Form>
                </Col>

                {step !== 2 && (
                    <Col xs={24} md={8}>
                        <SummaryCard
                            baseTotal={baseTotal}
                            addonsTotal={addonsTotal}
                            currency={currency}
                            vehicleName={vehicleName}
                            vehicleImage={vehicleImage}
                            pickupLabel={pickupLabel}
                            dropoffLabel={dropoffLabel}
                            showFreeCancel={routeStep === "info"}
                        />
                    </Col>
                )}
            </Row>
        </div>
    );
}
