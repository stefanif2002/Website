import React from "react";
import { Button, Card, Col, Divider, Image, Row, Space, Tag, Typography } from "antd";
import { CarOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Title, Paragraph, Text } = Typography;
const brandRed = "#ce0505";
const brandBlue = "#075eff";

type Props = { slug: string };

export default function FleetCategoryView({ slug }: Props) {
    const { t } = useTranslation("fleetView");
    const categories = t("fleetCategory.details", { returnObjects: true }) as Record<
        string,
        {
            title: string;
            description: string;
            tags: string[];
            models: string[];
            gallery: string[];
        }
    >;

    const data = categories[slug];
    if (!data) {
        return (
            <div style={{ width: "100%", textAlign: "center", padding: "60px 0" }}>
                <Title level={3} style={{ color: brandRed }}>
                    {t("fleetCategory.notFound")}
                </Title>
                <Button href="/el/stolos/diathesimes-katigories-o-stolos-mas" style={{ borderColor: brandBlue, color: brandBlue }}>
                    {t("fleetCategory.allCategories")}
                </Button>
            </div>
        );
    }

    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "80%", maxWidth: 1200, padding: "24px 0 40px" }}>
                <Title level={2} style={{ color: brandRed, textAlign: "center", marginBottom: 8 }}>
                    {data.title}
                </Title>

                <div
                    style={{
                        height: 4,
                        width: 140,
                        margin: "0 auto 18px",
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${brandBlue}, ${brandRed})`,
                    }}
                />

                <Paragraph style={{ textAlign: "center", maxWidth: 880, margin: "0 auto 20px" }}>{data.description}</Paragraph>

                <Row gutter={[16, 20]}>
                    <Col xs={24} lg={16}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: "1px solid #e6e9f5",
                                boxShadow: "0 6px 24px rgba(0,0,0,0.04)",
                                borderTop: `4px solid ${brandBlue}`,
                            }}
                            bodyStyle={{ padding: 18 }}
                        >
                            <Title level={5} style={{ marginTop: 0, color: brandBlue }}>
                                {t("fleetCategory.features")}
                            </Title>
                            <Space wrap size={[8, 8]} style={{ marginBottom: 8 }}>
                                {data.tags.map((t) => (
                                    <Tag key={t} color={brandBlue}>
                                        {t}
                                    </Tag>
                                ))}
                            </Space>

                            <Divider />

                            <Title level={5} style={{ marginTop: 0, color: brandBlue }}>
                                {t("fleetCategory.models")}
                            </Title>
                            <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
                                {data.models.map((m) => (
                                    <Tag key={m} color={brandBlue}>
                                        {m}
                                    </Tag>
                                ))}
                            </Space>

                            <Image.PreviewGroup>
                                <Row gutter={[12, 12]}>
                                    {data.gallery.map((src, i) => (
                                        <Col xs={12} md={8} key={i}>
                                            <Card
                                                hoverable
                                                style={{ borderRadius: 10, overflow: "hidden", borderColor: "#e6f7ff" }}
                                                bodyStyle={{ padding: 8, background: "#f7fbfc" }}
                                                cover={
                                                    <Image
                                                        src={src}
                                                        alt={`${data.title} ${i + 1}`}
                                                        style={{ width: "100%", height: 140, objectFit: "cover", cursor: "zoom-in" }}
                                                        preview={{
                                                            mask: (
                                                                <div
                                                                    style={{
                                                                        background: "rgba(7,94,255,0.65)",
                                                                        color: "#fff",
                                                                        fontWeight: 600,
                                                                        borderRadius: 4,
                                                                        padding: "2px 6px",
                                                                    }}
                                                                >
                                                                    {t("fleetCategory.clickToZoom")}
                                                                </div>
                                                            ),
                                                        }}
                                                    />
                                                }
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Image.PreviewGroup>

                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                                <Button href="/el/stolos/diathesimes-katigories-o-stolos-mas" style={{ borderColor: brandBlue, color: brandBlue }}>
                                    {t("fleetCategory.allCategories")}
                                </Button>
                                <Button type="primary" icon={<CarOutlined />} style={{ backgroundColor: brandRed, borderColor: brandRed }} href="/book/search">
                                    {t("fleetCategory.bookNow")}
                                </Button>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: "1px solid #e6e9f5",
                                boxShadow: "0 6px 24px rgba(0,0,0,0.04)",
                                borderLeft: `4px solid ${brandBlue}`,
                                background: "#f7fbfc",
                            }}
                            bodyStyle={{ padding: 16 }}
                        >
                            <Title level={4} style={{ marginTop: 0, color: brandBlue }}>
                                {t("fleetCategory.whyChoose")}
                            </Title>
                            <ul style={{ paddingLeft: 18, marginBottom: 12 }}>
                                <li>{t("fleetCategory.why1")}</li>
                                <li>{t("fleetCategory.why2")}</li>
                                <li>{t("fleetCategory.why3")}</li>
                            </ul>

                            <Divider style={{ margin: "12px 0" }} />

                            <Title level={5} style={{ marginTop: 0, color: brandBlue }}>
                                {t("fleetCategory.includes")}
                            </Title>
                            <Space direction="vertical" size={4}>
                                <Text>- {t("fleetCategory.insurance")}</Text>
                                <Text>- {t("fleetCategory.unlimitedKm")}</Text>
                                <Text>- {t("fleetCategory.secondDriver")}</Text>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
