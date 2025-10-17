// src/pages/extra/ContactUsPage.tsx
import React from "react";
import {
    Card,
    Typography,
    Space,
    Row,
    Col,
    Button,
    Tooltip,
} from "antd";
import {
    PhoneOutlined,
    MailOutlined,
    WhatsAppOutlined,
    CarOutlined,
} from "@ant-design/icons";
import {useLangRouter} from "../../resources/useLangRouter.ts";

const { Title, Paragraph, Text, Link } = Typography;

const brandRed = "#ce0505";
const brandBlue = "#075eff";
const heroGradient = `linear-gradient(135deg, ${brandBlue} 0%, ${brandBlue} 60%, ${brandRed} 100%)`;

export default function ContactUsPage() {
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
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    <Title level={2} style={{ color: "white", margin: 0 }}>
                        Επικοινωνήστε μαζί μας
                    </Title>
                    <Paragraph style={{ color: "rgba(255,255,255,0.9)", marginTop: 8, marginBottom: 0 }}>
                        Χρειάζεστε βοήθεια με κράτηση ή έχετε κάποια απορία; Η ομάδα μας είναι εδώ για εσάς.
                    </Paragraph>
                </div>

                {/* CONTENT */}
                <div style={{ padding: 20 }}>
                    <Row gutter={[24, 24]} align="top" justify="start">
                        {/* Contact details */}
                        <Col xs={24} md={10} style={{ textAlign: "left" }}>
                            <Card bordered style={{ borderRadius: 12 }}>
                                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                                    <Title level={4} style={{ marginTop: 0 }}>Στοιχεία Επικοινωνίας</Title>

                                    <Space size={12} align="start">
                                        <PhoneOutlined style={{ color: brandRed }} />
                                        <div>
                                            <Text strong>Τηλ. Γραφείου</Text>
                                            <div><Link href="tel:+302310460035">+30 2310 460035</Link></div>
                                            <Text strong>Κινητό</Text>
                                            <div><Link href="tel:+306982211001">+30 6982 211 001</Link></div>
                                        </div>
                                    </Space>

                                    <Space size={12} align="start">
                                        <MailOutlined style={{ color: brandRed }} />
                                        <div>
                                            <Text strong>E-mail</Text>
                                            <div><Link href="mailto:info@4rent-thessaloniki.com">info@4rent-thessaloniki.com</Link></div>
                                        </div>
                                    </Space>

                                    <Space wrap>
                                        <Button icon={<PhoneOutlined />} href="tel:+302310460035" style={{ borderRadius: 8 }}>
                                            Κλήση τώρα
                                        </Button>
                                        <Button icon={<MailOutlined />} href="mailto:info@4rent-thessaloniki.com" style={{ borderRadius: 8 }}>
                                            Στείλτε E-mail
                                        </Button>
                                        <Tooltip title="Συνομιλήστε στο WhatsApp">
                                            <Button
                                                icon={<WhatsAppOutlined />}
                                                href="https://wa.me/302310460035"
                                                target="_blank"
                                                style={{ borderRadius: 8 }}
                                            >
                                                WhatsApp
                                            </Button>
                                        </Tooltip>
                                        <Button icon={<CarOutlined />} onClick={() => go("/search")} style={{ borderRadius: 8 }}>
                                            Κράτηση
                                        </Button>
                                    </Space>
                                </Space>
                            </Card>
                        </Col>

                        {/* Map */}
                        <Col xs={24} md={14} style={{ textAlign: "left" }}>
                            <Title level={5} style={{ marginTop: 0 }}>Χάρτης</Title>
                            <div
                                style={{
                                    borderRadius: 12,
                                    overflow: "hidden",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                                    lineHeight: 0,
                                }}
                            >
                                <iframe
                                    title="4rent Thessaloniki – Χάρτης"
                                    aria-label="Χάρτης 4rent Thessaloniki"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    style={{ width: "100%", height: 320, border: 0 }}
                                    src="https://www.google.com/maps?q=4rent%20Thessaloniki&output=embed"
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    );
}
