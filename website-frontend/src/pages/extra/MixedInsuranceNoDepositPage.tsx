// src/pages/insurance/MixedInsuranceNoDepositPage.tsx
import React from "react";
import { Card, Typography, Space, Image } from "antd";

const { Title, Paragraph, Text } = Typography;

const brandRed = "#ce0505";
const brandBlue = "#075eff";
const heroGradient = `linear-gradient(135deg, ${brandBlue} 0%, ${brandBlue} 60%, ${brandRed} 100%)`;

const Bar = () => (
    <div
        style={{
            height: 4,
            width: 160,
            margin: "18px auto",
            borderRadius: 4,
            background: `linear-gradient(90deg, ${brandBlue}, ${brandRed})`,
        }}
    />
);

export default function MixedInsuranceNoDepositPage() {
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
                    <Space direction="vertical" size={6} style={{ width: "100%" }}>
                        <Title level={2} style={{ color: "white", margin: 0 }}>
                            Μικτή ασφάλεια χωρίς εγγύηση & χωρίς πιστωτική κάρτα
                        </Title>
                        <Text style={{ color: "rgba(255,255,255,0.95)", fontWeight: 500 }}>
                            Ενοικίαση Αυτοκινήτου Θεσσαλονίκη
                        </Text>
                    </Space>
                </div>

                {/* BODY */}
                <div style={{ padding: 20 }}>
                    <Paragraph style={{ maxWidth: 920, margin: "0 auto 8px", textAlign: "center" }}>
                        Μπορεί να τύχει και στον καλύτερο οδηγό 🙂. <br />
                        Δεν είναι πρόβλημα για εμάς! Για να διασφαλιστείτε ότι είστε πλήρως προστατευμένοι
                        με μικτή ασφάλεια χωρίς εγγύηση και χωρίς να απαιτείται πιστωτική κάρτα,
                        πρέπει να πράτετε τα εξής:
                    </Paragraph>

                    <Bar />

                    {/* Illustration */}
                    <div style={{ maxWidth: 980, margin: "0 auto" }}>
                        <Image
                            src="https://4rent-thessaloniki.com/images/Step_El.png"
                            alt="Μικτή ασφάλεια — βήματα"
                            style={{ width: "100%", borderRadius: 12 }}
                            preview={false}
                        />
                    </div>

                    {/* Footnote / small print exactly as on the page (kept concise) */}
                    <Paragraph type="secondary" style={{ maxWidth: 980, margin: "14px auto 0", fontSize: 13, lineHeight: 1.7 }}>
                        * Εκτός βέβαια όταν παραβιάζετε τους όρους (αλκοόλ, μη εξουσιοδοτημένοι δρόμοι κτλ.).
                        Σε περίπτωση ζημιάς, ανεξαρτήτως ευθύνης, ενδέχεται να χρεωθείτε <Text strong>25,00€</Text> για
                        τη διαχείριση του σχετικού φακέλου.
                    </Paragraph>
                </div>
            </Card>
        </div>
    );
}
