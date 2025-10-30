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
import { useLangRouter } from "../../resources/useLangRouter.ts";
import { useTranslation } from "react-i18next";

const { Title, Paragraph, Text, Link } = Typography;

const brandRed = "#ce0505";
const brandBlue = "#075eff";
const heroGradient = `linear-gradient(135deg, ${brandBlue} 0%, ${brandBlue} 60%, ${brandRed} 100%)`;

export default function ContactUsPage() {
    const { go } = useLangRouter();
    const { t } = useTranslation("extraPages");

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
                        {t("contactUs.heroTitle")}
                    </Title>
                    <Paragraph style={{ color: "rgba(255,255,255,0.9)", marginTop: 8, marginBottom: 0 }}>
                        {t("contactUs.heroSubtitle")}
                    </Paragraph>
                </div>

                {/* CONTENT */}
                <div style={{ padding: 20 }}>
                    <Row gutter={[24, 24]} align="top" justify="start">
                        {/* Contact details */}
                        <Col xs={24} md={10} style={{ textAlign: "left" }}>
                            <Card bordered style={{ borderRadius: 12 }}>
                                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                                    <Title level={4} style={{ marginTop: 0 }}>{t("contactUs.sectionTitle")}</Title>

                                    <Space size={12} align="start">
                                        <PhoneOutlined style={{ color: brandRed }} />
                                        <div>
                                            <Text strong>{t("contactUs.officePhoneLabel")}</Text>
                                            <div>
                                                <Link href={`tel:${t("contactUs.officePhoneHref")}`}>
                                                    {t("contactUs.officePhoneDisplay")}
                                                </Link>
                                            </div>
                                            <Text strong>{t("contactUs.mobileLabel")}</Text>
                                            <div>
                                                <Link href={`tel:${t("contactUs.mobileHref")}`}>
                                                    {t("contactUs.mobileDisplay")}
                                                </Link>
                                            </div>
                                        </div>
                                    </Space>

                                    <Space size={12} align="start">
                                        <MailOutlined style={{ color: brandRed }} />
                                        <div>
                                            <Text strong>{t("contactUs.emailLabel")}</Text>
                                            <div>
                                                <Link href={`mailto:${t("contactUs.emailAddress")}`}>
                                                    {t("contactUs.emailAddress")}
                                                </Link>
                                            </div>
                                        </div>
                                    </Space>

                                    <Space wrap>
                                        <Button icon={<PhoneOutlined />} href={`tel:${t("contactUs.officePhoneHref")}`} style={{ borderRadius: 8 }}>
                                            {t("contactUs.callNow")}
                                        </Button>
                                        <Button icon={<MailOutlined />} href={`mailto:${t("contactUs.emailAddress")}`} style={{ borderRadius: 8 }}>
                                            {t("contactUs.sendEmail")}
                                        </Button>
                                        <Tooltip title={t("contactUs.whatsAppTooltip")}>
                                            <Button
                                                icon={<WhatsAppOutlined />}
                                                href={t("contactUs.whatsAppHref")}
                                                target="_blank"
                                                style={{ borderRadius: 8 }}
                                            >
                                                {t("contactUs.whatsAppButton")}
                                            </Button>
                                        </Tooltip>
                                        <Button icon={<CarOutlined />} onClick={() => go("/search")} style={{ borderRadius: 8 }}>
                                            {t("contactUs.book")}
                                        </Button>
                                    </Space>
                                </Space>
                            </Card>
                        </Col>

                        {/* Map */}
                        <Col xs={24} md={14} style={{ textAlign: "left" }}>
                            <Title level={5} style={{ marginTop: 0 }}>{t("contactUs.mapTitle")}</Title>
                            <div
                                style={{
                                    borderRadius: 12,
                                    overflow: "hidden",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                                    lineHeight: 0,
                                }}
                            >
                                <iframe
                                    title={t("contactUs.mapIframeTitle")}
                                    aria-label={t("contactUs.mapAriaLabel")}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    style={{ width: "100%", height: 320, border: 0 }}
                                    src={t("contactUs.mapSrc")}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    );
}
