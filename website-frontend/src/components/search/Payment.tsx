// src/pages/booking/Payment.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Alert, Button, Card, Divider, Input, Space, Statistic, Tag, Tooltip, Typography, message,
} from "antd";
import type { FormInstance } from "antd/es/form";
import { loadStripe } from "@stripe/stripe-js";
import { myApi } from "../../resources/service";
import { useLocation, useSearchParams } from "react-router-dom";
import {
    LockOutlined, PercentageOutlined, ClearOutlined,
    CheckCircleTwoTone, GiftTwoTone, ArrowLeftOutlined, CreditCardOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getLangFromPath } from "../../resources/useLangRouter"; // ⬅️ read exact lang from URL

const { Title, Text } = Typography;

type Props = {
    form: FormInstance;
    amount: number;
    currency?: string;
    onPrev?: () => void;
    onPaid?: () => void;
    stripePublishableKey?: string;
};

const Payment: React.FC<Props> = ({
                                      form,
                                      amount,
                                      currency = "EUR",
                                      onPrev,
                                      stripePublishableKey = "pk_test_51S2UY3KnXECMMeszL1gKAaoSrvN4uu6v0YKMkQ4GdKIIaJA8gvjuVO0Z0oOhuWzMRH3sxcLKC89AL6h9pJASNUbX00Rsq57BV4",
                                  }) => {
    const [loading, setLoading] = useState(false);

    const [coupon, setCoupon] = useState("");
    const [discountPct, setDiscountPct] = useState<number>(0);
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [couponApplied, setCouponApplied] = useState(false);

    const effectiveAmount = useMemo(() => {
        const pct = Math.min(Math.max(discountPct || 0, 0), 100);
        return Math.max(0, +(amount * (1 - pct / 100)).toFixed(2));
    }, [amount, discountPct]);

    const stripePromise = loadStripe(stripePublishableKey);
    const { pathname } = useLocation();
    const [sp, setSp] = useSearchParams();

    // 🔹 exact language segment from the URL (e.g. "el-GR" or "en")
    const lang = useMemo(() => getLangFromPath(pathname), [pathname]);
    const langPrefix = `/${lang}`;

    // URL parts / params
    const parts = pathname.replace(/\/+$/, "").split("/");
    const bookIdx = parts.indexOf("book");
    const categoryId = bookIdx >= 0 ? Number(parts[bookIdx + 1]) : undefined;

    const bookingId = sp.get("bid") || undefined;

    const startIso = sp.get("start");
    const endIso = sp.get("end");
    const startDate = startIso ? dayjs(startIso).format("YYYY-MM-DD") : undefined;
    const endDate = endIso ? dayjs(endIso).format("YYYY-MM-DD") : undefined;

    // ✅ Success/Cancel URLs KEEP the current language prefix and params
    const successParams = new URLSearchParams(sp);
    if (bookingId && !successParams.get("bid")) successParams.set("bid", bookingId);
    successParams.delete("session_id");
    const baseSuccess = `${window.location.origin}${langPrefix}/book/${categoryId}/payment/success`;
    const successUrl = successParams.toString() ? `${baseSuccess}?${successParams.toString()}` : baseSuccess;

    const retryParams = new URLSearchParams(sp);
    retryParams.set("session_id", "{CHECKOUT_SESSION_ID}");
    const baseRetry = `${window.location.origin}${langPrefix}/book/${categoryId}/payment/retry`;
    const cancelUrl = `${baseRetry}?${retryParams.toString()}`;

    const buildMetadata = () => {
        const { telephone, name, last_name } = form.getFieldsValue(["telephone", "name", "last_name"]) as any;
        return { telephone, name, last_name, bookingId, coupon, discountPct };
    };

    const persistToUrl = (coupon?: string | null) => {
        const next = new URLSearchParams(sp);
        if (coupon && coupon.trim()) next.set("coupon", coupon.trim());
        else next.delete("coupon");
        setSp(next, { replace: true });
    };

    const appliedFromUrlRef = useRef(false);
    useEffect(() => {
        if (appliedFromUrlRef.current) return;
        const couponFromUrl = sp.get("coupon");
        if (couponFromUrl) {
            appliedFromUrlRef.current = true;
            setCoupon(couponFromUrl);
            applyCoupon(couponFromUrl, { silent: true }).catch(() => {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const applyCoupon = async (codeArg?: string, opts?: { silent?: boolean }) => {
        const code = (codeArg ?? coupon).trim();
        if (!code) {
            if (!opts?.silent) message.warning("Πληκτρολογήστε έναν κωδικό κουπονιού.");
            return;
        }

        const body = {
            code,
            categoryId: Number.isFinite(categoryId) ? Number(categoryId) : undefined,
            startDate,
            endDate,
        };

        setValidatingCoupon(true);
        try {
            const resp = await myApi.post("booking/discount/validate", body, {
                headers: { "Content-Type": "application/json" },
            });

            const returned = resp?.data;
            const pct =
                typeof returned === "number"
                    ? returned
                    : typeof returned?.percentage === "number"
                        ? returned.percentage
                        : NaN;

            if (!isFinite(pct) || pct <= 0) {
                setDiscountPct(0);
                setCouponApplied(false);
                if (!opts?.silent) message.error("Μη έγκυρο κουπόνι.");
                persistToUrl(null);
                return;
            }

            setDiscountPct(pct);
            setCouponApplied(true);
            setCoupon(code);
            persistToUrl(code);

            try {
                if (bookingId) {
                    const discountedTotal = +(amount * (1 - pct / 100)).toFixed(2);
                    await myApi.post(
                        `booking/${encodeURIComponent(bookingId)}/apply-discount`,
                        {
                            couponCode: code,
                            discountPercentage: pct,
                            originalTotal: amount,
                            discountedTotal,
                        },
                        { headers: { "Content-Type": "application/json" } }
                    );
                }
            } catch (notifyErr) {
                console.warn("Failed to notify backend about discount", notifyErr);
                message.warning("Το κουπόνι εφαρμόστηκε, αλλά δεν ενημερώθηκε ο διακομιστής.");
            }

            if (!opts?.silent) message.success(`Το κουπόνι εφαρμόστηκε: -${pct}%`);
        } catch (e) {
            console.error(e);
            if (!opts?.silent) message.error("Αποτυχία ελέγχου κουπονιού.");
        } finally {
            setValidatingCoupon(false);
        }
    };

    const clearCoupon = () => {
        setCoupon("");
        setDiscountPct(0);
        setCouponApplied(false);
        persistToUrl(null);
    };

    // ---------------- STRIPE ----------------
    const payWithStripe = async (isAdvance: boolean) => {
        if (!stripePromise) return message.error("Stripe key is missing. Επικοινωνήστε με την υποστήριξη.");
        if (!bookingId) return message.error("Δεν υπάρχει bookingId. Παρακαλώ επιστρέψτε στο προηγούμενο βήμα.");

        setLoading(true);
        try {
            const full = effectiveAmount;
            const advanceNominal = 49.99;
            const amountToCharge = isAdvance ? Math.min(advanceNominal, full) : full;

            const resp = await myApi.post(
                `payment/stripe/create-checkout-session/${bookingId}`,
                { amount: amountToCharge, currency, successUrl, cancelUrl, metadata: buildMetadata() },
                { headers: { "Content-Type": "application/json" } }
            );

            const sessionId: string | undefined = resp?.data;
            if (!sessionId) throw new Error("No sessionId returned from backend");

            const stripe = await stripePromise;
            if (!stripe) throw new Error("Stripe failed to load.");

            form.setFieldsValue({ is_advance_paid: isAdvance, payment_method: "stripe", coupon, discountPct });
            const { error } = await stripe.redirectToCheckout({ sessionId });
            if (error) throw error;
        } catch (e) {
            console.error(e);
            message.error("Αποτυχία δημιουργίας πληρωμής Stripe.");
            setLoading(false);
        }
    };

    const hasDiscount = discountPct > 0 && effectiveAmount < amount;

    const headerGradient =
        "linear-gradient(200deg, rgba(95,123,255,0.10) 0%, rgba(47,90,255,0.04) 48%, rgba(47,90,255,0.02) 100%)";
    const couponBoxStyle: React.CSSProperties = { marginTop: 14, border: "1px solid #FFE7BA", background: "rgba(255,249,224,0.18)", borderRadius: 12, padding: 12 };

    return (
        <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 8px 30px rgba(0,0,0,0.06)", overflow: "hidden" }} bodyStyle={{ padding: 0 }}>
            {/* Header */}
            <div style={{ background: headerGradient, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(47,90,255,0.12)" }}>
                <Space align="center">
                    <CreditCardOutlined style={{ color: "#2F5AFF" }} />
                    <Title level={5} style={{ margin: 0 }}>Πληρωμή</Title>
                    {hasDiscount && (
                        <Tag color="green" style={{ borderRadius: 999, marginLeft: 6 }}>
                            <PercentageOutlined /> -{discountPct}%
                        </Tag>
                    )}
                </Space>
                <Space size={6} align="center">
                    <LockOutlined style={{ color: "#2F5AFF" }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>Secure Stripe Checkout</Text>
                </Space>
            </div>

            {/* Content */}
            <div style={{ padding: 18 }}>
                {/* Amounts */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <Text type="secondary">Σύνολο πληρωμής</Text>
                    <div style={{ textAlign: "right" }}>
                        {hasDiscount ? (
                            <>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                                    <Text delete type="secondary">{amount.toFixed(2)} {currency}</Text>
                                    <Statistic value={effectiveAmount} precision={2} suffix={<Text type="secondary" style={{ fontSize: 12 }}>{currency}</Text>} valueStyle={{ fontWeight: 700, fontSize: 22 }} />
                                </div>
                                <Text type="success" style={{ fontSize: 12 }}>
                                    Κουπόνι: -{discountPct}% ({(amount - effectiveAmount).toFixed(2)} {currency})
                                </Text>
                            </>
                        ) : (
                            <Statistic value={amount} precision={2} suffix={<Text type="secondary" style={{ fontSize: 12 }}>{currency}</Text>} valueStyle={{ fontWeight: 700, fontSize: 22 }} />
                        )}
                    </div>
                </div>

                {/* Coupon */}
                <div style={couponBoxStyle}>
                    <Space style={{ width: "100%", justifyContent: "space-between" }} wrap>
                        <Space>
                            <GiftTwoTone twoToneColor={["#FAAD14", "#FFD666"]} />
                            <Text strong>Κουπόνι έκπτωσης</Text>
                        </Space>
                        {couponApplied && (
                            <Space>
                                <CheckCircleTwoTone twoToneColor="#52c41a" />
                                <Text type="success">Εφαρμόστηκε (-{discountPct}%)</Text>
                            </Space>
                        )}
                    </Space>

                    <Space.Compact style={{ width: "100%", marginTop: 10 }}>
                        <Input
                            placeholder="Προσθέστε κωδικό (π.χ. SUMMER25)"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            disabled={validatingCoupon}
                            maxLength={64}
                            allowClear
                        />
                        <Button type="dashed" icon={<PercentageOutlined />} onClick={() => applyCoupon()} loading={validatingCoupon}>
                            Εφαρμογή
                        </Button>
                        {couponApplied && (
                            <Tooltip title="Καθαρισμός κουπονιού">
                                <Button icon={<ClearOutlined />} onClick={clearCoupon} />
                            </Tooltip>
                        )}
                    </Space.Compact>
                </div>

                <Divider style={{ margin: "14px 0" }} />

                {(sp.get("session_id") || sp.get("pay")) && (
                    <Alert
                        type="error"
                        showIcon
                        style={{ marginBottom: 8, borderRadius: 10 }}
                        message="Διακοπή πληρωμής"
                        description={"Διακόψατε τη διαδικασία πληρωμής. Για να καταχωρηθεί η κράτηση σας, ολοκληρώστε την πληρωμή."}
                    />
                )}

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, gap: 12, flexWrap: "wrap" }}>
                    <Button onClick={onPrev} icon={<ArrowLeftOutlined />} size="large">ΠΙΣΩ</Button>
                    <Space wrap>
                        <Tooltip title="Πληρώστε ένα μικρό ποσό για να διασφαλίσετε την κράτηση.">
                            <Button onClick={() => payWithStripe(true)} disabled={effectiveAmount <= 0} size="large">
                                Πληρωμή προκαταβολής
                            </Button>
                        </Tooltip>
                        <Button type="primary" onClick={() => payWithStripe(false)} loading={loading} disabled={effectiveAmount <= 0} size="large">
                            Πληρωμή συνόλου
                        </Button>
                    </Space>
                </div>

                <div style={{ marginTop: 16, padding: "10px 12px", background: "#FAFAFA", borderRadius: 10, border: "1px solid #E6E9F5", display: "flex", alignItems: "center", gap: 8 }}>
                    <LockOutlined style={{ color: "#8C8C8C" }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Μόνο με την ολοκλήρωση της πληρωμής <b>(ολόκληρης ή προκαταβολής)</b> θα καταχωρηθεί η κράτηση.
                    </Text>
                </div>
            </div>
        </Card>
    );
};

export default Payment;
