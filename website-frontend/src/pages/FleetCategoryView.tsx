import React from "react";
import { Button, Card, Col, Divider, Image, Row, Space, Tag, Typography } from "antd";
import { CarOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const brandRed = "#ce0505";
const brandBlue = "#075eff";

/** Map every fleet slug to UI copy + gallery (expand/adjust anytime) */
const CATEGORY_CONTENT: Record<string, {
    title: string;
    description: string;
    tags: string[];
    models: string[];
    gallery: string[];
}> = {
    "mikri-katigoria-enoikiaseis-autokiniton-thessaloniki": {
        title: "Μικρή Κατηγορία — Ενοικιάσεις Αυτοκινήτων Θεσσαλονίκη",
        description:
            "Οικονομική & ευέλικτη επιλογή για την πόλη: εύκολο παρκάρισμα, χαμηλή κατανάλωση και άνεση για 2–4 άτομα.",
        tags: ["4–5 Θέσεις", "3–5 Πόρτες", "A/C", "Οικονομική Κατανάλωση", "Ιδανικό για πόλη"],
        models: ["SEAT Mii", "Toyota Aygo", "Citroën C1"],
        gallery: [
            "https://4rent-thessaloniki.com/images/fleet/aygox.png",
            "https://4rent-thessaloniki.com/images/fleet/ibiza.png",
            "https://4rent-thessaloniki.com/images/fleet/golf.png",
        ],
    },
    "mesaia-katigoria-enoikiaseis-autokiniton-thessaloniki": {
        title: "Μεσαία κατηγορία — Ενοικιάσεις Αυτοκινήτων Θεσσαλονίκη",
        description:
            "Ισορροπία άνεσης και χώρου για οικογένειες ή παρέες. Ιδανική για μικρές αποδράσεις και καθημερινές μετακινήσεις.",
        tags: ["5 Θέσεις", "Μεγαλύτερος χώρος αποσκευών", "A/C", "Άνεση"],
        models: ["VW Polo", "Opel Corsa", "Ford Fiesta"],
        gallery: [
            "https://4rent-thessaloniki.com/images/fleet/golf.png",
            "https://4rent-thessaloniki.com/images/fleet/corolla.png",
            "https://4rent-thessaloniki.com/images/fleet/ibiza.png",
        ],
    },
    "megali-katigoria-enoikiaseis-autokiniton-thessaloniki": {
        title: "Μεγάλη Κατηγορία — Ενοικιάσεις Αυτοκινήτων Θεσσαλονίκη",
        description:
            "Χώρος, άνεση και επιπλέον εξοπλισμός για ξεκούραστα ταξίδια εντός και εκτός πόλης.",
        tags: ["5 Θέσεις", "Μεγάλος χώρος", "A/C", "Άνεση ταξιδιού"],
        models: ["VW Passat", "Toyota Corolla", "Skoda Octavia"],
        gallery: [
            "https://4rent-thessaloniki.com/images/fleet/corolla.png",
            "https://4rent-thessaloniki.com/images/fleet/golf.png",
            "https://4rent-thessaloniki.com/images/fleet/jogger.png",
        ],
    },
    "oikogeniaki-katigoria-enoikiaseis-autokiniton-thessaloniki": {
        title: "Οικογενειακή κατηγορία — Ενοικιάσεις Αυτοκινήτων Θεσσαλονίκη",
        description:
            "Άνεση και ασφάλεια για οικογένειες, με πρακτικούς αποθηκευτικούς χώρους και ευκολίες.",
        tags: ["5 Θέσεις", "Μεγάλος χώρος αποσκευών", "Isofix", "A/C"],
        models: ["Dacia Jogger", "Toyota Corolla TS", "Skoda Scala"],
        gallery: [
            "https://4rent-thessaloniki.com/images/fleet/jogger.png",
            "https://4rent-thessaloniki.com/images/fleet/corolla.png",
            "https://4rent-thessaloniki.com/images/fleet/golf.png",
        ],
    },
    "anoteri-katigoria-enoikiaseis-autokiniton-thessaloniki": {
        title: "Ανώτερη κατηγορία — Ενοικιάσεις Αυτοκινήτων Θεσσαλονίκη",
        description:
            "Πλούσιος εξοπλισμός, αναβαθμισμένη ποιότητα κύλισης και επιπλέον άνεση.",
        tags: ["Premium εσωτερικό", "Ασφάλεια", "A/C", "Άνεση"],
        models: ["VW Golf", "Toyota C-HR", "Mazda 3"],
        gallery: [
            "https://4rent-thessaloniki.com/images/fleet/golf.png",
            "https://4rent-thessaloniki.com/images/fleet/chr.png",
            "https://4rent-thessaloniki.com/images/fleet/corolla.png",
        ],
    },
    "karaban-katigoria-enoikiaseis-autokiniton-thessaloniki": {
        title: "Ανώτερη κατηγορία Καραβάν — Ενοικιάσεις Θεσσαλονίκη",
        description:
            "Μεγαλύτερος χώρος και πρακτικότητα για οικογένειες και εξορμήσεις με αποσκευές.",
        tags: ["Μεγάλος χώρος", "Άνεση", "A/C", "Ευελιξία"],
        models: ["VW Caddy", "Dacia Jogger", "Toyota Corolla TS"],
        gallery: [
            "https://4rent-thessaloniki.com/images/fleet/caddy.png",
            "https://4rent-thessaloniki.com/images/fleet/jogger.png",
            "https://4rent-thessaloniki.com/images/fleet/corolla.png",
        ],
    },
    "suv-jeep-enoikiaseis-autokiniton-thessaloniki": {
        title: "SUV / Jeep — Ενοικιάσεις Αυτοκινήτων Θεσσαλονίκη",
        description:
            "Υψηλή θέση οδήγησης, άνεση και πρακτικότητα για την πόλη και τις αποδράσεις.",
        tags: ["SUV", "Άνεση", "A/C", "Υψηλή θέση οδήγησης"],
        models: ["SEAT Arona", "Toyota C-HR", "Dacia Duster"],
        gallery: [
            "https://4rent-thessaloniki.com/images/fleet/arona-site-2.png",
            "https://4rent-thessaloniki.com/images/fleet/chr.png",
            "https://4rent-thessaloniki.com/images/fleet/jogger.png",
        ],
    },
    "minivan-7theseis-enoikiaseis-autokiniton-thessaloniki": {
        title: "Μίνι Βαν 7 Θέσεων — Ενοικιάσεις Θεσσαλονίκη",
        description:
            "Ιδανικό για μεγάλες παρέες ή οικογένειες με αυξημένες ανάγκες μεταφοράς.",
        tags: ["7 Θέσεις", "Μεγάλος χώρος", "A/C"],
        models: ["Dacia Jogger 7S", "VW Caddy 7S"],
        gallery: [
            "https://4rent-thessaloniki.com/images/fleet/jogger.png",
            "https://4rent-thessaloniki.com/images/fleet/caddy.png",
            "https://4rent-thessaloniki.com/images/fleet/chr.png",
        ],
    },
    "minivan-9theseis-enoikiaseis-autokiniton-thessaloniki": {
        title: "Μίνι Βαν 9 Θέσεων — Ενοικιάσεις Θεσσαλονίκη",
        description:
            "Μετακινήσεις ομάδων με άνεση και ασφάλεια. Τέλειο για εταιρικά ή group ταξίδια.",
        tags: ["9 Θέσεις", "Μεγάλος χώρος αποσκευών", "A/C"],
        models: ["VW Transporter 9S", "Ford Transit 9S"],
        gallery: [
            "https://4rent-thessaloniki.com/images/fleet/caddy.png",
            "https://4rent-thessaloniki.com/images/fleet/jogger.png",
            "https://4rent-thessaloniki.com/images/fleet/golf.png",
        ],
    },
    "automato-autokinito-enoikiaseis-thessaloniki": {
        title: "Αυτόματο κιβώτιο — Ενοικιάσεις Θεσσαλονίκη",
        description:
            "Χαλαρή οδήγηση στην πόλη και ταξίδι χωρίς κούραση με αυτόματο κιβώτιο.",
        tags: ["Αυτόματο", "A/C", "Άνεση"],
        models: ["Toyota C-HR Auto", "VW Golf DSG", "SEAT Arona DSG"],
        gallery: [
            "https://4rent-thessaloniki.com/images/fleet/chr.png",
            "https://4rent-thessaloniki.com/images/fleet/golf.png",
            "https://4rent-thessaloniki.com/images/fleet/arona-site-2.png",
        ],
    },
    "petrelaio-autokinito-enoikiaseis-thessaloniki": {
        title: "Πετρέλαιο (Diesel) — Ενοικιάσεις Θεσσαλονίκη",
        description:
            "Μεγάλη αυτονομία και χαμηλή κατανάλωση για όσους γράφουν χιλιόμετρα.",
        tags: ["Diesel", "Οικονομία", "A/C"],
        models: ["VW Golf TDI", "Toyota Corolla Diesel"],
        gallery: [
            "https://4rent-thessaloniki.com/images/fleet/golf.png",
            "https://4rent-thessaloniki.com/images/fleet/corolla.png",
            "https://4rent-thessaloniki.com/images/fleet/jogger.png",
        ],
    },
    "enoikiasi-politeleias-autokinito-thessaloniki": {
        title: "Κατηγορία πολυτελείας — Ενοικιάσεις Θεσσαλονίκη",
        description:
            "Ανώτερη άνεση, τεχνολογία και κύρος για μοναδικές εμπειρίες.",
        tags: ["Luxury", "Premium", "A/C"],
        models: ["BMW 3 Series", "Audi A4", "Mercedes C-Class"],
        gallery: [
            "https://4rent-thessaloniki.com/images/fleet/chr.png",
            "https://4rent-thessaloniki.com/images/fleet/corolla.png",
            "https://4rent-thessaloniki.com/images/fleet/golf.png",
        ],
    },
};

type Props = { slug: string };

export default function FleetCategoryView({ slug }: Props) {
    const data = CATEGORY_CONTENT[slug];

    if (!data) {
        return (
            <div style={{ width: "100%", textAlign: "center", padding: "60px 0" }}>
                <Title level={3} style={{ color: brandRed }}>Η κατηγορία δεν βρέθηκε.</Title>
                <Button href="/el/stolos/diathesimes-katigories-o-stolos-mas" style={{ borderColor: brandBlue, color: brandBlue }}>
                    Όλες οι κατηγορίες
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
                        height: 4, width: 140, margin: "0 auto 18px", borderRadius: 4,
                        background: `linear-gradient(90deg, ${brandBlue}, ${brandRed})`,
                    }}
                />

                <Paragraph style={{ textAlign: "center", maxWidth: 880, margin: "0 auto 20px" }}>
                    {data.description}
                </Paragraph>

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
                            <Title level={5} style={{ marginTop: 0, color: brandBlue }}>Βασικά χαρακτηριστικά</Title>
                            <Space wrap size={[8, 8]} style={{ marginBottom: 8 }}>
                                {data.tags.map(t => <Tag key={t} color={brandBlue}>{t}</Tag>)}
                            </Space>

                            <Divider />

                            <Title level={5} style={{ marginTop: 0, color: brandBlue }}>Ενδεικτικά μοντέλα</Title>
                            <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
                                {data.models.map(m => <Tag key={m} color={brandBlue}>{m}</Tag>)}
                            </Space>

                            {/* Zoomable gallery */}
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
                                                                    Κλικ για μεγέθυνση
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
                                <Button
                                    href="/el/stolos/diathesimes-katigories-o-stolos-mas"
                                    style={{ borderColor: brandBlue, color: brandBlue }}
                                >
                                    Όλες οι κατηγορίες
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<CarOutlined />}
                                    style={{ backgroundColor: brandRed, borderColor: brandRed }}
                                    href="/book/search"
                                >
                                    Κράτηση τώρα
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
                                Γιατί να επιλέξω αυτή την κατηγορία;
                            </Title>
                            <ul style={{ paddingLeft: 18, marginBottom: 12 }}>
                                <li style={{ marginBottom: 8 }}>
                                    <span style={{ color: brandBlue, fontWeight: 600 }}>Άνεση & ασφάλεια</span> για τις καθημερινές σας ανάγκες
                                </li>
                                <li style={{ marginBottom: 8 }}>
                                    <span style={{ color: brandBlue, fontWeight: 600 }}>Σύγχρονα μοντέλα</span> με οικονομία καυσίμου
                                </li>
                                <li style={{ marginBottom: 8 }}>
                                    Προσαρμοσμένες επιλογές για <span style={{ color: brandBlue, fontWeight: 600 }}>Θεσσαλονίκη</span> & αποδράσεις
                                </li>
                            </ul>

                            <Divider style={{ margin: "12px 0" }} />

                            <Title level={5} style={{ marginTop: 0, color: brandBlue }}>Περιλαμβάνονται</Title>
                            <Space direction="vertical" size={4}>
                                <Text>- Μικτή ασφάλεια χωρίς απαλλαγή</Text>
                                <Text>- Απεριόριστα χιλιόμετρα</Text>
                                <Text>- 2ος οδηγός χωρίς χρέωση</Text>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
