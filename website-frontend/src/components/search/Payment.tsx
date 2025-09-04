import React, { useState } from "react";
import { Button, Divider, message, Radio, Space, Typography, Alert } from "antd";
import type { FormInstance } from "antd/es/form";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { myApi } from "../../resources/service";
import { useLocation, useSearchParams } from "react-router-dom";

const { Title, Text } = Typography;

type Props = {
    form: FormInstance;
    amount: number;                // total to charge (final)
    currency?: string;             // e.g. "EUR"
    onPrev?: () => void;           // back to previous step
    onSkip?: () => void;           // continue without online payment
    onPaid?: () => void;           // called when PayPal capture succeeds (Stripe redirects)
    stripeEndpoint?: string;       // POST -> { sessionId: string }
    paypalCreateEndpoint?: string;
    paypalCaptureEndpoint?: string;
    stripePublishableKey?: string;
    paypalClientId?: string;
};

type Method = "stripe" | "paypal";

const Payment: React.FC<Props> = ({
                                      form,
                                      amount,
                                      currency = "EUR",
                                      onPrev,
                                      onSkip,
                                      onPaid,
                                      paypalCreateEndpoint = "payments/paypal/create-order",
                                      paypalCaptureEndpoint = "payments/paypal/capture-order",
                                      stripePublishableKey = "pk_test_51S2UY3KnXECMMeszL1gKAaoSrvN4uu6v0YKMkQ4GdKIIaJA8gvjuVO0Z0oOhuWzMRH3sxcLKC89AL6h9pJASNUbX00Rsq57BV4",
                                      paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID,
                                  }) => {
    const [method, setMethod] = useState<Method>("stripe");
    const [loading, setLoading] = useState(false);

    const stripePromise = loadStripe(stripePublishableKey);
    const { pathname } = useLocation();
    const [sp] = useSearchParams();

    // Derive language prefix and category id to build success/cancel URLs
    const parts = pathname.replace(/\/+$/, "").split("/");
    const bookIdx = parts.indexOf("book");
    const categoryId = bookIdx >= 0 ? Number(parts[bookIdx + 1]) : undefined;
    const prefix = bookIdx > 0 ? parts.slice(0, bookIdx).join("/") : ""; // "" or "/el"
    const qp = sp.toString(); // includes extras if set

    const successUrl = `${window.location.origin}${prefix}/book/${categoryId}/payment/success${qp ? `?${qp}` : ""}`;
    const cancelUrl  = `${window.location.origin}${prefix}/book/${categoryId}/payment/retry${qp ? `?${qp}` : ""}`;

    const buildMetadata = () => {
        const { telephone, name, last_name } = form.getFieldsValue(["telephone", "name", "last_name"]) as any;
        return { telephone, name, last_name };
    };

    // ---------- STRIPE ----------
    const payWithStripe = async (isAdvance: boolean) => {
        if (!stripePromise) {
            message.error("Stripe key is missing. Επικοινωνήστε με την υποστήριξη.");
            return;
        }
        setLoading(true);
        try {
            const amountToCharge = isAdvance ? 49.99 : amount;

            console.log(buildMetadata())
            console.log(amountToCharge)
            console.log(currency)
            console.log(successUrl)

            const resp = await myApi.post(
                "payment/stripe/create-checkout-session",
                { amount: amountToCharge, currency, successUrl, cancelUrl, metadata: buildMetadata() },
                { headers: { "Content-Type": "application/json" } }
            );

            const sessionId: string | undefined = resp?.data;
            if (!sessionId) throw new Error("No sessionId returned from backend");

            const stripe = await stripePromise;
            if (!stripe) throw new Error("Stripe failed to load.");

            form.setFieldsValue({ is_advance_paid: true, payment_method: "stripe" });
            const { error } = await stripe.redirectToCheckout({ sessionId });
            if (error) throw error;
        } catch (e) {
            console.error(e);
            message.error("Αποτυχία δημιουργίας πληρωμής Stripe.");
            setLoading(false);
        }
    };

    // ---------- PAYPAL (optional; unchanged flow) ----------
    const renderPaypal = () => {
        if (!paypalClientId) {
            return (
                <Alert
                    type="warning"
                    showIcon
                    message="PayPal client id is missing."
                    description="Παρακαλούμε ελέγξτε τη ρύθμιση PAYPAL_CLIENT_ID."
                />
            );
        }

        return (
            <PayPalScriptProvider options={{ "client-id": paypalClientId!, currency, intent: "CAPTURE" }}>
                <PayPalButtons
                    style={{ layout: "vertical", shape: "rect", label: "pay", height: 40 }}
                    createOrder={async () => {
                        try {
                            const resp = await myApi.post(paypalCreateEndpoint, {
                                amount,
                                currency,
                                metadata: buildMetadata(),
                            });
                            const orderId = resp?.data?.orderId;
                            if (!orderId) throw new Error("No orderId from backend");
                            return orderId;
                        } catch (e) {
                            console.error(e);
                            message.error("Αδυναμία δημιουργίας παραγγελίας PayPal.");
                            throw e;
                        }
                    }}
                    onApprove={async (data) => {
                        try {
                            setLoading(true);
                            const resp = await myApi.post(paypalCaptureEndpoint, { orderId: data.orderID });
                            const status = resp?.data?.status || resp?.data?.result?.status;
                            if (status !== "COMPLETED") throw new Error(`Capture status: ${status}`);
                            form.setFieldsValue({ is_advance_paid: true, payment_method: "paypal" });
                            message.success("Η πληρωμή ολοκληρώθηκε με επιτυχία.");
                            onPaid?.();
                        } catch (e) {
                            console.error(e);
                            message.error("Αποτυχία ολοκλήρωσης πληρωμής PayPal.");
                        } finally {
                            setLoading(false);
                        }
                    }}
                    onError={(err) => {
                        console.error(err);
                        message.error("Σφάλμα PayPal.");
                    }}
                    disabled={amount <= 0 || loading}
                    forceReRender={[amount, currency]}
                />
            </PayPalScriptProvider>
        );
    };

    // ---------- UI ----------
    const showStripeButton = method === "stripe";
    const showPaypalButtons = method === "paypal";

    return (
        <Space direction="vertical" style={{ padding: 20, width: "100%" }}>
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
              <img src="https://cdn.brandfetch.io/idxAg10C0L/w/400/h/400/theme/dark/icon.jpeg" alt="Stripe" height={16} style={{ display: "block" }} />
              Stripe
            </span>
                    </Radio.Button>

                    <Radio.Button value="paypal">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" height={16} style={{ display: "block" }} />
              PayPal
            </span>
                    </Radio.Button>
                </Radio.Group>
            </div>

            {showStripeButton && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                    <Space>
                        <Button onClick={onPrev}>ΠΙΣΩ</Button>
                        <Button disabled={amount <= 0} onClick={() => payWithStripe(true)}>
                            Πληρωμή προκαταβολής
                        </Button>
                        <Button type="primary" onClick={() => payWithStripe(false)} loading={loading} disabled={amount <= 0}>
                            Πληρωμή με Stripe
                        </Button>
                    </Space>
                </div>
            )}

            {showPaypalButtons && (
                <>
                    <Alert
                        type="info"
                        showIcon
                        style={{ marginTop: 8 }}
                        message="Ολοκληρώστε την πληρωμή μέσω PayPal."
                        description="Μετά την επιβεβαίωση, θα προχωρήσουμε αυτόματα στο επόμενο βήμα."
                    />
                    <div style={{ marginTop: 12 }}>{renderPaypal()}</div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                        <Button onClick={onPrev}>ΠΙΣΩ</Button>
                        <Button onClick={() => { form.setFieldsValue({ is_advance_paid: false, payment_method: undefined }); onSkip?.(); }}>
                            Πληρωμή προκαταβολής
                        </Button>
                    </div>
                </>
            )}

            <div style={{ marginTop: 20 }}>
                <Text type="danger">
                    Μόνο με την ολοκλήρωση της πληρωμής <b>(ολόκληρης ή προκαταβολής)</b> θα καταχωρηθεί η κράτηση.
                </Text>
            </div>
        </Space>
    );
};

export default Payment;
