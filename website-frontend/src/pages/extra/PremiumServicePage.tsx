// src/pages/premium/PremiumServicePage.tsx
import React from "react";
import { Card, Typography, Row, Col, Space, Divider, Button } from "antd";
import { CheckCircleFilled, CloseCircleFilled, CarOutlined } from "@ant-design/icons";
import { useLangRouter } from "../../resources/useLangRouter.ts";
import { Trans, useTranslation } from "react-i18next";

const { Title, Paragraph, Text } = Typography;

const brandRed = "#ce0505";
const brandBlue = "#075eff";
const heroGradient = `linear-gradient(135deg, ${brandBlue} 0%, ${brandBlue} 60%, ${brandRed} 100%)`;

type FeatureRow = { key: string; label: string; regular: boolean; premium: boolean };

const FEATURES: FeatureRow[] = [
    { key: "cars",      label: "", regular: true,  premium: true },
    { key: "change",    label: "", regular: false, premium: true },
    { key: "cancel",    label: "", regular: false, premium: true },
    { key: "card",      label: "", regular: false, premium: true },
    { key: "insurance", label: "", regular: false, premium: true },
    { key: "priority",  label: "", regular: false, premium: true },
];

// ---- helper: always return an array for list keys ----
function useList(t: (k: string, o?: any) => any, key: string) {
    const v = t(key, { returnObjects: true });
    if (Array.isArray(v)) return v as string[];
    if (v == null || v === "") return [] as string[];
    return [String(v)];
}

function Cell({ active }: { active: boolean }) {
    return active ? (
        <CheckCircleFilled style={{ color: "#22c55e", fontSize: 18 }} />
    ) : (
        <CloseCircleFilled style={{ color: "#ef4444", fontSize: 18 }} />
    );
}

export default function PremiumServicePage() {
    const { go } = useLangRouter();
    const { t } = useTranslation("extraPages"); // <-- correct namespace

    const checks = useList(t, "premium.checks"); // <-- always an array

    return (
        <div style={{ width: "100%", margin: "0 auto", padding: "0 16px", maxWidth: 1140 }}>
            <Card bordered={false} style={{ marginTop: 16, borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 28px rgba(0,0,0,0.08)" }} bodyStyle={{ padding: 0 }}>
                {/* HERO */}
                <div style={{ background: heroGradient, color: "white", padding: "28px 24px", textAlign: "center" }}>
                    <Space direction="vertical" size={8} style={{ width: "100%" }}>
                        <Title level={2} style={{ color: "white", margin: 0 }}>
                            {t("premium.hero")}
                        </Title>
                    </Space>
                </div>

                {/* CONTENT */}
                <div style={{ padding: 20 }}>
                    <Title level={5} style={{ maxWidth: 800, margin: "auto", textAlign: "center" }}>
                        {t("premium.subhero")}
                    </Title>

                    {/* Checks + center text */}
                    <Row gutter={[24, 24]} align="middle" style={{ marginTop: 40, marginBottom: 12 }}>
                        <Col xs={24} md={12}>
                            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
                                {checks.map((text, i) => (
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
                            <div style={{ height: "100%", width: 2, background: "rgba(0,0,0,0.08)", minHeight: 120 }} />
                        </Col>

                        {/* Center text */}
                        <Col xs={24} md={10} style={{ textAlign: "center" }}>
                            <Paragraph style={{ marginBottom: 0 }}>
                                <Trans i18nKey="premium.centerLine" ns="extraPages" components={{ b: <Text strong /> }} />
                            </Paragraph>
                            <Paragraph type="secondary" style={{ marginTop: 4 }}>
                                {t("premium.centerNote")}
                            </Paragraph>
                        </Col>
                    </Row>

                    {/* Regular vs Premium */}
                    <Row justify="center" style={{ textAlign: "center", marginTop: 24, marginBottom: 16 }}>
                        <Col>
                            <Title level={2} style={{ margin: 0 }}>
                                <Text style={{ color: "#9ca3af", fontWeight: 700 }}>{t("premium.regular")}</Text>{" "}
                                <Text style={{ color: "#9ca3af", fontWeight: 700 }}>{t("premium.vs")}</Text>{" "}
                                <Text style={{ color: "#f59e0b", fontWeight: 800 }}>{t("premium.premium")}</Text>
                            </Title>
                            <Title level={2} style={{ margin: 0, color: "#22c55e" }}>{t("premium.priceLine")}</Title>
                        </Col>
                    </Row>

                    <Divider />

                    {/* Feature Table */}
                    <Card style={{ borderRadius: 12, border: "1px solid #e6e9f5", boxShadow: "0 4px 18px rgba(0,0,0,0.04)" }} bodyStyle={{ padding: 0 }}>
                        <Row
                            style={{
                                background: "#f7fbfc",
                                borderBottom: "1px solid #eef1f6",
                                fontWeight: 700,
                                color: brandBlue,
                                padding: "12px 16px",
                            }}
                        >
                            <Col xs={12}>{t("premium.table.header.feature")}</Col>
                            <Col xs={6} style={{ textAlign: "center" }}>{t("premium.table.header.regular")}</Col>
                            <Col xs={6} style={{ textAlign: "center" }}>{t("premium.table.header.premium")}</Col>
                        </Row>

                        {FEATURES.map((f, i) => (
                            <Row key={f.key} align="middle" style={{ borderBottom: i === FEATURES.length - 1 ? "none" : "1px solid #f0f2f6", padding: "12px 16px" }}>
                                <Col xs={12}>
                                    <Text strong>{t(`premium.features.${f.key}`)}</Text>
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

                    {/* CTA */}
                    <div style={{ textAlign: "center", marginTop: 24, marginBottom: 8 }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<CarOutlined />}
                            onClick={() => go("/search")}
                            style={{ backgroundColor: brandRed, borderColor: brandRed, paddingInline: 20, borderRadius: 8 }}
                        >
                            {t("premium.cta")}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
