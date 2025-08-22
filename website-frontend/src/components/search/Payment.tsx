import React, { useMemo, useState } from "react";
import { Button, Card, Col, Divider, Form, message, Radio, Row, Space, Typography } from "antd";
import type { FormInstance } from "antd/es/form";
import { myApi } from "../../resources/service";

const { Title, Text } = Typography;

type Props = {
    form: FormInstance;
    amount: number;         // total to charge
    currency?: string;      // e.g. "EUR"
    onPrev?: () => void;    // back to previous step
    onSkip?: () => void;    // continue without online payment
    onPaid?: () => void;    // optional callback if you return from payment instantly (rare)
    stripeEndpoint?: string; // backend endpoint returning { url: string }
    paypalEndpoint?: string; // backend endpoint returning { approvalUrl: string }
};

type Method = "stripe" | "paypal";

const Payment: React.FC<Props> = ({
                                      form,
                                      amount,
                                      currency = "EUR",
                                      onPrev,
                                      onSkip,
                                      stripeEndpoint = "/payments/stripe/create-checkout-session",
                                      paypalEndpoint = "/payments/paypal/create-order",
                                  }) => {
    const [method, setMethod] = useState<Method>("stripe");
    const [loading, setLoading] = useState(false);

    const cents = useMemo(() => Math.round((amount || 0) * 100), [amount]);

    const buildMetadata = () => {
        // include anything useful for reconciliation on your backend
        const { telephone, name, last_name } = form.getFieldsValue(["telephone", "name", "last_name"]);
        return {
            telephone,
            name,
            last_name,
            // add more if you need: booking id/draft id, pickup/dropoff, etc.
        };
    };

    const payWithStripe = async () => {
        setLoading(true);
        try {
            const resp = await myApi.post(stripeEndpoint, {
                amount,           // float
                amount_cents: cents,
                currency,
                metadata: buildMetadata(),
            });
            const url = resp?.data?.url || resp?.data?.checkoutUrl;
            if (!url) throw new Error("No Stripe URL returned");
            // mark intent in form (optional)
            form.setFieldsValue({ is_advance_paid: true, payment_method: "stripe" });
            window.location.href = url; // redirect to Stripe Checkout
        } catch (e: any) {
            console.error(e);
            message.error("Αποτυχία δημιουργίας πληρωμής Stripe.");
            setLoading(false);
        }
    };

    const payWithPaypal = async () => {
        setLoading(true);
        try {
            const resp = await myApi.post(paypalEndpoint, {
                amount,
                currency,
                metadata: buildMetadata(),
            });
            const approval = resp?.data?.approvalUrl || resp?.data?.url;
            if (!approval) throw new Error("No PayPal approval URL returned");
            form.setFieldsValue({ is_advance_paid: true, payment_method: "paypal" });
            window.location.href = approval; // redirect to PayPal
        } catch (e: any) {
            console.error(e);
            message.error("Αποτυχία δημιουργίας πληρωμής PayPal.");
            setLoading(false);
        }
    };

    const handlePayNow = () => {
        if (method === "stripe") return payWithStripe();
        return payWithPaypal();
    };

    const handlePayLater = () => {
        form.setFieldsValue({ is_advance_paid: false, payment_method: undefined });
        onSkip?.();
    };

    return (
        <Space direction="vertical" style={{padding:20}} >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Title level={5} style={{ margin: 0 }}>Σύνολο πληρωμής</Title>
                <Title level={3} style={{ margin: 0 }}>
                    {amount.toFixed(2)} <Text type="secondary" style={{ fontSize: 14 }}>{currency}</Text>
                </Title>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            <div>
                <Text strong>Επιλέξτε μέθοδο πληρωμής</Text>
                <Radio.Group
                    style={{ display: "flex", marginTop: 8, flexWrap: "wrap" }}
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                >
                    <Radio.Button value="stripe">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <img
                        src="https://cdn.brandfetch.io/idxAg10C0L/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1746435900077"
                        alt="Stripe"
                        height={16}
                        style={{ display: "block" }}
                    />
                    Stripe
                  </span>
                    </Radio.Button>

                    <Radio.Button value="paypal">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <img
                        src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                        alt="PayPal"
                        height={16}
                        style={{ display: "block" }}
                    />
                    PayPal
                  </span>
                    </Radio.Button>
                </Radio.Group>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                <Button onClick={onPrev}>ΠΙΣΩ</Button>

                <Space>
                    <Button onClick={handlePayLater}>Πληρωμή προκαταβολής</Button>
                    <Button
                        type="primary"
                        onClick={handlePayNow}
                        loading={loading}
                    >
                        Εξόφληση
                    </Button>
                </Space>
            </div>

            <div style={{marginTop: 20}}>
                <Text type='danger'>
                    Μόνο με την ολοκλήρωση της πληρωμής <b>(ολόκληρης ή προκαταβολής)</b> θα καταχωρηθεί η κράτηση.
                </Text>
            </div>


        </Space>
    );
};

export default Payment;
