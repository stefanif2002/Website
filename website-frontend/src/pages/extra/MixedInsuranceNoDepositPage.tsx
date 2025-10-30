// src/pages/insurance/MixedInsuranceNoDepositPage.tsx
import React from "react";
import { Card, Typography, Space, Image } from "antd";
import { Trans, useTranslation } from "react-i18next";

const { Title, Paragraph, Text } = Typography;

const brandRed = "#ce0505";
const brandBlue = "#075eff";
const heroGradient = `linear-gradient(135deg, ${brandBlue} 0%, ${brandBlue} 60%, ${brandRed} 100%)`;

const Bar = () => (
    <div
        style={{
            height: 4,
            width: 160,
            margin: "18px auto",
            borderRadius: 4,
            background: `linear-gradient(90deg, ${brandBlue}, ${brandRed})`,
        }}
    />
);

export default function MixedInsuranceNoDepositPage() {
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
                            {t("insuranceMixed.heroTitle")}
                        </Title>
                        <Text style={{ color: "rgba(255,255,255,0.95)", fontWeight: 500 }}>
                            {t("insuranceMixed.heroSubtitle")}
                        </Text>
                    </Space>
                </div>

                {/* BODY */}
                <div style={{ padding: 20 }}>
                    <Paragraph style={{ maxWidth: 920, margin: "0 auto 8px", textAlign: "center" }}>
                        <Trans i18nKey="insuranceMixed.p1" ns="extraPages" components={{ br: <br /> }} />
                    </Paragraph>

                    <Bar />

                    {/* Illustration (from translations) */}
                    <div style={{ maxWidth: 980, margin: "0 auto" }}>
                        <Image
                            src={t("insuranceMixed.image")}
                            alt={t("insuranceMixed.illustrationAlt")}
                            style={{ width: "100%", borderRadius: 12 }}
                            preview={false}
                        />
                    </div>

                    {/* Footnote / small print */}
                    <Paragraph
                        type="secondary"
                        style={{ maxWidth: 980, margin: "14px auto 0", fontSize: 13, lineHeight: 1.7 }}
                    >
                        <Trans i18nKey="insuranceMixed.footnote" ns="extraPages" components={{ b: <Text strong /> }} />
                    </Paragraph>
                </div>
            </Card>
        </div>
    );
}
