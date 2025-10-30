// src/pages/extra/ChalkidikiRentPage.tsx
import React from "react";
import {
    Card,
    Typography,
    Space,
    Row,
    Col,
    Divider,
    Button,
    Image,
} from "antd";
import { CarOutlined, EnvironmentOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import { useLangRouter } from "../../resources/useLangRouter.ts";
import { useTranslation } from "react-i18next";

const { Title, Paragraph, Text } = Typography;

const brandRed = "#ce0505";
const brandBlue = "#075eff";
const heroGradient = `linear-gradient(135deg, ${brandBlue} 0%, ${brandBlue} 60%, ${brandRed} 100%)`;

export default function ChalkidikiRentPage() {
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
                        {t("chalkidiki.heroTitle")}
                    </Title>
                </div>

                {/* CONTENT */}
                <div style={{ padding: 20 }}>
                    <Row gutter={[24, 24]} align="top" justify="start">
                        <Col xs={24} md={9}>
                            <Image
                                src="https://4rent-thessaloniki.com/images/Logos/4Rent_Chalkidiki.jpg"
                                alt={t("chalkidiki.heroImageAlt")}
                                style={{ borderRadius: 12, width: "100%" }}
                                preview={false}
                            />
                        </Col>

                        <Col xs={24} md={15}>
                            <Space direction="vertical" size={12} style={{ width: "100%", textAlign: "left" }}>
                                <Paragraph style={{ marginBottom: 4 }}>
                                    {t("chalkidiki.p1")}
                                </Paragraph>

                                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                                    <div>
                                        <CheckCircleTwoTone twoToneColor="#52c41a" />{" "}
                                        <Text>{t("chalkidiki.b1")}</Text>
                                    </div>
                                    <div>
                                        <CheckCircleTwoTone twoToneColor="#52c41a" />{" "}
                                        <Text>{t("chalkidiki.b2")}</Text>
                                    </div>
                                    <div>
                                        <CheckCircleTwoTone twoToneColor="#52c41a" />{" "}
                                        <Text>{t("chalkidiki.b3")}</Text>
                                    </div>
                                </Space>
                            </Space>
                        </Col>
                    </Row>

                    <Divider />

                    <Row gutter={[24, 24]} align="top" justify="start">
                        <Col xs={24} md={9}>
                            <Image
                                src="https://4rent-thessaloniki.com/images/Logos/chalkidiki-map.png"
                                alt={t("chalkidiki.mapAlt")}
                                style={{ borderRadius: 12, width: "100%" }}
                                preview={false}
                            />
                        </Col>

                        <Col xs={24} md={15} style={{ textAlign: "left" }}>
                            <Title level={4} style={{ marginTop: 0 }}>
                                <EnvironmentOutlined /> {t("chalkidiki.pointsTitle")}
                            </Title>

                            <Space direction="vertical" size={14} style={{ width: "100%" }}>
                                <div>
                                    <Text strong>{t("chalkidiki.r50.title")}</Text>
                                    <Paragraph style={{ marginTop: 6, marginBottom: 0 }}>
                                        {t("chalkidiki.r50.list")}
                                    </Paragraph>
                                </div>

                                <div>
                                    <Text strong>{t("chalkidiki.r100.title")}</Text>
                                    <Paragraph style={{ marginTop: 6, marginBottom: 0 }}>
                                        {t("chalkidiki.r100.list")}
                                    </Paragraph>
                                </div>

                                <div>
                                    <Text strong>{t("chalkidiki.r120.title")}</Text>
                                    <Paragraph style={{ marginTop: 6, marginBottom: 0 }}>
                                        {t("chalkidiki.r120.list")}
                                    </Paragraph>
                                </div>
                            </Space>
                        </Col>
                    </Row>

                    <Divider />

                    <Row justify="center">
                        <Col>
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
                                {t("chalkidiki.bookNow")}
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    );
}
