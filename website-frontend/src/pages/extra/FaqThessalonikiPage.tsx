// src/pages/extra/FaqThessalonikiPage.tsx
import React from "react";
import {
    Card,
    Typography,
    Space,
    Collapse,
    Divider,
    Button,
    Row,
    Col,
    Image,
} from "antd";
import { CarOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Title, Paragraph, Text, Link } = Typography;
const { Panel } = Collapse;

const brandRed = "#ce0505";
const brandBlue = "#075eff";
const heroGradient = `linear-gradient(135deg, ${brandBlue} 0%, ${brandBlue} 60%, ${brandRed} 100%)`;

type FaqPanel = {
    key: string;                // e.g. "q1"
    header: string;             // panel title
    bodyHtml?: string;          // optional pre-formatted HTML (string)
    bullets?: string[];         // optional list of <li> items
    ordered?: string[];         // optional ordered list
    images?: Array<{ src: string; alt: string; maxWidth?: number }>;
};

export default function FaqThessalonikiPage() {
    const { t } = useTranslation(["faqThess"]);

    // Pull all copy from translations
    const heroTitle = t("hero.title", { ns: "faqThess" });
    const cta = {
        text: t("cta.text", { ns: "faqThess" }),
        href: t("cta.href", { ns: "faqThess" }),
    };

    // Panels: stored as an array in locales/.../faqThess.json
    const panels = t("panels", {
        ns: "faqThess",
        returnObjects: true,
    }) as FaqPanel[];

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
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    <Title level={2} style={{ color: "white", margin: 0 }}>
                        {heroTitle}
                    </Title>
                </div>

                {/* CONTENT */}
                <div style={{ padding: 20, textAlign: "left" }}>
                    <Collapse
                        accordion
                        bordered={false}
                        style={{ background: "transparent" }}
                        expandIconPosition="end"
                    >
                        {(panels || []).map((p) => (
                            <Panel header={<strong>{p.header}</strong>} key={p.key}>
                                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                                    {/* Optional HTML block (kept verbatim) */}
                                    {p.bodyHtml ? (
                                        <div
                                            dangerouslySetInnerHTML={{ __html: p.bodyHtml }}
                                            // NOTE: bodyHtml comes from your own locale files
                                        />
                                    ) : null}

                                    {/* Optional unordered bullets */}
                                    {p.bullets && p.bullets.length > 0 ? (
                                        <ul style={{ marginTop: 0 }}>
                                            {p.bullets.map((li, i) => (
                                                <li key={i}>{li}</li>
                                            ))}
                                        </ul>
                                    ) : null}

                                    {/* Optional ordered list */}
                                    {p.ordered && p.ordered.length > 0 ? (
                                        <ol>
                                            {p.ordered.map((li, i) => (
                                                <li key={i}>{li}</li>
                                            ))}
                                        </ol>
                                    ) : null}

                                    {/* Optional images */}
                                    {p.images && p.images.length > 0 ? (
                                        <Row gutter={[16, 16]} align="middle">
                                            {p.images.map((im, i) => (
                                                <Col key={i} xs={24} md={12} style={{ textAlign: "center" }}>
                                                    <Image
                                                        src={im.src}
                                                        alt={im.alt}
                                                        style={{
                                                            borderRadius: 12,
                                                            width: "100%",
                                                            maxWidth: im.maxWidth ?? 460,
                                                        }}
                                                        preview={false}
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                    ) : null}
                                </Space>
                            </Panel>
                        ))}
                    </Collapse>

                    <Divider />

                    {/* CTA */}
                    <Row justify="center">
                        <Col>
                            <Button
                                type="primary"
                                size="large"
                                icon={<CarOutlined />}
                                href={cta.href}
                                style={{ backgroundColor: brandRed, borderColor: brandRed, borderRadius: 8 }}
                            >
                                {cta.text}
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    );
}
