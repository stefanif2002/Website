import React from "react";
import {
    Col, Layout, Row, Space, Typography, Button, Image, Divider,
} from "antd";
import {
    UpCircleOutlined, PhoneOutlined, WhatsAppOutlined, MailOutlined,
    ClockCircleOutlined, FacebookFilled, InstagramFilled, YoutubeFilled,
    TikTokFilled, MobileOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useLangRouter } from "../../resources/useLangRouter";

const { Footer } = Layout;
const { Text } = Typography;

const BG = "#f6f6f6";
const TEXT = "rgba(0,0,0,0.85)";
const MUTED = "rgba(0,0,0,0.60)";

/** Slim vertical rule between icon and text */
const VRule: React.FC<{ h?: number }> = ({ h = 28 }) => (
    <span
        style={{
            width: 1, height: h, background: "rgba(0,0,0,0.15)",
            marginInline: 10, alignSelf: "center", flex: "0 0 1px",
        }}
    />
);

/** Icon + vertical line + stacked text, perfectly aligned */
const InfoRow: React.FC<{
    icon: React.ReactNode;
    title: React.ReactNode;
    content: React.ReactNode;
    ruleHeight?: number;
}> = ({ icon, title, content, ruleHeight = 28 }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
        <div
            style={{
                width: 26, display: "flex", justifyContent: "center", marginTop: 2, fontSize: 16,
            }}
        >
            {icon}
        </div>
        <VRule h={ruleHeight} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", lineHeight: 1.25 }}>
            <div style={{ fontWeight: 600 }}>{title}</div>
            <div style={{ color: TEXT }}>{content}</div>
        </div>
    </div>
);

export default function MyFooter() {
    const { t } = useTranslation("common");
    const { go } = useLangRouter();
    const thisYear = new Date().getFullYear();

    return (
        <Footer role="contentinfo" style={{ background: BG, color: TEXT, paddingTop: 24, paddingBottom: 24 }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <Divider style={{ borderColor: "rgba(0,0,0,0.08)", margin: "12px 0 20px" }} />

                {/* 3 COLUMNS */}
                <Row gutter={[24, 24]} style={{ marginBottom: 12 }}>
                    {/* ΤΗΛ. ΠΛΗΡΟΦΟΡΙΕΣ */}
                    <Col xs={24} md={8}>
                        <Space direction="vertical" size={16} style={{ width: "100%" }}>
                            <Text strong style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                                {t("footer.info.heading")}
                            </Text>

                            <InfoRow
                                icon={<PhoneOutlined />}
                                title={t("footer.info.officePhone")}
                                content={<a href="tel:+302310460035" style={{ color: TEXT }}>{t("footer.info.officePhoneValue")}</a>}
                            />

                            <InfoRow
                                icon={<MobileOutlined />}
                                title={t("footer.info.mobile")}
                                content={<a href="tel:+306982211001" style={{ color: TEXT }}>{t("footer.info.mobileValue")}</a>}
                            />

                            <InfoRow
                                icon={<WhatsAppOutlined />}
                                title={t("footer.info.messagingTitle")}
                                content={<a href="tel:+306973832625" style={{ color: TEXT }}>{t("footer.info.messagingValue")}</a>}
                                ruleHeight={34}
                            />

                            <Space size={8} wrap>
                                <Button shape="circle" icon={<FacebookFilled style={{ color: "#1877F2" }} />} href="https://www.facebook.com/4rent.thessaloniki" target="_blank" rel="noopener noreferrer" />
                                <Button shape="circle" icon={<InstagramFilled style={{ color: "#E4405F" }} />} href="https://www.instagram.com/4rent.thessaloniki/" target="_blank" rel="noopener noreferrer" />
                                <Button shape="circle" icon={<TikTokFilled style={{ color: "#000" }} />} href="https://www.tiktok.com/@4rentthessaloniki" target="_blank" rel="noopener noreferrer" />
                                <Button shape="circle" icon={<YoutubeFilled style={{ color: "#FF0000" }} />} href="https://www.youtube.com/@4rentthessaloniki" target="_blank" rel="noopener noreferrer" />
                            </Space>
                        </Space>
                    </Col>

                    {/* ΚΕΝΤΡΟ ΕΞΥΠΗΡΕΤΗΣΗΣ ΠΕΛΑΤΩΝ */}
                    <Col xs={24} md={8}>
                        <Space direction="vertical" size={16} style={{ width: "100%" }}>
                            <Text strong style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                                {t("footer.support.heading")}
                            </Text>

                            <InfoRow
                                icon={<ClockCircleOutlined />}
                                title={t("footer.support.infoTitle")}
                                content={<span style={{ color: MUTED }}>{t("footer.support.infoHours")}</span>}
                            />

                            <InfoRow
                                icon={<Image width={18} preview={false} src="https://cdn-icons-png.flaticon.com/512/107/107798.png" alt="van" />}
                                title={t("footer.support.pickDropTitle")}
                                content={<span style={{ color: MUTED }}>{t("footer.support.pickDropDesc")}</span>}
                                ruleHeight={36}
                            />

                            <InfoRow
                                icon={<MailOutlined />}
                                title="E-mail"
                                content={<a href="mailto:info@4rent-thessaloniki.com" style={{ color: TEXT }}>info@4rent-thessaloniki.com</a>}
                            />

                            <Space size={12} wrap>
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <span key={i} style={{ color: "#fadb14" }}>★</span>
                                ))}
                                <Image height={18} preview={false} src="https://www.google.com/favicon.ico" alt="Google" />
                                <Image height={18} preview={false} src="https://media.ffycdn.net/eu/trustpilot/JSNCD5NZQtjGZcTHTdv2.eps?width=2400&mod=v1/max=2400" alt="Trustpilot" />
                                <Image height={18} preview={false} src="https://www.holidaycheck.com/favicon.ico" alt="HolidayCheck" />
                                <FacebookFilled style={{ color: "#1877F2" }} />
                            </Space>
                        </Space>
                    </Col>

                    {/* ΣΥΧΝΕΣ ΕΡΩΤΗΣΕΙΣ */}
                    <Col xs={24} md={8}>
                        <Space direction="vertical" size={16} style={{ width: "100%" }}>
                            <Text strong style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                                {t("footer.faq.heading")}
                            </Text>

                            <InfoRow
                                icon={<span style={{ fontWeight: 700 }}>?</span>}
                                title={
                                    <a
                                        href="/"
                                        onClick={(e) => { e.preventDefault(); go("/enoikiaseis-autokiniton-thessaloniki/syxnes-erotiseis"); }}
                                        style={{ color: TEXT }}
                                    >
                                        {t("footer.faq.faqTitle")}
                                    </a>
                                }
                                content={<span style={{ color: MUTED }}>{t("footer.faq.faqLabel")}</span>}
                                ruleHeight={30}
                            />

                            <InfoRow
                                icon={<span style={{ fontWeight: 700 }}>✓</span>}
                                title={
                                    <a
                                        href="/"
                                        onClick={(e) => { e.preventDefault(); go("/epikoinonia/oroi-kai-proipotheseis"); }}
                                        style={{ color: TEXT }}
                                    >
                                        {t("footer.faq.termsTitle")}
                                    </a>
                                }
                                content={<span style={{ color: MUTED }}>{t("footer.faq.termsLabel")}</span>}
                                ruleHeight={30}
                            />

                            <InfoRow
                                icon={<span style={{ fontWeight: 700 }}>EU</span>}
                                title={
                                    <a
                                        href="/"
                                        onClick={(e) => { e.preventDefault(); go("/epikoinonia/politiki-prostasias-dedomenon"); }}
                                        style={{ color: TEXT }}
                                    >
                                        {t("footer.faq.privacyTitle")}
                                    </a>
                                }
                                content={<span style={{ color: MUTED }}>{t("footer.faq.privacyLabel")}</span>}
                                ruleHeight={30}
                            />
                        </Space>
                    </Col>
                </Row>

                <Divider style={{ borderColor: "rgba(0,0,0,0.08)", margin: "16px 0" }} />

                {/* PAYMENTS + SEAL + COPYRIGHT */}
                <Row gutter={[16, 16]} align="middle" justify="space-between">
                    <Col xs={24} md={8}>
                        <Space direction="vertical" size={8}>
                            <Image
                                src="https://4rent-thessaloniki.com/images/Logos/creditcardlogos.png"
                                alt="Payment Options"
                                preview={false}
                                style={{ maxWidth: 280 }}
                            />
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.open(
                                        "https://www.sitelock.com/verify.php?site=4rent-thessaloniki.com",
                                        "SiteLock",
                                        "width=600,height=600,left=160,top=170"
                                    );
                                }}
                                aria-label="SiteLock Verification"
                            >
                                <img src="https://shield.sitelock.com/shield/4rent-thessaloniki.com" alt="website security" />
                            </a>
                        </Space>
                    </Col>

                    <Col xs={24} md={8} style={{ textAlign: "center" }}>
                        <Space direction="vertical" size={4} style={{ width: "100%" }}>
                            <a href="/" title="Home" aria-label="Home" style={{ display: "inline-block" }}>
                                <Image
                                    src="https://4rent-thessaloniki.com/images/Logo_White.png"
                                    alt="4Rent Thessaloniki"
                                    preview={false}
                                    style={{ height: 40, objectFit: "contain", filter: "brightness(1.2)" }}
                                />
                            </a>
                            <Text style={{ color: TEXT }}>
                                {t("footer.copyright", { year: thisYear })}
                            </Text>
                        </Space>
                    </Col>

                    <Col xs={24} md={8} style={{ textAlign: "right" }}>
                        <Button
                            type="text"
                            icon={<UpCircleOutlined style={{ color: TEXT }} />}
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            style={{ color: TEXT }}
                        >
                            {t("footer.backToTop")}
                        </Button>
                    </Col>
                </Row>
            </div>
        </Footer>
    );
}
