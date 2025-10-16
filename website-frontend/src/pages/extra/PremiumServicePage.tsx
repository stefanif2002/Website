// src/pages/premium/PremiumServicePage.tsx
import React from "react";
import {
    Card,
    Typography,
    Row,
    Col,
    Space,
    Divider,
    Button,
} from "antd";
import {
    CheckCircleFilled,
    CloseCircleFilled,
    CarOutlined,
} from "@ant-design/icons";
import {useLangRouter} from "../../resources/useLangRouter.ts";

const { Title, Paragraph, Text } = Typography;


const brandRed = "#ce0505";
const brandBlue = "#075eff";
const heroGradient = `linear-gradient(135deg, ${brandBlue} 0%, ${brandBlue} 60%, ${brandRed} 100%)`;

type FeatureRow = { key: string; label: string; regular: boolean; premium: boolean };

const FEATURES: FeatureRow[] = [
    { key: "cars", label: "Καινούργια Αυτοκίνητα", regular: true, premium: true },
    { key: "change", label: "Αλλαγή κράτησης", regular: false, premium: true },
    { key: "cancel", label: "Ακύρωση έως 2 ημέρες πριν την άφιξη", regular: false, premium: true },
    { key: "card", label: "Κάρτα μέλους = 10% έκπτωση για την επόμενη κράτησή σας", regular: false, premium: true },
    { key: "insurance", label: "Ασφάλιση ταξιδιού (π.χ. πλοίο για Θάσο)", regular: false, premium: true },
    { key: "priority", label: "Προτεραιότητα στην εξυπηρέτηση", regular: false, premium: true },
];

function Cell({ active }: { active: boolean }) {
    return active ? (
        <CheckCircleFilled style={{ color: "#22c55e", fontSize: 18 }} />
    ) : (
        <CloseCircleFilled style={{ color: "#ef4444", fontSize: 18 }} />
    );
}

export default function PremiumServicePage() {
    const { go } = useLangRouter(); // <<-- lang-aware helpers

    return (
        <div style={{ width: "100%", margin: "0 auto", padding: "0 16px", maxWidth: 1140 }}>
            <Card
                bordered={false}
                style={{
                    marginTop: 16, // same as ReviewsPage
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
                }}
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
                            Premium πακέτο μόνο με 1,00 € ανά ημέρα !!
                        </Title>
                    </Space>
                </div>

                {/* CONTENT */}
                <div style={{ padding: 20 }}>
                    <Title level={5} style={{ maxWidth: 800, margin: "auto", textAlign: "center" }}>
                        Επιπλέον, επιλέγοντας την έξτρα Υπηρεσία Premium, αποκτάτε πρόσβαση σε πρόσθετες υπηρεσίες όπως δωρεάν ακύρωση, αλλαγή ημερομηνίας.
                    </Title>

                    {/* Checks + center text on same row */}
                    <Row gutter={[24, 24]} align="middle" style={{ marginTop: 40, marginBottom: 12 }}>
                        <Col xs={24} md={12}>
                            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
                                {[
                                    "Δωρεάν αλλαγή κράτησης (αναπροσαρμογή τιμής +/- διαφορά τιμής με τρέχον τιμοκατάλογο)",
                                    "Δωρεάν ακύρωση έως 48 ώρες πριν την παραλαβή.",
                                    "Ασφάλιση ταξιδιού Πλοίου για το αυτοκίνητο (π.χ. Θάσος)",
                                    "Κάρτα μέλους = 10% έκπτωση για την επόμενη κράτησή σας",
                                ].map((text, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 8,
                                            marginBottom: 8,
                                            lineHeight: 1.6,
                                            fontSize: 16,
                                            textAlign: "left",
                                        }}
                                    >
                                        <span style={{ color: "#22c55e", fontSize: 18, lineHeight: 1.3 }}>✓</span>
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </Col>

                        {/* Vertical divider */}
                        <Col flex="none">
                            <div
                                style={{
                                    height: "100%",
                                    width: 2,
                                    background: "rgba(0,0,0,0.08)",
                                    minHeight: 120,
                                }}
                            />
                        </Col>

                        {/* Center text */}
                        <Col xs={24} md={10} style={{ textAlign: "center" }}>
                            <Paragraph style={{ marginBottom: 0 }}>
                                Τα οφέλη σας ως Premium πελάτης με <br />
                                μόλις <Text strong>1,00 € την ημέρα</Text>.
                            </Paragraph>
                            <Paragraph type="secondary" style={{ marginTop: 4 }}>
                                Λαμβάνετε επίσης την κάρτα μέλους 10% έκπτωση για την επόμενη κράτησή σας.
                            </Paragraph>
                        </Col>
                    </Row>

                    {/* Regular vs Premium */}
                    <Row justify="center" style={{ textAlign: "center", marginTop: 24, marginBottom: 16 }}>
                        <Col>
                            <Title level={2} style={{ margin: 0 }}>
                                <Text style={{ color: "#9ca3af", fontWeight: 700 }}>Regular</Text>{" "}
                                <Text style={{ color: "#9ca3af", fontWeight: 700 }}>vs</Text>{" "}
                                <Text style={{ color: "#f59e0b", fontWeight: 800 }}>Premium</Text>
                            </Title>
                            <Title level={2} style={{ margin: 0, color: "#22c55e" }}>
                                1,00€ / ημέρα
                            </Title>
                        </Col>
                    </Row>

                    <Divider />

                    {/* Feature Table */}
                    <Card
                        style={{
                            borderRadius: 12,
                            border: "1px solid #e6e9f5",
                            boxShadow: "0 4px 18px rgba(0,0,0,0.04)",
                        }}
                        bodyStyle={{ padding: 0 }}
                    >
                        <Row
                            style={{
                                background: "#f7fbfc",
                                borderBottom: "1px solid #eef1f6",
                                fontWeight: 700,
                                color: brandBlue,
                                padding: "12px 16px",
                            }}
                        >
                            <Col xs={12}>Παροχή</Col>
                            <Col xs={6} style={{ textAlign: "center" }}>
                                Regular
                            </Col>
                            <Col xs={6} style={{ textAlign: "center" }}>
                                Premium
                            </Col>
                        </Row>

                        {FEATURES.map((f, i) => (
                            <Row
                                key={f.key}
                                align="middle"
                                style={{
                                    borderBottom: i === FEATURES.length - 1 ? "none" : "1px solid #f0f2f6",
                                    padding: "12px 16px",
                                }}
                            >
                                <Col xs={12}>
                                    <Text strong>{f.label}</Text>
                                </Col>
                                <Col xs={6} style={{ textAlign: "center" }}>
                                    <Cell active={f.regular} />
                                </Col>
                                <Col xs={6} style={{ textAlign: "center" }}>
                                    <Cell active={f.premium} />
                                </Col>
                            </Row>
                        ))}
                    </Card>

                    {/* CTA button */}
                    <div style={{ textAlign: "center", marginTop: 24, marginBottom: 8 }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<CarOutlined />}
                            onClick={() => go("/search")}
                            style={{
                                backgroundColor: brandRed,
                                borderColor: brandRed,
                                paddingInline: 20,
                                borderRadius: 8,
                            }}
                        >
                            Κάντε Κράτηση Τώρα
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
