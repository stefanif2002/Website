import React from "react";
import { Card, Row, Col, Image, Button, Space, Typography, Tag } from "antd";
import { CarOutlined, ArrowRightOutlined } from "@ant-design/icons";

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

const CATEGORIES: Cat[] = [
    {
        key: "a",
        title: "Μικρή Κατηγορία",
        href: "/el/stolos/mikri-katigoria-enoikiaseis-autokiniton-thessaloniki",
        img: "https://4rent-thessaloniki.com/images/fleet/aygox.png",
        tags: ["Πόλη", "Οικονομικό", "A/C"],
        desc: "Ευελιξία στην πόλη, χαμηλή κατανάλωση — ιδανική για 2–4 άτομα.",
    },
    {
        key: "b",
        title: "Μεσαία Κατηγορία",
        href: "/el/stolos/mesaia-katigoria",
        img: "https://4rent-thessaloniki.com/images/fleet/ibiza.png",
        tags: ["Άνεση", "A/C"],
        desc: "Περισσότερος χώρος & άνεση για καθημερινές και εκδρομές.",
    },
    {
        key: "c",
        title: "Compact / Hatchback",
        href: "/el/stolos/compact",
        img: "https://4rent-thessaloniki.com/images/fleet/golf.png",
        tags: ["Οικογένεια", "A/C"],
        desc: "Ισορροπία χώρου/οικονομίας, ιδανικό για μικρές αποδράσεις.",
    },
    {
        key: "suv",
        title: "SUV / Crossover",
        href: "/el/stolos/suv",
        img: "https://4rent-thessaloniki.com/images/fleet/arona-site-2.png",
        tags: ["Ψηλή θέση", "Ασφάλεια"],
        desc: "Υψηλή ορατότητα & άνεση — τέλειο για οικογενειακές διακοπές.",
    },
    {
        key: "sed",
        title: "Sedan / Hybrid",
        href: "/el/stolos/sedan",
        img: "https://4rent-thessaloniki.com/images/fleet/corolla.png",
        tags: ["Υβριδικό", "Άνεση"],
        desc: "Άνεση, τεχνολογία και οικονομία καυσίμου.",
    },
    {
        key: "van",
        title: "7θέσια / Van",
        href: "/el/stolos/7seats",
        img: "https://4rent-thessaloniki.com/images/fleet/caddy.png",
        tags: ["Χώρος", "Οικογένεια"],
        desc: "Μεγάλοι χώροι αποσκευών & καθισμάτων για 6–7 άτομα.",
    },
];

export default function FleetCategoriesPage() {
    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "80%", maxWidth: 1200, padding: "24px 0 40px" }}>
                <Title level={2} style={{ color: brandRed, textAlign: "center", marginBottom: 8 }}>
                    Διαθέσιμες Κατηγορίες — Ο Στόλος μας
                </Title>

                {/* subtle blue accent line */}
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
                    Επιλέξτε την κατηγορία που ταιριάζει στις ανάγκες σας και κάντε κράτηση με προκαταβολή 49€.
                    Όλα τα αυτοκίνητα διαθέτουν{" "}
                    <span style={{ color: brandBlue, fontWeight: 600 }}>μικτή ασφάλεια χωρίς απαλλαγή</span>.
                </Paragraph>

                <Row gutter={[16, 20]}>
                    {CATEGORIES.map((c) => (
                        <Col xs={24} sm={12} lg={8} key={c.key}>
                            <Card
                                hoverable
                                style={{
                                    borderRadius: 12,
                                    border: "1px solid #e6e9f5",
                                    boxShadow: "0 6px 24px rgba(0,0,0,0.04)",
                                    borderTop: `4px solid ${brandBlue}`, // blue accent
                                }}
                                bodyStyle={{ padding: 14 }}
                                cover={
                                    <div style={{ padding: 12, background: "#f7fbfc" /* light blue-ish bg */ }}>
                                        <Image src={c.img} alt={c.title} style={{ width: "100%", height: "auto" }} preview={false} />
                                    </div>
                                }
                            >
                                <Title level={4} style={{ color: brandRed, marginBottom: 8 }}>
                                    {c.title}
                                </Title>

                                <Space wrap size={[6, 6]} style={{ marginBottom: 8 }}>
                                    {c.tags.map((t, i) => (
                                        <Tag key={t} color={i % 2 === 0 ? brandBlue : brandRed}>
                                            {t}
                                        </Tag>
                                    ))}
                                </Space>

                                <Text type="secondary" style={{ display: "block", minHeight: 44 }}>
                                    {c.desc}
                                </Text>

                                <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                                    <Button href={c.href} style={{ borderColor: brandBlue, color: brandBlue }}>
                                        Περισσότερα
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
                        Αναζήτηση Διαθεσιμότητας
                    </Button>
                </div>
            </div>
        </div>
    );
}
