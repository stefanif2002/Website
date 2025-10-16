// src/pages/reviews/ReviewsPage.tsx
import React, { useMemo, useState } from "react";
import {
    Card,
    Typography,
    Row,
    Col,
    Space,
    Image,
    Divider,
    Button,
    Rate,
    Tooltip,
    Input,
    message,
} from "antd";
import { MessageOutlined, SendOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text, Link } = Typography;
const { TextArea } = Input;

const brandRed = "#ce0505";
const brandBlue = "#075eff";
const heroGradient = `linear-gradient(135deg, ${brandBlue} 0%, ${brandBlue} 60%, ${brandRed} 100%)`;

type Review = { text: string; author?: string };

const REVIEWS: Review[] = [
    // ... (unchanged list you already have)
    { text: "Γεια σου ομάδα 4rent νοικιάσαμε ένα αυτοκίνητο για 3 εβδομάδες. Όλα ήταν υπέροχα! Το αυτοκίνητο ήταν υπέροχο, η επαφή ήταν πολύ φιλική και απλή και η αναλογία τιμής/απόδοσης ήταν πολύ καλή! Μπορούμε μόνο να προτείνουμε αυτήν την εταιρεία και θα κάνουμε κράτηση ξανά και ξανά! Τις καλύτερες ευχές" },
    { text: "Ρουθ και Τσαρλς" },
    { text: "Γεια σας αγαπητοί υπάλληλοι της 4rent, ενοικίασα ένα αυτοκινητο από εσάς μεσαιας κατηγορίας για πρώτη φορά! Αυτοκίνητο υπέροχο Υπέροχη εξυπηρέτηση Παραλαβή - Παράδοση εξαιρετική Καλή διακοπές σε όλους!", author: "Σουσανα Μ." },
    { text: "Η καλύτερη ενοικίαση αυτοκινήτου που είχα ποτέ στη Θεσσαλονίκη. Άψογη εξυπηρέτηση, άψογη επικοινωνία! Συνιστούμε!", author: "Μιχαλης Κ." },
    { text: "Πολύ καλή εξυπηρέτηση με χαμόγελο και ευγένεια. Τα παιδιά συνεπέστατα και πολύ καλό αυτοκίνητο.", author: "Ειρήνη Θ." },
    { text: "Σε σύγκριση με άλλες μεγάλες εταιρείες ενοικίασης αυτοκινήτων, αυτή η εταιρεία εντυπωσιάζει με τον απόλυτα επαγγελματικό, απλό χειρισμό...", author: "Günter H." },
    { text: "Καλησπέρα, Ήθελα να σας ευχαριστήσω για την υψηλού επιπέδου εξυπηρέτηση...", author: "Γιώργος Κ." },
    { text: "Μπορώ να πω μονο σουπερ, σουπερ. Ολα τελεια. Ευχαριστώ πολύ.", author: "Eva N." },
    { text: "Με εξυπηρέτησαν με πολλές φορές με πολύ καλά αυτοκίνητα...", author: "Θεοφιλος Κ." },
    { text: "Αψογη εξυπηρέτηση και πολύ καλο αυτοκινητο!!!", author: "Pon N." },
    { text: "Άψογη εξυπηρέτηση, πολύ καλή τιμή...", author: "Wagelis A." },
    { text: "Άριστη εξυπηρέτηση!!! Ευχαρίστως ξανα", author: "Lazaros M." },
    { text: "Αψωγη εταιρια. Φιλοικο πρωσοπικο πολυ καλες τιμες.", author: "Giorgos K." },
    { text: "Άριστη εξυπηρέτηση και άψογη συμπεριφορά των υπαλλήλων.", author: "ΓΕΩΡΓΙΟΣ Κ." },
    { text: "Οι καλύτεροι 5 Αστέρια", author: "Grigorios T." },
    { text: "Να είμαι ειλικρινής καλύτερη εξυπηρέτηση...", author: "Tom Seon" },
    { text: "Η καλύτερη επιλογή για ενοικίαση αυτοκινήτου από το αεροδρόμιο...", author: "Nikos S." },
    { text: "Η εταιρεία ενοικίασης αυτοκινήτων 4rent συνιστάται πραγματικά...", author: "Sonja L." },
];

// Tiny inline SVGs for Trustpilot & HolidayCheck
const TrustpilotIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden focusable="false">
        <path fill="#00b67a" d="M12 2l2.472 7.604h7.992l-6.463 4.696 2.472 7.6L12 17.205 5.527 21.9l2.472-7.6L1.536 9.604h7.992z"/>
    </svg>
);
const HolidayCheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 64 64" aria-hidden focusable="false">
        <rect x="4" y="14" width="56" height="36" rx="6" fill="#1b75bb"/>
        <circle cx="50" cy="32" r="6" fill="#ffd200"/>
    </svg>
);

export default function ReviewsPage() {
    const average = 4.5;

    // user rating
    const [rating, setRating] = useState<number>(5);
    const [note, setNote] = useState<string>("");

    const mailtoHref = useMemo(() => {
        const subject = encodeURIComponent(`Νέα Αξιολόγηση: ${rating}/5`);
        const body = encodeURIComponent(`Βαθμολογία: ${rating}/5\n\nΣχόλιο:\n${note || "(χωρίς σχόλιο)"}`);
        return `mailto:feedback@4rent-thessaloniki.com?subject=${subject}&body=${body}`;
    }, [rating, note]);

    const submitLocal = () => {
        if (!rating) {
            message.warning("Επιλέξτε μια βαθμολογία (αστέρια).");
            return;
        }
        window.location.href = mailtoHref;
    };

    return (
        <div style={{ width: "100%", margin: "0 auto", padding: "0 16px", maxWidth: 1140 }}>
            <Card
                bordered={false}
                style={{ marginTop: 16, borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 28px rgba(0,0,0,0.08)" }}
                bodyStyle={{ padding: 0 }}
            >
                {/* HERO */}
                <div
                    style={{
                        background: heroGradient,
                        color: "white",
                        padding: "28px 24px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",     // <— center everything
                        textAlign: "center",
                    }}
                >
                    <Title level={2} style={{ color: "white", margin: 0 }}>
                        Ενοικίαση Αυτοκινήτου Θεσσαλονική — κριτικές & εμπειρίες
                    </Title>
                    {/* centered rating */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                        <Rate allowHalf disabled defaultValue={average} style={{ color: "#ffd666" }} />
                        <Text style={{ color: "rgba(255,255,255,0.95)" }}>{average.toFixed(1)}/5</Text>
                    </div>
                </div>

                {/* Top image */}
                <div style={{ padding: 20 }}>
                    <Row gutter={[24, 24]} align="middle">
                        <Col span={24}>
                            <Image
                                src="https://4rent-thessaloniki.com/images/Deals/bewertung-el.png"
                                alt="κριτικές ενοικίασεις αυτοκινητου θεσσαλονικη"
                                style={{ width: "100%", borderRadius: 12 }}
                                preview={false}
                            />
                        </Col>
                    </Row>

                    {/* Blue/Red separator */}
                    <div
                        style={{
                            height: 4,
                            width: 160,
                            margin: "22px auto",
                            borderRadius: 4,
                            background: `linear-gradient(90deg, ${brandBlue}, ${brandRed})`,
                        }}
                    />

                    {/* Better layout: left = rating sites card, right = your rating card */}
                    <Row gutter={[24, 24]} style={{ marginBottom: 8 }}>
                        <Col xs={24} md={12}>
                            <Card
                                title="Αξιολογήστε μας σε"
                                headStyle={{ borderBottom: `2px solid ${brandBlue}`, color: brandBlue }}
                                style={{ borderRadius: 12, border: "1px solid #e6e9f5" }}
                                bodyStyle={{ padding: 16 }}
                            >
                                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                                    <Paragraph style={{ margin: 0 }}>
                                        Διαβάστε γνήσιες κριτικές πελατών και αξιολογήστε μας με ένα κλικ:
                                    </Paragraph>

                                    {/* Icon-only external links, evenly spaced */}
                                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                        <Tooltip title="Google">
                                            <Button
                                                href="https://www.google.com"
                                                target="_blank"
                                                rel="noreferrer"
                                                shape="circle"
                                                size="large"
                                                style={{ borderColor: brandBlue, color: brandBlue }}
                                                icon={<i className="bi bi-google" style={{ fontSize: 18 }} />}
                                            />
                                        </Tooltip>

                                        <Tooltip title="Trustpilot">
                                            <Button
                                                href="https://www.trustpilot.com"
                                                target="_blank"
                                                rel="noreferrer"
                                                shape="circle"
                                                size="large"
                                                style={{ borderColor: brandBlue }}
                                                icon={<TrustpilotIcon />}
                                            />
                                        </Tooltip>

                                        <Tooltip title="Facebook">
                                            <Button
                                                href="https://www.facebook.com/4rent.thessaloniki"
                                                target="_blank"
                                                rel="noreferrer"
                                                shape="circle"
                                                size="large"
                                                style={{ borderColor: brandBlue, color: brandBlue }}
                                                icon={<i className="bi bi-facebook" style={{ fontSize: 18 }} />}
                                            />
                                        </Tooltip>

                                        <Tooltip title="HolidayCheck">
                                            <Button
                                                href="https://www.holidaycheck.de"
                                                target="_blank"
                                                rel="noreferrer"
                                                shape="circle"
                                                size="large"
                                                style={{ borderColor: brandBlue }}
                                                icon={<HolidayCheckIcon />}
                                            />
                                        </Tooltip>
                                    </div>

                                    {/* Email line with static stars */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <Rate disabled value={5} style={{ color: "#ffd666" }} />
                                        <Text>
                                            Αξιολογήστε μας:{" "}
                                            <Link href="mailto:feedback@4rent-thessaloniki.com">
                                                feedback@4rent-thessaloniki.com
                                            </Link>
                                        </Text>
                                    </div>
                                </Space>
                            </Card>
                        </Col>

                        <Col xs={24} md={12}>
                            <Card
                                title="Η δική σας αξιολόγηση"
                                headStyle={{ borderBottom: `2px solid ${brandBlue}`, color: brandBlue }}
                                style={{ borderRadius: 12, border: "1px solid #e6e9f5" }}
                                bodyStyle={{ padding: 16 }}
                            >
                                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                                    <Rate allowHalf value={rating} onChange={setRating} style={{ color: "gold", fontSize: 24 }} />
                                    <TextArea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Προαιρετικό σχόλιο…"
                                        autoSize={{ minRows: 3, maxRows: 5 }}
                                    />
                                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                                        <Button onClick={() => { setRating(0); setNote(""); }}>Καθαρισμός</Button>
                                        <Button
                                            type="primary"
                                            icon={<SendOutlined />}
                                            style={{ backgroundColor: brandRed, borderColor: brandRed }}
                                            onClick={submitLocal}
                                        >
                                            Αποστολή
                                        </Button>
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                    </Row>

                    <Divider />

                    {/* Reviews list */}
                    <Row gutter={[16, 16]}>
                        {REVIEWS.map((r, i) => (
                            <Col xs={24} md={12} key={i}>
                                <Card
                                    size="small"
                                    style={{
                                        borderRadius: 10,
                                        border: "1px solid #e6e9f5",
                                        borderLeft: `4px solid ${brandBlue}`,
                                    }}
                                    bodyStyle={{ padding: 14 }}
                                >
                                    <Space direction="vertical" size={8} style={{ width: "100%" }}>
                                        <Text>
                                            <MessageOutlined style={{ marginRight: 8, color: brandBlue }} />
                                            {r.text}
                                        </Text>
                                        {r.author ? (
                                            <Text type="secondary" style={{ fontWeight: 600, display: "block", marginTop: 4 }}>
                                                — {r.author}
                                            </Text>
                                        ) : null}
                                    </Space>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Card>
        </div>
    );
}
