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
import { useLangRouter } from "../../resources/useLangRouter.ts";
import { Trans, useTranslation } from "react-i18next";

const { Title, Paragraph, Text } = Typography;

const brandRed = "#ce0505";
const brandBlue = "#075eff";
const heroGradient = `linear-gradient(135deg, ${brandBlue} 0%, ${brandBlue} 60%, ${brandRed} 100%)`;

type VCell = boolean | "partial" | string; // string -> i18n note key under comparison.notes.*

type FeatureRow = {
    key: string;
    labelKey: string;    // comparison.features.<labelKey>
    infoKey?: string;    // comparison.infos.<infoKey>
    fourRent: VCell;
    competitor: VCell;
};

const FEATURES: FeatureRow[] = [
    {
        key: "full-insurance",
        labelKey: "fullInsurance",
        infoKey: "fullInsurance",
        fourRent: true,
        competitor: "partial",
    },
    {
        key: "deposit",
        labelKey: "noDepositNoCard",
        fourRent: true,
        competitor: false,
    },
    {
        key: "second-driver",
        labelKey: "secondDriverFree",
        fourRent: true,
        competitor: "partial",
    },
    {
        key: "km",
        labelKey: "unlimitedKm",
        fourRent: true,
        competitor: false,
    },
    {
        key: "24h",
        labelKey: "support24h",
        fourRent: true,
        competitor: "partial",
    },
    {
        key: "hidden",
        labelKey: "noHiddenCosts",
        fourRent: true,
        competitor: false,
    },
    {
        key: "fleet",
        labelKey: "modernFleetCleaning",
        fourRent: true,
        competitor: "partial",
    },
    {
        key: "cancel",
        labelKey: "flexibleCancel",
        fourRent: "cancelPolicy",          // -> comparison.notes.cancelPolicy
        competitor: "restrictionsPenalty", // -> comparison.notes.restrictionsPenalty
    },
];

function Cell({ v, t }: { v: VCell; t: (k: string) => string }) {
    if (v === true) return <CheckCircleFilled style={{ color: "#16a34a", fontSize: 18 }} />;
    if (v === false) return <CloseCircleFilled style={{ color: "#dc2626", fontSize: 18 }} />;
    if (v === "partial")
        return (
            <Tooltip title={t("comparison.partialTooltip")}>
                <InfoCircleOutlined style={{ color: "#f59e0b", fontSize: 18 }} />
            </Tooltip>
        );
    // string -> treat as i18n key under comparison.notes.*
    return (
        <Text type="secondary" style={{ fontSize: 13 }}>
            {t(`comparison.notes.${v}`)}
        </Text>
    );
}

export default function FourRentVsCompetitorPage() {
    const { go } = useLangRouter();
    const { t } = useTranslation("extraPages");

    const priceItems: string[] = t("comparison.priceTransparency.items", { returnObjects: true }) as string[];
    const hiddenElsewhere: string[] = t("comparison.hiddenElsewhere.items", { returnObjects: true }) as string[];

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
                            {t("comparison.heroTitle")}
                        </Title>
                        <Space align="center" size={10} style={{ justifyContent: "center" }}>
                            <Rate allowHalf disabled defaultValue={4.8} style={{ color: "#ffd666" }} />
                            <Text style={{ color: "rgba(255,255,255,0.95)" }}>{t("comparison.ratingValue")}</Text>
                            <Tag color="gold" style={{ borderRadius: 999, fontWeight: 600 }}>
                                {t("comparison.valueForMoney")}
                            </Tag>
                        </Space>
                    </Space>
                </div>

                {/* CONTENT */}
                <div style={{ padding: 20 }}>
                    {/* Intro line */}
                    <Paragraph style={{ textAlign: "center", maxWidth: 900, margin: "0 auto 12px" }}>
                        <Trans
                            i18nKey="comparison.intro"
                            ns="extraPages"
                            components={{ b: <Text strong />, u: <Text underline /> }}
                        />
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
                            <Col xs={12}>{t("comparison.table.header.feature")}</Col>
                            <Col xs={6} style={{ textAlign: "center" }}>
                                {t("comparison.table.header.fourRent")}
                            </Col>
                            <Col xs={6} style={{ textAlign: "center" }}>
                                {t("comparison.table.header.competitor")}
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
                                        <Text strong>{t(`comparison.features.${f.labelKey}`)}</Text>
                                        {f.infoKey ? (
                                            <Tooltip title={t(`comparison.infos.${f.infoKey}`)}>
                                                <InfoCircleOutlined style={{ color: "#8fa3d8" }} />
                                            </Tooltip>
                                        ) : null}
                                    </Space>
                                </Col>
                                <Col xs={6} style={{ textAlign: "center" }}>
                                    <Cell v={f.fourRent} t={t} />
                                </Col>
                                <Col xs={6} style={{ textAlign: "center" }}>
                                    <Cell v={f.competitor} t={t} />
                                </Col>
                            </Row>
                        ))}
                    </Card>

                    {/* Price transparency / examples */}
                    <Row gutter={[16, 16]} style={{ marginTop: 18 }}>
                        <Col xs={24} md={12}>
                            <Card
                                title={t("comparison.priceTransparency.title")}
                                headStyle={{ borderBottom: `2px solid ${brandBlue}`, color: brandBlue }}
                                style={{ borderRadius: 12, border: "1px solid #e6e9f5" }}
                            >
                                <Space direction="vertical" size={6}>
                                    {priceItems.map((x, i) => (
                                        <Text key={`pt-${i}`}>{x}</Text>
                                    ))}
                                </Space>
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card
                                title={t("comparison.hiddenElsewhere.title")}
                                headStyle={{ borderBottom: `2px solid ${brandRed}`, color: brandRed }}
                                style={{ borderRadius: 12, border: "1px solid #e6e9f5" }}
                            >
                                <Space direction="vertical" size={6}>
                                    {hiddenElsewhere.map((x, i) => (
                                        <Text key={`he-${i}`}>{x}</Text>
                                    ))}
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
                                {t("comparison.cta.call")}
                            </Button>
                        </Col>
                        <Col xs={24} md={12}>
                            <Button
                                type="primary"
                                icon={<CarOutlined />}
                                style={{ width: "100%", height: 44 }}
                                onClick={() => go("/search")}
                            >
                                {t("comparison.cta.book")}
                            </Button>
                        </Col>
                    </Row>

                    <Divider />

                    {/* Small note */}
                    <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0 }}>
                        {t("comparison.smallNote")}
                    </Paragraph>
                </div>
            </Card>
        </div>
    );
}
