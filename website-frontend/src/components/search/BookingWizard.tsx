import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row, Steps, Typography, message } from "antd";
import { useLocation, useSearchParams } from "react-router-dom";
import AddonsStep from "./AddonsStep";
import SummaryCard from "./SummaryCard";
import ConfirmationStep from "./ConfirmationStep";
import { ADDONS } from "./addonsDef";
import type { BookingWizardProps, ChecklistEntryDto, Driver } from "./types";
import MyInfo from "./MyInfo";
import Payment from "./Payment";

const { Title } = Typography;

type RouteStep = "extra" | "info" | "payment" | "done";

type Props = BookingWizardProps & {
    routeStep: RouteStep;
    goto: (s: RouteStep) => void;
};

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
                                          onSubmit,
                                          baseTotal = 0,
                                          currency = "EUR",
                                          vehicleName,
                                          vehicleImage,
                                          pickupLabel,
                                          dropoffLabel,
                                          categoryId,
                                          startIso,
                                          endIso,
                                          startLocation,
                                          endLocation,
                                          routeStep,
                                          goto,
                                      }: Props) {
    const [form] = Form.useForm();
    const [addonsTotal, setAddonsTotal] = useState<number>(0);

    const [sp, setSp] = useSearchParams();
    const { pathname } = useLocation();

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

    // On mount / route change: pull extras from URL (once if form is empty)
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

    // Initialize once from initialValues
    useEffect(() => {
        const init = form.getFieldsValue(true) as FormValues;
        setAddonsTotal(calcAddonsTotal(init));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const grandTotal = +(baseTotal + addonsTotal).toFixed(2);

    const handleFinish = async () => {
        try {
            const values = form.getFieldsValue(true);
            const {
                telephone,
                flight = "",
                number_of_people,
                notes = "",
                is_advance_paid = false,
                drivers = [],
                checklist = {},
                checklistQty = {},
            } = values;

            const driverList: Driver[] = Array.isArray(drivers)
                ? (drivers as Partial<Driver>[]).map((d) => ({
                    telephone: d?.telephone ?? "",
                    name: d?.name ?? "",
                }))
                : [];

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

            onSubmit(
                telephone,
                driverList,
                flight,
                Number(number_of_people || 1),
                grandTotal,
                is_advance_paid,
                notes,
                entries
            );
        } catch {
            // AntD handles validation
        }
    };

    const handlextraDone = () => goto("info");
    const handleInfoDone = () => goto("payment");

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
                items={[{ title: "Εξοπλισμός" }, { title: "Προσωπικά Στοιχεία" }, { title: "Πληρωμή" }, { title: "Τέλος" }]}
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
                            <AddonsStep form={form} onNext={handlextraDone} onTotalsChange={(t) => setAddonsTotal(t)} />
                        )}

                        {routeStep === "info" && (
                            <Card style={{ borderRadius: 12 }} title={<Title level={4} style={{ margin: 0 }}>Η Πληροφορία Σου</Title>}>
                                <MyInfo form={form} onPrev={() => goto("extra")} onNext={handleInfoDone} onFinish={handleFinish} />
                            </Card>
                        )}

                        {routeStep === "payment" && (
                            <Card style={{ borderRadius: 12 }} title={<Title level={4} style={{ margin: 0 }}>Πληρωμή</Title>}>
                                <Payment
                                    form={form}
                                    amount={grandTotal}
                                    currency={currency}
                                    onPrev={() => goto("info")}
                                    onSkip={() => goto("done")}
                                    onPaid={async () => {
                                        // If you capture PayPal on the page:
                                        try {
                                            await handleFinish();
                                        } catch {
                                            message.error("Could not finalize booking after payment.");
                                        }
                                        goto("done");
                                    }}
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

            {step === 3 && (
                <Card style={{ borderRadius: 12 }} title={<Title level={4} style={{ margin: 0 }}>Τελος</Title>}>
                    <ConfirmationStep form={form} onPrev={() => goto("extra")} onFinish={handleFinish} />
                </Card>
            )}
        </div>
    );
}
