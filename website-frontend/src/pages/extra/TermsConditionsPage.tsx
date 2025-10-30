// src/pages/extra/TermsConditionsPage.tsx
import React from "react";
import { Card, Typography, Space, Row, Col, Divider } from "antd";
import { useTranslation } from "react-i18next";

const { Title, Paragraph, Text, Link } = Typography;

const brandRed = "#ce0505";
const brandBlue = "#075eff";
const heroGradient = `linear-gradient(135deg, ${brandBlue} 0%, ${brandBlue} 60%, ${brandRed} 100%)`;

// ---- helper: always return an array for list keys ----
function useList(t: (k: string, o?: any) => any, key: string) {
    const v = t(key, { returnObjects: true });
    if (Array.isArray(v)) return v as string[];
    if (v == null || v === "") return [] as string[];
    // if a single string accidentally provided, render it as a single <li>
    return [String(v)];
}

export default function TermsConditionsPage() {
    // scope to the 'terms' namespace (still works if default ns also loaded)
    const { t } = useTranslation("terms");

    const bookingList           = useList(t, "booking.list");
    const paymentList           = useList(t, "payment.list");
    const exclusionsSteps       = useList(t, "exclusions.steps");
    const clientLiabilityList   = useList(t, "clientLiability.list");
    const extraChargesList      = useList(t, "extraCharges.list");
    const outOfHoursList        = useList(t, "outOfHours.list");
    const bfList                = useList(t, "blackFriday.list");
    const bfTerms               = useList(t, "blackFriday.termsList");

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
                        {t("heroTitle")}
                    </Title>
                </div>

                {/* CONTENT */}
                <div style={{ padding: 20 }}>
                    <Row gutter={[24, 24]}>
                        <Col span={24} style={{ textAlign: "left" }}>
                            <Space direction="vertical" size={18} style={{ width: "100%" }}>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("booking.title")}</Title>
                                <Paragraph>{t("booking.intro")}</Paragraph>
                                <ul>{bookingList.map((x, i) => <li key={`booking-${i}`}>{x}</li>)}</ul>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("payment.title")}</Title>
                                <ul>{paymentList.map((x, i) => <li key={`pay-${i}`}>{x}</li>)}</ul>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("insurance.title")}</Title>
                                <Paragraph>{t("insurance.p1")}</Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("exclusions.title")}</Title>
                                <Paragraph>{t("exclusions.p1")}</Paragraph>
                                <Paragraph>{t("exclusions.p2")}</Paragraph>
                                <ul>{exclusionsSteps.map((x, i) => <li key={`ex-step-${i}`}>{x}</li>)}</ul>

                                <Paragraph>{t("clientLiability.intro")}</Paragraph>
                                <ul>{clientLiabilityList.map((x, i) => <li key={`cl-${i}`}>{x}</li>)}</ul>
                                <Paragraph>{t("clientLiability.pRadio")}</Paragraph>
                                <Paragraph>{t("clientLiability.pIntox")}</Paragraph>
                                <Paragraph>{t("clientLiability.pPolice")}</Paragraph>
                                <Paragraph>{t("clientLiability.pTheft")}</Paragraph>
                                <Paragraph>
                                    {t("clientLiability.pBig_prefix")}
                                    <Text strong>{t("clientLiability.pBig_strong_DEN")}</Text>
                                    {t("clientLiability.pBig_mid1")}
                                    <Text strong>{t("clientLiability.pBig_strong_fee")}</Text>
                                    {t("clientLiability.pBig_suffix")}
                                </Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("replacementNoFault.title")}</Title>
                                <Paragraph>{t("replacementNoFault.p1")}</Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("smoking.title")}</Title>
                                <Paragraph>
                                    {t("smoking.prefix")}<Text strong>{t("smoking.amount")}</Text>{t("smoking.suffix")}
                                </Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("fines.title")}</Title>
                                <Paragraph>
                                    {t("fines.p1_prefix")}<Text strong>{t("fines.percent")}</Text>{t("fines.p1_suffix")}
                                    <Text strong>{t("fines.amount150")}</Text>{t("fines.p1_tail")}
                                </Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("gps.title")}</Title>
                                <Paragraph>{t("gps.p1")}</Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("replacementAfterAccident.title")}</Title>
                                <Paragraph>{t("replacementAfterAccident.p1")}</Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("driverAge.title")}</Title>
                                <Paragraph>{t("driverAge.p1")}</Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("license.title")}</Title>
                                <Paragraph>{t("license.p1")}</Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("extraCharges.title")}</Title>
                                <ul>{extraChargesList.map((x, i) => <li key={`extra-${i}`}>{x}</li>)}</ul>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("outOfHours.title")}</Title>
                                <ul>{outOfHoursList.map((x, i) => <li key={`ooh-${i}`}>{x}</li>)}</ul>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("extras.title")}</Title>
                                <Paragraph>{t("extras.p1")}</Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("shipAbroad.title")}</Title>
                                <Paragraph>
                                    {t("shipAbroad.prefix")}<Text strong>{t("shipAbroad.amount")}</Text>{t("shipAbroad.suffix")}
                                </Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("fuel.title")}</Title>
                                <Paragraph><Text strong>{t("fuel.p1_label")}</Text>{t("fuel.p1_body")}</Paragraph>
                                <Paragraph>
                                    <Text strong>{t("fuel.p2_label")}</Text>{t("fuel.p2_prefix")}
                                    <Text strong>{t("fuel.priceAB")}</Text>{t("fuel.p2_mid1")}
                                    <Text strong>{t("fuel.priceCD")}</Text>{t("fuel.p2_mid2")}
                                    <Text strong>{t("fuel.priceE")}</Text>{t("fuel.p2_mid3")}
                                    <Text strong>{t("fuel.priceLM")}</Text>{t("fuel.p2_suffix")}
                                </Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("cancellations.title")}</Title>
                                <Paragraph><Text strong>{t("cancellations.p1_label")}</Text>{t("cancellations.p1_body")}</Paragraph>
                                <Paragraph><Text strong>{t("cancellations.p2_label")}</Text>{t("cancellations.p2_body")}</Paragraph>
                                <Paragraph>{t("cancellations.p3")}</Paragraph>
                                <Paragraph>{t("cancellations.p4")}</Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("noShow.title")}</Title>
                                <Paragraph>{t("noShow.p1")}</Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("flightDelay.title")}</Title>
                                <Paragraph>{t("flightDelay.p1")}</Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("deliveryPickup.title")}</Title>
                                <Paragraph>{t("deliveryPickup.p1")}</Paragraph>
                                <Paragraph>{t("deliveryPickup.p2")}</Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("forceMajeure.title")}</Title>
                                <Paragraph>{t("forceMajeure.p1")}</Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("acceptedCountries.title")}</Title>
                                <Paragraph>{t("acceptedCountries.p1")}</Paragraph>
                                <Paragraph>{t("acceptedCountries.p2")}</Paragraph>
                                <Paragraph>{t("acceptedCountries.p3")}</Paragraph>

                                <Divider />

                                <Paragraph>{t("consent")}</Paragraph>

                                <Title level={4} style={{ marginBottom: 0 }}>{t("contact.title")}</Title>
                                <Paragraph>
                                    {t("contact.phones")}<br />
                                    {t("contact.emailLabel")}{" "}
                                    <Link href={`mailto:${t("contact.emailAddress")}`}>{t("contact.emailAddress")}</Link>
                                </Paragraph>

                                <Divider />

                                <Title level={4} style={{ marginBottom: 0 }}>{t("blackFriday.title")}</Title>
                                <Paragraph>{t("blackFriday.intro")}</Paragraph>
                                <ul>{bfList.map((x, i) => <li key={`bf-${i}`}>{x}</li>)}</ul>

                                <Paragraph>
                                    <Text strong>{t("blackFriday.pay_label")}</Text><br />
                                    {t("blackFriday.pay_body")}
                                </Paragraph>

                                <Paragraph><Text strong>{t("blackFriday.terms_label")}</Text></Paragraph>
                                <ul>{bfTerms.map((x, i) => <li key={`bf-term-${i}`}>{x}</li>)}</ul>

                            </Space>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    );
}
