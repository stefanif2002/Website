import { useEffect, useState } from "react";
import { Card, Col, Form, Row, Steps, Typography, message } from "antd";
import AddonsStep from "./AddonsStep";
import SummaryCard from "./SummaryCard";
import ConfirmationStep from "./ConfirmationStep";
import { ADDONS } from "./addonsDef";
import type { BookingWizardProps, ChecklistEntryDto, Driver } from "./types";
import MyInfo from "./MyInfo.tsx";
import Payment from "./Payment.tsx";
import { myApi } from "../../resources/service.ts";

const { Title } = Typography;

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
                                      }: BookingWizardProps) {
    const [form] = Form.useForm();
    const [step, setStep] = useState(0);
    // Stable empty objects to avoid changing deps on every render
    const [addonsTotal, setAddonsTotal] = useState<number>(0);

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
                ? (drivers as Partial<Driver>[]).map(d => ({
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
            // AntD will show validation errors automatically
        }
    };

    const handlextraDone = () => {
        console.log("checklist:", form.getFieldValue(["checklist"]));
        console.log("checklistQty:", form.getFieldValue(["checklistQty"]));
        setStep(1)
    }

    const handleInfoDone = () => {
        console.log("Telephone:", form.getFieldValue(["drivers"]));
        setStep(2)
    }

    // Called when online payment provider reports success
    const handlePaid = async () => {
        try {
            // Validate and gather the latest form values
            await form.validateFields();
            const values = form.getFieldsValue(true);
            const {
                telephone,
                flight = "",
                number_of_people,
                notes = "",
                drivers = [],
                checklist = {},
                checklistQty = {},
            } = values;

            const driverList: Driver[] = Array.isArray(drivers)
                ? (drivers as Partial<Driver>[]).map(d => ({
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

            const payload = {
                telephone,
                category_id: categoryId,
                start: startIso,
                end: endIso,
                drivers: driverList,
                price: grandTotal,
                startLocation,
                endLocation,
                externalCar: false,
                number_of_people: Number(number_of_people || 1),
                flight,
                advance_paid: true,
                notes,
                checklist: entries,
            };

            await myApi.post("booking/create", payload);
            message.success("Payment confirmed and booking created.");
            setStep(3);
        } catch {
            // validation errors or network error
            message.error("Could not create booking after payment. Please try again.");
        }
    };

    return (
        <div style={{ marginTop: 10, width: "90%", margin: "20px auto" }}>
                <Steps
                    current={step}
                    items={[{ title: "Εξοπλισμός" }, { title: "Προσωπικά Στοιχεία" }, { title: "Πληρωμή" }, { title: "Τέλος" }]}
                    style={{ marginBottom: 16 }}
                />

                <Row gutter={16} align="top">
                    <Col xs={24} md={step === 2 ? 24 : 16} >
                        <Form form={form} layout="vertical"   initialValues={{ checklist: {}, checklistQty: {} }}   // <- ensure objects exist
                              onValuesChange={(_, allValues: FormValues) => {
                                  setAddonsTotal(calcAddonsTotal(allValues));
                              }}
                        >
                            {step === 0 && (
                                <AddonsStep
                                    form={form}
                                    onNext={handlextraDone}
                                    onTotalsChange={(t) => setAddonsTotal(t)}
                                />
                            )}

                            {step === 1 && (
                                <Card style={{ borderRadius: 12 }} title={<Title level={4} style={{ margin: 0 }}>Η Πληροφορία Σου</Title>}>
                                    <MyInfo
                                        form={form}
                                        onPrev={() => setStep(0)}
                                        onNext={handleInfoDone}
                                        onFinish={handleFinish}
                                    />
                                </Card>
                            )}

                            {step === 2 && (
                                <Card style={{ borderRadius: 12 }} title={<Title level={4} style={{ margin: 0 }}>Πληρωμή</Title>}>
                                    <Payment
                                        form={form}
                                        amount={grandTotal}
                                        currency={currency}
                                        onPrev={() => setStep(1)}
                                        onSkip={() => setStep(3)}     // proceed without online payment
                                        onPaid={handlePaid}           // on successful payment: create booking
                                        // stripeEndpoint="/payments/stripe/create-checkout-session"
                                        // paypalEndpoint="/payments/paypal/create-order"
                                    />                                </Card>
                            )}
                        </Form>
                    </Col>

                    {step === 2 ? null :
                        <Col xs={24} md={8}>
                            <SummaryCard
                                baseTotal={baseTotal}
                                addonsTotal={addonsTotal}
                                currency={currency}
                                vehicleName={vehicleName}
                                vehicleImage={vehicleImage}
                                pickupLabel={pickupLabel}
                                dropoffLabel={dropoffLabel}
                                showFreeCancel={step === 1}
                            />
                        </Col>
                    }

                </Row>

            {step === 3 && (
                <Card style={{ borderRadius: 12 }} title={<Title level={4} style={{ margin: 0 }}>Τελος</Title>}>
                    <ConfirmationStep
                        form={form}
                        onPrev={() => setStep(0)}
                        onFinish={handleFinish}
                    />
                </Card>
            )}
        </div>
    );
}
