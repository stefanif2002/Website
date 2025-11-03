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

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const brandRed = "#ce0505";
const brandBlue = "#075eff";
const heroGradient = `linear-gradient(135deg, ${brandBlue} 0%, ${brandBlue} 60%, ${brandRed} 100%)`;

export default function FaqThessalonikiPage() {
    const { t } = useTranslation(["faqThess"]);

    const heroTitle = t("hero.title", { ns: "faqThess" });
    const ctaText = t("cta.bookNow", {
        ns: "faqThess",
        defaultValue: "ΚΑΝΤΕ ΚΡΑΤΗΣΗ ΤΩΡΑ",
    });
    const ctaHref = t("cta.href", { ns: "faqThess", defaultValue: "/book/search" });

    const faqObj = t("faq", { ns: "faqThess", returnObjects: true }) as Record<string, any>;
    const images = t("images", { ns: "faqThess", returnObjects: true }) as any;

    const panels = Object.entries(faqObj || {}).map(([key, v]) => ({
        key,
        header: v.q as string,
        data: v,
    }));

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
                    <Title level={2} style={{ color: "white", margin: 0 }}>
                        {heroTitle}
                    </Title>
                </div>

                {/* CONTENT */}
                <div style={{ padding: 20, textAlign: "left" }}>
                    <Collapse accordion bordered={false} style={{ background: "transparent" }} expandIconPosition="end">
                        {panels.map(({ key, header, data }) => {
                            // dynamic list of content preserving order
                            const orderedKeys = Object.keys(data);
                            const imgs: Array<{ src: string; alt: string }> = [];
                            if (key === "q10" && images?.kidsSeats?.src)
                                imgs.push({ src: images.kidsSeats.src, alt: images.kidsSeats.alt || "" });
                            if (key === "q13") {
                                if (images?.fuelReturn?.src)
                                    imgs.push({ src: images.fuelReturn.src, alt: images.fuelReturn.alt || "" });
                                if (images?.fuelFullEmpty?.src)
                                    imgs.push({ src: images.fuelFullEmpty.src, alt: images.fuelFullEmpty.alt || "" });
                            }

                            return (
                                <Panel header={<strong>{header}</strong>} key={key}>
                                    <Space direction="vertical" size={10} style={{ width: "100%" }}>
                                        {orderedKeys.map((k) => {
                                            const val = data[k];
                                            if (!val) return null;

                                            // paragraph
                                            if (typeof val === "string" && k.startsWith("p")) {
                                                return (
                                                    <Paragraph key={k}>
                                                        {k === "p1" || k === "p2" ? <Text strong>{val}</Text> : val}
                                                    </Paragraph>
                                                );
                                            }

                                            // unordered lists
                                            if (Array.isArray(val) && (k.startsWith("list") || k === "list")) {
                                                return (
                                                    <ul key={k} style={{ marginTop: 0 }}>
                                                        {val.map((li, i) => (
                                                            <li key={i}>{li}</li>
                                                        ))}
                                                    </ul>
                                                );
                                            }

                                            // ordered steps
                                            if (Array.isArray(val) && k === "steps") {
                                                return (
                                                    <ol key={k}>
                                                        {val.map((li, i) => (
                                                            <li key={i}>{li}</li>
                                                        ))}
                                                    </ol>
                                                );
                                            }

                                            // note
                                            if (k === "note" && typeof val === "string") {
                                                return (
                                                    <Paragraph key={k} type="secondary">
                                                        {val}
                                                    </Paragraph>
                                                );
                                            }

                                            return null;
                                        })}

                                        {/* images */}
                                        {imgs.length > 0 && (
                                            <Row gutter={[16, 16]} align="middle">
                                                {imgs.map((im, i) => (
                                                    <Col key={i} xs={24} md={12} style={{ textAlign: "center" }}>
                                                        <Image
                                                            src={im.src}
                                                            alt={im.alt}
                                                            style={{ borderRadius: 12, width: "100%", maxWidth: 460 }}
                                                            preview={false}
                                                        />
                                                    </Col>
                                                ))}
                                            </Row>
                                        )}
                                    </Space>
                                </Panel>
                            );
                        })}
                    </Collapse>

                    <Divider />

                    {/* CTA */}
                    <Row justify="center">
                        <Col>
                            <Button
                                type="primary"
                                size="large"
                                icon={<CarOutlined />}
                                href={ctaHref}
                                style={{
                                    backgroundColor: brandRed,
                                    borderColor: brandRed,
                                    borderRadius: 8,
                                }}
                            >
                                {ctaText}
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    );
}
    