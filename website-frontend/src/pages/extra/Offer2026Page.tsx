import React from "react";
import { Button, Card, Col, Row, Space, Typography, Image, Divider } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

const brandRed = "#ce0505";
const brandBlue = "#075eff";

const bullet = (text: React.ReactNode) => (
    <li style={{ marginBottom: 8 }}>
        <span style={{ color: brandBlue, fontWeight: 700, marginRight: 6 }}>✓</span>
        <Text>{text}</Text>
    </li>
);

export default function Offer2026Page() {
    const navigate = useNavigate();

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
                        background: `linear-gradient(90deg, ${brandBlue}, ${brandRed})`,
                        color: "white",
                        padding: "28px 24px",
                    }}
                >
                    <Space direction="vertical" size={6} style={{ width: "100%" }}>
                        <Title level={2} style={{ color: "white", margin: 0 }}>
                            Προσφορά 2026!
                        </Title>
                        <div
                            style={{
                                height: 4,
                                width: 140,
                                background: "white",
                                borderRadius: 4,
                            }}
                        />
                    </Space>
                </div>

                {/* IMAGE ROW */}
                <Row style={{ padding: "20px 20px 0 20px" }}>
                    <Col span={24}>
                        <Image
                            src="https://4rent-thessaloniki.com/images/de_2024.png"
                            alt="Προσφορά ενοικίασης αυτοκινήτου Θεσσαλονίκη"
                            style={{
                                borderRadius: 12,
                                width: "100%",
                                objectFit: "cover",
                                marginBottom: 10,
                            }}
                            preview={false}
                        />
                    </Col>
                </Row>

                {/* TEXTS + DIVIDER + BUTTONS */}
                <div style={{ padding: 20 }}>
                    <Row gutter={[24, 24]} align="top">
                        <Col xs={24} md={12}>
                            <Space direction="vertical" size={12} style={{ width: "100%" }}>
                                <Title level={4} style={{ margin: 0, color: brandBlue }}>
                                    Έως και <Text style={{ color: brandRed }}>30% έκπτωση</Text>!
                                </Title>

                                <Paragraph style={{ margin: 0 }}>
                                    Η προσφορά ισχύει για περιορισμένο χρόνο και η έκπτωση υπολογίζεται αυτόματα.
                                    Μετά την κράτησή σας, μπορείτε να ζητήσετε επιπλέον{" "}
                                    <Text strong>
                                        5% έκπτωση
                                    </Text>{" "}
                                    στο υπόλοιπο ποσό, με προπληρωμή και χωρίς κανένα ρίσκο!
                                </Paragraph>

                                <Paragraph style={{ margin: 0 }}>
                                    <Text type="secondary">
                                        Ισχύει για κρατήσεις με έναρξη μίσθωσης στις{" "}
                                        <Text strong>
                                            15/04/2026
                                        </Text>.
                                    </Text>
                                </Paragraph>
                            </Space>
                        </Col>

                        <Col xs={24} md={12}>
                            <Space direction="vertical" size={10} style={{ width: "100%" }}>
                                <Title level={5} style={{ margin: 0, color: brandBlue }}>
                                    To All-inclusive πακέτο περιλαμβάνεται σε κάθε κράτηση:
                                </Title>

                                <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
                                    {bullet("Μικτή ασφάλεια χωρίς συμμετοχή (περιλαμβάνει ελαστικά, κάτω μέρος & τζάμια)")}
                                    {bullet("Χωρίς εγγύηση & χωρίς Πιστωτική κάρτα")}
                                    {bullet("Επιπλέον οδηγός")}
                                    {bullet("Απεριόριστα χιλιόμετρα")}
                                    {bullet("24ωρη εξυπηρέτηση Παράδοση - Παραλαβή")}
                                    {bullet("Καθαρισμός αυτοκινήτου")}
                                </ul>
                            </Space>
                        </Col>
                    </Row>

                    <Divider
                        style={{
                            borderColor: brandBlue,
                            borderWidth: 2,
                            margin: "24px 0",
                            width: "80%",
                        }}
                    />

                    <Space wrap>
                        <Button
                            size="large"
                            style={{
                                borderColor: brandBlue,
                                color: brandBlue,
                                fontWeight: 600,
                            }}
                            onClick={() => navigate("./search")}
                        >
                            Στην επισκόπηση τιμών
                        </Button>

                        <Button
                            type="primary"
                            size="large"
                            style={{
                                backgroundColor: brandRed,
                                borderColor: brandRed,
                                fontWeight: 600,
                            }}
                            onClick={() => navigate("./search")}
                        >
                            Κάντε κράτηση
                        </Button>
                    </Space>
                </div>
            </Card>
        </div>
    );
}
