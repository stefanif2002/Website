import React from "react";
import { Card, Row, Col, Image, Button, Space, Typography, Tag } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Title, Text, Paragraph } = Typography;
const brandRed = "#ce0505";
const brandBlue = "#075eff";

type Cat = {
    key: string;
    title: string;
    href: string;
    img: string;
    tags: string[];
    desc: string;
};

export default function FleetCategoriesPage() {
    // ✅ use the correct namespace
    const { t } = useTranslation("fleetView");

    // ✅ safely read the array from i18n
    const raw = t("fleetCategories.list", { returnObjects: true }) as unknown;
    const categories: Cat[] = Array.isArray(raw) ? (raw as Cat[]) : [];

    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "80%", maxWidth: 1200, padding: "24px 0 40px" }}>
                <Title level={2} style={{ color: brandRed, textAlign: "center", marginBottom: 8 }}>
                    {t("fleetCategories.title")}
                </Title>

                <div
                    style={{
                        height: 4,
                        width: 120,
                        margin: "0 auto 18px",
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${brandBlue}, ${brandRed})`,
                    }}
                />

                <Paragraph style={{ textAlign: "center", maxWidth: 820, margin: "0 auto 24px" }}>
                    {t("fleetCategories.subtitle")}
                </Paragraph>

                <Row gutter={[16, 20]}>
                    {categories.map((c) => (
                        <Col xs={24} sm={12} lg={8} key={c.key}>
                            <Card
                                hoverable
                                style={{
                                    borderRadius: 12,
                                    border: "1px solid #e6e9f5",
                                    boxShadow: "0 6px 24px rgba(0,0,0,0.04)",
                                    borderTop: `4px solid ${brandBlue}`,
                                }}
                                bodyStyle={{ padding: 14 }}
                                cover={
                                    <div style={{ padding: 12, background: "#f7fbfc" }}>
                                        <Image src={c.img} alt={c.title} style={{ width: "100%", height: "auto" }} preview={false} />
                                    </div>
                                }
                            >
                                <Title level={4} style={{ color: brandRed, marginBottom: 8 }}>
                                    {c.title}
                                </Title>

                                <Space wrap size={[6, 6]} style={{ marginBottom: 8 }}>
                                    {(c.tags || []).map((tag) => (
                                        <Tag key={tag} color={brandBlue}>
                                            {tag}
                                        </Tag>
                                    ))}
                                </Space>

                                <Text type="secondary" style={{ display: "block", minHeight: 44 }}>
                                    {c.desc}
                                </Text>

                                <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                                    <Button href={c.href} style={{ borderColor: brandBlue, color: brandBlue }}>
                                        {t("fleetCategories.more")}
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
                    <Button
                        type="primary"
                        icon={<ArrowRightOutlined />}
                        href="/book/search"
                        style={{ backgroundColor: brandBlue, borderColor: brandBlue }}
                    >
                        {t("fleetCategories.searchAvailability")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
