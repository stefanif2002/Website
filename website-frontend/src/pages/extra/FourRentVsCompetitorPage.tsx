// src/pages/comparison/FourRentVsCompetitorPage.tsx
import React from "react";
import {
    Card,
    Typography,
    Row,
    Col,
    Space,
    Tag,
    Divider,
    Button,
    Tooltip,
    Rate,
} from "antd";
import {
    CheckCircleFilled,
    CloseCircleFilled,
    CarOutlined,
    PhoneOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import {useLangRouter} from "../../resources/useLangRouter.ts";

const { Title, Paragraph, Text } = Typography;

const brandRed = "#ce0505";
const brandBlue = "#075eff";
const heroGradient = `linear-gradient(135deg, ${brandBlue} 0%, ${brandBlue} 60%, ${brandRed} 100%)`;

type FeatureRow = {
    key: string;
    label: string;
    info?: string;
    fourRent: boolean | "partial" | string;    // string for special note (e.g. "Κατόπιν ζήτησης")
    competitor: boolean | "partial" | string;
};

const FEATURES: FeatureRow[] = [
    {
        key: "full-insurance",
        label: "Μικτή ασφάλεια χωρίς απαλλαγή",
        info: "Περιλαμβάνει ελαστικά, κάτω μέρος & τζάμια.",
        fourRent: true,
        competitor: "partial",
    },
    {
        key: "deposit",
        label: "Χωρίς εγγύηση / χωρίς πιστωτική",
        fourRent: true,
        competitor: false,
    },
    {
        key: "second-driver",
        label: "2ος οδηγός χωρίς χρέωση",
        fourRent: true,
        competitor: "partial",
    },
    {
        key: "km",
        label: "Απεριόριστα χιλιόμετρα",
        fourRent: true,
        competitor: false,
    },
    {
        key: "24h",
        label: "24ωρη υποστήριξη & Παράδοση-Παραλαβή",
        fourRent: true,
        competitor: "partial",
    },
    {
        key: "hidden",
        label: "Κανένα κρυφό κόστος",
        fourRent: true,
        competitor: false,
    },
    {
        key: "fleet",
        label: "Σύγχρονος στόλος & καθαρισμός",
        fourRent: true,
        competitor: "partial",
    },
    {
        key: "cancel",
        label: "Ευέλικτη ακύρωση",
        fourRent: "Κατόπιν πολιτικής περιόδου",
        competitor: "Περιορισμοί/penalty",
    },
];

function Cell({ v }: { v: FeatureRow["fourRent"] }) {
    if (v === true) return <CheckCircleFilled style={{ color: "#16a34a", fontSize: 18 }} />;
    if (v === false) return <CloseCircleFilled style={{ color: "#dc2626", fontSize: 18 }} />;
    if (v === "partial")
        return (
            <Tooltip title="Ισχύει με περιορισμούς / πρόσθετη χρέωση.">
                <InfoCircleOutlined style={{ color: "#f59e0b", fontSize: 18 }} />
            </Tooltip>
        );
    // string note
    return <Text type="secondary" style={{ fontSize: 13 }}>{v}</Text>;
}

export default function FourRentVsCompetitorPage() {
    const { go } = useLangRouter(); // <<-- lang-aware helpers

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
                        textAlign: "center",
                    }}
                >
                    <Space direction="vertical" size={8} style={{ width: "100%" }}>
                        <Title level={2} style={{ color: "white", margin: 0 }}>
                            4rent vs Ανταγωνιστής — τι κερδίζετε μαζί μας
                        </Title>
                        <Space align="center" size={10} style={{ justifyContent: "center" }}>
                            <Rate allowHalf disabled defaultValue={4.8} style={{ color: "#ffd666" }} />
                            <Text style={{ color: "rgba(255,255,255,0.95)" }}>4.8/5</Text>
                            <Tag color="gold" style={{ borderRadius: 999, fontWeight: 600 }}>Value for money</Tag>
                        </Space>
                    </Space>
                </div>

                {/* CONTENT */}
                <div style={{ padding: 20 }}>
                    {/* Intro line */}
                    <Paragraph style={{ textAlign: "center", maxWidth: 900, margin: "0 auto 12px" }}>
                        Συγκρίναμε τις πιο σημαντικές παροχές που ζητούν οι πελάτες μας. Με την <Text strong>4rent</Text> ξέρετε
                        ακριβώς τι πληρώνετε: <Text underline>καμία εγγύηση</Text>, <Text underline>κανένα κρυφό κόστος</Text>,
                        πλήρης ασφάλεια και <Text underline>24/7</Text> υποστήριξη.
                    </Paragraph>

                    {/* Blue/Red separator */}
                    <div
                        style={{
                            height: 4,
                            width: 160,
                            margin: "14px auto 24px",
                            borderRadius: 4,
                            background: `linear-gradient(90deg, ${brandBlue}, ${brandRed})`,
                        }}
                    />

                    {/* Feature matrix */}
                    <Card
                        style={{
                            borderRadius: 12,
                            border: "1px solid #e6e9f5",
                            boxShadow: "0 6px 24px rgba(0,0,0,0.04)",
                        }}
                        bodyStyle={{ padding: 0 }}
                    >
                        <Row
                            style={{
                                padding: "12px 16px",
                                borderBottom: "1px solid #eef1f6",
                                background: "#f7fbfc",
                                borderTopLeftRadius: 12,
                                borderTopRightRadius: 12,
                                fontWeight: 700,
                                color: brandBlue,
                            }}
                        >
                            <Col xs={12}>Παροχή</Col>
                            <Col xs={6} style={{ textAlign: "center" }}>
                                4rent
                            </Col>
                            <Col xs={6} style={{ textAlign: "center" }}>
                                Ανταγωνιστής
                            </Col>
                        </Row>

                        {FEATURES.map((f, idx) => (
                            <Row
                                key={f.key}
                                style={{
                                    padding: "12px 16px",
                                    borderBottom: idx === FEATURES.length - 1 ? "0 none" : "1px solid #f0f2f6",
                                }}
                                align="middle"
                            >
                                <Col xs={12}>
                                    <Space size={6}>
                                        <Text strong>{f.label}</Text>
                                        {f.info ? (
                                            <Tooltip title={f.info}>
                                                <InfoCircleOutlined style={{ color: "#8fa3d8" }} />
                                            </Tooltip>
                                        ) : null}
                                    </Space>
                                </Col>
                                <Col xs={6} style={{ textAlign: "center" }}>
                                    <Cell v={f.fourRent} />
                                </Col>
                                <Col xs={6} style={{ textAlign: "center" }}>
                                    <Cell v={f.competitor} />
                                </Col>
                            </Row>
                        ))}
                    </Card>

                    {/* Price transparency / examples */}
                    <Row gutter={[16, 16]} style={{ marginTop: 18 }}>
                        <Col xs={24} md={12}>
                            <Card
                                title="Διαφάνεια Τιμής"
                                headStyle={{ borderBottom: `2px solid ${brandBlue}`, color: brandBlue }}
                                style={{ borderRadius: 12, border: "1px solid #e6e9f5" }}
                            >
                                <Space direction="vertical" size={6}>
                                    <Text>✓ Τελική τιμή στο καλάθι — χωρίς «έξτρα στο ταμείο»</Text>
                                    <Text>✓ Φόροι/Τέλη <Text strong>περιλαμβάνονται</Text></Text>
                                    <Text>✓ Δωρεάν 2ος οδηγός</Text>
                                    <Text>✓ 24/7 παράδοση-παραλαβή με συνεννόηση</Text>
                                </Space>
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card
                                title="Συχνά «κρυφά» elsewhere"
                                headStyle={{ borderBottom: `2px solid ${brandRed}`, color: brandRed }}
                                style={{ borderRadius: 12, border: "1px solid #e6e9f5" }}
                            >
                                <Space direction="vertical" size={6}>
                                    <Text>• Απαλλαγές ασφάλειας/ζημιών</Text>
                                    <Text>• Τέλη αεροδρομίου/νυχτερινής παράδοσης</Text>
                                    <Text>• Χρέωση 2ου οδηγού</Text>
                                    <Text>• Περιορισμένα χιλιόμετρα</Text>
                                </Space>
                            </Card>
                        </Col>
                    </Row>

                    {/* CTA row */}
                    <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                        <Col xs={24} md={12}>
                            <Button
                                icon={<PhoneOutlined />}
                                style={{ width: "100%", height: 44, borderColor: brandBlue, color: brandBlue }}
                                href="tel:+302310460035"
                            >
                                Καλέστε μας: +30 2310 460035
                            </Button>
                        </Col>
                        <Col xs={24} md={12}>
                            <Button
                                type="primary"
                                icon={<CarOutlined />}
                                style={{ width: "100%", height: 44 }}
                                onClick={() => go("/search")}
                            >
                                Κάντε κράτηση τώρα
                            </Button>
                        </Col>
                    </Row>

                    <Divider />

                    {/* Small note */}
                    <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0 }}>
                        * Η σύγκριση βασίζεται σε τυπικές πολιτικές/χρεώσεις της αγοράς. Ενδέχεται να υπάρχουν διαφοροποιήσεις ανά
                        περίοδο, όχημα και πάροχο. Για πλήρεις όρους, συμβουλευτείτε τους όρους μίσθωσης της 4rent.
                    </Paragraph>
                </div>
            </Card>
        </div>
    );
}
