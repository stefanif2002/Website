import React, { useMemo, useState } from "react";
import { Card, Col, Form, Row, Steps, Typography } from "antd";
import { width } from "../../resources/service.ts";
import AddonsStep from "./AddonsStep";
import SummaryCard from "./SummaryCard";
import ConfirmationStep from "./ConfirmationStep";
import { ADDONS } from "./addonsDef";
import type { BookingWizardProps, ChecklistEntryDto, Driver } from "./types";
import SearchPage from "../../pages/search/SearchPage.tsx";
import MyInfo from "./MyInfo.tsx";
import Payment from "./Payment.tsx";

const { Title } = Typography;

export default function BookingWizard({
                                          onSubmit,
                                          baseTotal = 0,
                                          currency = "EUR",
                                          vehicleName,
                                          vehicleImage,
                                          pickupLabel,
                                          dropoffLabel,
                                      }: BookingWizardProps) {
    const [form] = Form.useForm();
    const [step, setStep] = useState(0);

    const checklist = Form.useWatch("checklist", form) ?? {};
    const checklistQty = Form.useWatch("checklistQty", form) ?? {};

    const addonsTotal = useMemo(() => {
        return ADDONS.reduce((sum, a) => {
            if (!checklist[a.value]) return sum;
            if (a.qty) {
                const q = Number(checklistQty[a.value] || 0);
                return sum + (q > 0 ? a.price * q : 0);
            }
            return sum + a.price;
        }, 0);
    }, [checklist, checklistQty]);

    const grandTotal = useMemo(() => +(baseTotal + addonsTotal).toFixed(2), [baseTotal, addonsTotal]);

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

            const driverList: Driver[] = (drivers as any[]).map(d => ({
                telephone: d?.telephone,
                name: d?.name,
            }));

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

    return (
        <div style={{ marginTop: 10, width: "90%", margin: "20px auto" }}>
                <Steps
                    current={step}
                    items={[{ title: "Εξοπλισμός" }, { title: "Προσωπικά Στοιχεία" }, { title: "Πληρωμή" }, { title: "Τέλος" }]}
                    style={{ marginBottom: 16 }}
                />

                <Row gutter={16} align="start">
                    <Col xs={24} md={step === 2 ? 24 : 16} >
                        <Form form={form} layout="vertical"   initialValues={{ checklist: {}, checklistQty: {} }}   // <- ensure objects exist
                        >
                            {step === 0 && (
                                <AddonsStep form={form} onNext={handlextraDone} />
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
                                        onPaid={() => setStep(3)}     // optional if you ever resolve immediately
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
