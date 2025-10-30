// src/pages/cheap/CheapRentalsTruthPage.tsx
import React from "react";
import { Card, Typography, Row, Col, Space, Divider, Tag, Button } from "antd";
import { CarOutlined, CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { useLangRouter } from "../../resources/useLangRouter.ts";
import { Trans, useTranslation } from "react-i18next";

const { Title, Paragraph, Text } = Typography;

const brandRed = "#ce0505";
const brandBlue = "#075eff";
const okGreen = "#20b36b";
const heroGradient = `linear-gradient(135deg, ${brandBlue} 0%, ${brandBlue} 60%, ${brandRed} 100%)`;

const Bar = ({ width = 160 }: { width?: number }) => (
    <div
        style={{
            height: 4,
            width,
            margin: "18px auto",
            borderRadius: 4,
            background: `linear-gradient(90deg, ${brandBlue}, ${brandRed})`,
        }}
    />
);

const SectionHeader = ({ index, title }: { index: number; title: string }) => (
    <div
        style={{
            background: brandBlue,
            color: "#fff",
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: 10,
            fontWeight: 800,
            margin: "26px 0 12px",
        }}
    >
        {index}.&nbsp; {title}
    </div>
);

function SideBadge({ ok, label }: { ok: boolean; label: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            {ok ? (
                <CheckCircleFilled style={{ color: okGreen, fontSize: 18 }} />
            ) : (
                <CloseCircleFilled style={{ color: brandRed, fontSize: 18 }} />
            )}
            <Tag color={ok ? brandBlue : brandRed} style={{ color: "#fff", borderRadius: 6 }}>
                {label}
            </Tag>
        </div>
    );
}

function CompareRow({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
                <Card
                    size="small"
                    style={{
                        borderRadius: 12,
                        border: "1px solid #e6e9f5",
                        boxShadow: "0 6px 22px rgba(0,0,0,0.04)",
                    }}
                    bodyStyle={{ padding: 16 }}
                >
                    {left}
                </Card>
            </Col>
            <Col xs={24} md={12}>
                <Card
                    size="small"
                    style={{
                        borderRadius: 12,
                        border: "1px solid #e6e9f5",
                        boxShadow: "0 6px 22px rgba(0,0,0,0.04)",
                    }}
                    bodyStyle={{ padding: 16 }}
                >
                    {right}
                </Card>
            </Col>
        </Row>
    );
}

export default function CheapRentalsTruthPage() {
    const { go } = useLangRouter();
    const { t } = useTranslation("extraPages");

    return (
        <div style={{ width: "100%", margin: "0 auto", padding: "0 16px", maxWidth: 1140 }}>
            <Card
                bordered={false}
                style={{
                    marginTop: 16,
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
                    <Space direction="vertical" size={6} style={{ width: "100%" }}>
                        <Title level={2} style={{ color: "white", margin: 0 }}>
                            {t("cheapTruth.heroTitle")}
                        </Title>
                    </Space>
                </div>

                <div style={{ padding: 20 }}>
                    <Paragraph style={{ maxWidth: 900, margin: "0 auto 8px", textAlign: "center" }}>
                        <Trans i18nKey="cheapTruth.intro" ns="extraPages" components={{ br: <br /> }} />
                    </Paragraph>

                    <Bar />

                    {/* Big price comparison block */}
                    <div style={{ textAlign: "center", marginTop: 4, marginBottom: 8 }}>
                        <div
                            style={{
                                display: "inline-block",
                                background: "#0f7a2a",
                                color: "#fff",
                                padding: "14px 18px",
                                borderRadius: 12,
                                minWidth: 320,
                                boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                            }}
                        >
                            <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>
                                {t("cheapTruth.priceBlock.left.title")}
                            </div>
                            <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1 }}>
                                {t("cheapTruth.priceBlock.left.price")}
                            </div>
                        </div>

                        <div style={{ fontSize: 28, fontWeight: 900, margin: "10px 0" }}>
                            {t("cheapTruth.priceBlock.vs")}
                        </div>

                        <div
                            style={{
                                display: "inline-block",
                                padding: "6px 10px",
                                borderRadius: 10,
                                border: "2px solid #222",
                                fontWeight: 900,
                            }}
                        >
                            {t("cheapTruth.priceBlock.right")}
                        </div>
                    </div>

                    {/* 1. */}
                    <SectionHeader index={1} title={t("cheapTruth.s1.title")} />
                    <CompareRow
                        left={
                            <>
                                <SideBadge ok={false} label={t("cheapTruth.badges.competitor")} />
                                <div style={{ lineHeight: 1.6 }}>
                                    <Trans i18nKey="cheapTruth.s1.left" ns="extraPages" components={{ br: <br />, b: <strong /> }} />
                                </div>
                            </>
                        }
                        right={
                            <>
                                <SideBadge ok={true} label={t("cheapTruth.badges.fourRent")} />
                                <div style={{ lineHeight: 1.6, fontWeight: 700 }}>
                                    <Trans
                                        i18nKey="cheapTruth.s1.right"
                                        ns="extraPages"
                                        components={{ br: <br />, b: <Text strong style={{ color: "#0d1" }} /> }}
                                    />
                                </div>
                            </>
                        }
                    />

                    {/* 2. */}
                    <SectionHeader index={2} title={t("cheapTruth.s2.title")} />
                    <CompareRow
                        left={
                            <>
                                <SideBadge ok={false} label={t("cheapTruth.badges.competitor")} />
                                <div style={{ lineHeight: 1.6 }}>
                                    <Trans i18nKey="cheapTruth.s2.left" ns="extraPages" components={{ br: <br />, b: <strong /> }} />
                                </div>
                            </>
                        }
                        right={
                            <>
                                <SideBadge ok={true} label={t("cheapTruth.badges.fourRent")} />
                                <div style={{ lineHeight: 1.6, fontWeight: 700 }}>
                                    <Trans
                                        i18nKey="cheapTruth.s2.right"
                                        ns="extraPages"
                                        components={{ br: <br />, b: <strong /> }}
                                    />
                                </div>
                            </>
                        }
                    />

                    {/* 3. */}
                    <SectionHeader index={3} title={t("cheapTruth.s3.title")} />
                    <CompareRow
                        left={
                            <>
                                <SideBadge ok={false} label={t("cheapTruth.badges.competitor")} />
                                <div style={{ lineHeight: 1.6 }}>
                                    <Trans i18nKey="cheapTruth.s3.left" ns="extraPages" components={{ br: <br />, b: <strong /> }} />
                                </div>
                            </>
                        }
                        right={
                            <>
                                <SideBadge ok={true} label={t("cheapTruth.badges.fourRent")} />
                                <div style={{ lineHeight: 1.6, fontWeight: 700 }}>
                                    <Trans
                                        i18nKey="cheapTruth.s3.right"
                                        ns="extraPages"
                                        components={{ br: <br />, em: <em />, b: <Text strong style={{ color: "#0d1" }} /> }}
                                    />
                                </div>
                            </>
                        }
                    />

                    {/* 4. */}
                    <SectionHeader index={4} title={t("cheapTruth.s4.title")} />
                    <CompareRow
                        left={
                            <>
                                <SideBadge ok={false} label={t("cheapTruth.badges.competitor")} />
                                <div style={{ lineHeight: 1.6 }}>
                                    <Trans i18nKey="cheapTruth.s4.left" ns="extraPages" components={{ br: <br />, b: <strong /> }} />
                                </div>
                            </>
                        }
                        right={
                            <>
                                <SideBadge ok={true} label={t("cheapTruth.badges.fourRent")} />
                                <div style={{ lineHeight: 1.6, fontWeight: 700 }}>
                                    <Trans
                                        i18nKey="cheapTruth.s4.right"
                                        ns="extraPages"
                                        components={{ br: <br />, b: <Text strong style={{ color: brandRed }} /> }}
                                    />
                                </div>
                            </>
                        }
                    />

                    {/* 5. */}
                    <SectionHeader index={5} title={t("cheapTruth.s5.title")} />
                    <CompareRow
                        left={
                            <>
                                <SideBadge ok={false} label={t("cheapTruth.badges.competitor")} />
                                <div style={{ lineHeight: 1.6 }}>{t("cheapTruth.s5.left")}</div>
                            </>
                        }
                        right={
                            <>
                                <SideBadge ok={true} label={t("cheapTruth.badges.fourRent")} />
                                <div style={{ lineHeight: 1.6, fontWeight: 700 }}>
                                    <Trans
                                        i18nKey="cheapTruth.s5.right"
                                        ns="extraPages"
                                        components={{ br: <br />, b: <Text strong style={{ color: "#0d1" }} /> }}
                                    />
                                </div>
                            </>
                        }
                    />

                    {/* 6. */}
                    <SectionHeader index={6} title={t("cheapTruth.s6.title")} />
                    <CompareRow
                        left={
                            <>
                                <SideBadge ok={false} label={t("cheapTruth.badges.competitor")} />
                                <div style={{ lineHeight: 1.6 }}>
                                    <Trans i18nKey="cheapTruth.s6.left" ns="extraPages" components={{ br: <br /> }} />
                                </div>
                            </>
                        }
                        right={
                            <>
                                <SideBadge ok={true} label={t("cheapTruth.badges.fourRent")} />
                                <div style={{ lineHeight: 1.6, fontWeight: 700 }}>
                                    <Trans
                                        i18nKey="cheapTruth.s6.right"
                                        ns="extraPages"
                                        components={{ br: <br />, b: <Text strong style={{ color: "#0d1" }} /> }}
                                    />
                                </div>
                            </>
                        }
                    />

                    {/* Final price box */}
                    <Card
                        style={{
                            borderRadius: 14,
                            border: "1px solid #e6e9f5",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                            marginTop: 24,
                        }}
                        bodyStyle={{ padding: 18 }}
                    >
                        <div
                            style={{
                                background: brandBlue,
                                color: "#fff",
                                display: "inline-block",
                                padding: "8px 14px",
                                borderRadius: 10,
                                fontWeight: 900,
                                marginBottom: 12,
                            }}
                        >
                            {t("cheapTruth.final.title")}
                        </div>

                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Card size="small" bodyStyle={{ padding: 14 }} style={{ borderRadius: 10 }}>
                                    <SideBadge ok={false} label={t("cheapTruth.badges.competitor")} />
                                    <Trans i18nKey="cheapTruth.final.left" ns="extraPages" components={{ br: <br />, b: <strong /> }} />
                                </Card>
                            </Col>
                            <Col xs={24} md={12}>
                                <Card size="small" bodyStyle={{ padding: 14 }} style={{ borderRadius: 10 }}>
                                    <SideBadge ok={true} label={t("cheapTruth.badges.fourRent")} />
                                    <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.25 }}>
                                        {t("cheapTruth.final.right.title")}
                                        <br />
                                        <span style={{ fontSize: 30 }}>{t("cheapTruth.final.right.price")}</span>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Card>

                    <Divider />

                    <Title level={4} style={{ textAlign: "center", marginTop: 0 }}>
                        {t("cheapTruth.honestyTitle")}
                    </Title>
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
                            {t("cheapTruth.cta")}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
