// src/pages/extra/PrivacyPolicyPage.tsx
import React from "react";
import { Typography, Card } from "antd";
import { Trans, useTranslation } from "react-i18next";

const { Title, Paragraph, Text } = Typography;

// helper for list arrays
function useList(t: (k: string, o?: any) => any, key: string) {
    const v = t(key, { returnObjects: true });
    if (Array.isArray(v)) return v as string[];
    if (v == null || v === "") return [] as string[];
    return [String(v)];
}

export default function PrivacyPolicyPage() {
    const { t } = useTranslation("privacy");
    const rights = useList(t, "rights.list");

    return (
        <div style={{ width: "100%", margin: "0 auto", padding: "0 16px", maxWidth: 900 }}>
                <Title level={2} style={{ textAlign: "center", marginBottom: 8 }}>
                    {t("heroTitle")}
                </Title>

                <Paragraph>{t("intro.p1")}</Paragraph>

                <Paragraph>
                    <Trans
                        i18nKey="intro.p2"
                        ns="privacy"
                        components={{
                            b: <Text strong />,
                            a: <a href={`mailto:${t("company.email")}`} />
                        }}
                    />
                </Paragraph>

                <Title level={4}>{t("controller.title")}</Title>
                <Paragraph>
                    <Trans
                        i18nKey="controller.p1"
                        ns="privacy"
                        components={{
                            a: <a href={`mailto:${t("company.email")}`} />
                        }}
                    />
                </Paragraph>

                <Paragraph>
                    <Trans
                        i18nKey="gps.block"
                        ns="privacy"
                        components={{
                            b: <Text strong />
                        }}
                    />
                </Paragraph>

                <Title level={4}>{t("collected.title")}</Title>
                <Paragraph>
                    <Trans
                        i18nKey="newsletter.block"
                        ns="privacy"
                        components={{
                            b: <Text strong />,
                            u: <Text underline />
                        }}
                    />
                </Paragraph>
                <Paragraph>{t("collected.p1")}</Paragraph>

                <Title level={4}>{t("cookies.title")}</Title>
                <Paragraph>{t("cookies.p1")}</Paragraph>

                <Title level={4}>{t("purpose.title")}</Title>
                <Paragraph>{t("purpose.p1")}</Paragraph>

                <Title level={4}>{t("rights.title")}</Title>
                <ul
                    style={{
                        paddingLeft: 20,
                        lineHeight: 1.8,
                        textAlign: "left",
                        listStylePosition: "outside",
                        margin: 0
                    }}
                >
                    {rights.map((x, i) => (
                        <li key={`r-${i}`}>{x}</li>
                    ))}
                </ul>
        </div>
    );
}
