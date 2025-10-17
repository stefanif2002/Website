// src/pages/extra/ChalkidikiRentPage.tsx
import React from "react";
import {
    Card,
    Typography,
    Space,
    Row,
    Col,
    Divider,
    Button,
    Image,
} from "antd";
import { CarOutlined, EnvironmentOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import {useLangRouter} from "../../resources/useLangRouter.ts";

const { Title, Paragraph, Text } = Typography;

const brandRed = "#ce0505";
const brandBlue = "#075eff";
const heroGradient = `linear-gradient(135deg, ${brandBlue} 0%, ${brandBlue} 60%, ${brandRed} 100%)`;

export default function ChalkidikiRentPage() {
    const { go } = useLangRouter(); // <<-- lang-aware helpers

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
                        Ενοικιάσεις Αυτοκινήτων Χαλκιδική
                    </Title>
                </div>

                {/* CONTENT */}
                <div style={{ padding: 20 }}>
                    <Row gutter={[24, 24]} align="top" justify="start">
                        <Col xs={24} md={9}>
                            <Image
                                src="https://4rent-thessaloniki.com/images/Logos/4Rent_Chalkidiki.jpg"
                                alt="4rent Chalkidiki"
                                style={{ borderRadius: 12, width: "100%" }}
                                preview={false}
                            />
                        </Col>

                        <Col xs={24} md={15}>
                            <Space direction="vertical" size={12} style={{ width: "100%", textAlign: "left" }}>
                                <Paragraph style={{ marginBottom: 4 }}>
                                    Με την ενοικίαση αυτοκινήτων 4rent στη Χαλκιδική, θα περάστε υπέροχες διακοπές στην Κασσάνδρα ή Σιθωνία.
                                </Paragraph>

                                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                                    <div><CheckCircleTwoTone twoToneColor="#52c41a" />{" "}
                                        <Text>Παράδοση και παραλαβή απευθείας στο ξενοδοχείο σας.</Text>
                                    </div>
                                    <div><CheckCircleTwoTone twoToneColor="#52c41a" />{" "}
                                        <Text>Με εμάς έχετε επίσης τη δυνατότητα να παραλάβετε το αυτοκίνητό σας στη Χαλκιδική και να το επιστρέψετε στο Αεροδρόμιο Θεσσαλονίκη.</Text>
                                    </div>
                                    <div><CheckCircleTwoTone twoToneColor="#52c41a" />{" "}
                                        <Text>Όλα τα αυτοκίνητα ενοικίασης είναι πλήρως ασφαλισμένα ώστε να αισθάνεστε απολύτως ασφαλείς στις διακοπές σας.</Text>
                                    </div>
                                </Space>
                            </Space>
                        </Col>
                    </Row>

                    <Divider />

                    <Row gutter={[24, 24]} align="top" justify="start">
                        <Col xs={24} md={9}>
                            <Image
                                src="https://4rent-thessaloniki.com/images/Logos/chalkidiki-map.png"
                                alt="Χάρτης Χαλκιδικής"
                                style={{ borderRadius: 12, width: "100%" }}
                                preview={false}
                            />
                        </Col>

                        <Col xs={24} md={15} style={{ textAlign: "left" }}>
                            <Title level={4} style={{ marginTop: 0 }}>
                                <EnvironmentOutlined /> Σημεία εξυπηρέτησης:
                            </Title>

                            <Space direction="vertical" size={14} style={{ width: "100%" }}>
                                <div>
                                    <Text strong>✓ Χαλκιδική - Ακτίνα 50 χλμ. από το αεροδρόμιο Θεσσαλονίκης</Text>
                                    <Paragraph style={{ marginTop: 6, marginBottom: 0 }}>
                                        → Επανωμή, Φλογητά, Μηχανιώνα, Νέα Καλλικράτεια, Νέα Μουδανιά, Νέα Πλάγια, Νέα Ποτίδαια, Παραλία Διονυσίου
                                    </Paragraph>
                                </div>

                                <div>
                                    <Text strong>✓ Χαλκιδική - Ακτίνα 100 χλμ. από το αεροδρόμιο Θεσσαλονίκης</Text>
                                    <Paragraph style={{ marginTop: 6, marginBottom: 0 }}>
                                        → Άφυτος, Αρναία, Ελιά, Γερακινή, Χανιώτη, Καλλιθέα, Κρυοπηγή, Μεταμόρφωση, Νέα Σκιώνη, Νικήτη, Παλιούρι,
                                        Πευκοχώρι, Πολυχρόνος, Ποσείδι, Όρμος Παναγίας, Σάνη, Ριζόπουλο, Σιβηρή, Βατοπέδι
                                    </Paragraph>
                                </div>

                                <div>
                                    <Text strong>✓ Χαλκιδική - Ακτίνα 120 χλμ. από το αεροδρόμιο Θεσσαλονίκης</Text>
                                    <Paragraph style={{ marginTop: 6, marginBottom: 0 }}>
                                        → Ουρανούπολη, Καλαμίτσι, Σάρτη, Βουρβουρού, Ιερισσός, Νέος Μαρμαράς, Πυργαδίκια, Τορώνη
                                    </Paragraph>
                                </div>
                            </Space>
                        </Col>
                    </Row>

                    <Divider />

                    <Row justify="center">
                        <Col>
                            <Button
                                type="primary"
                                size="large"
                                icon={<CarOutlined />}
                                onClick={() => go("/search")}
                                style={{
                                    backgroundColor: brandRed,
                                    borderColor: brandRed,
                                    paddingInline: 20,
                                    borderRadius: 8,
                                }}
                            >
                                Κάντε Κράτηση Τώρα
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    );
}
