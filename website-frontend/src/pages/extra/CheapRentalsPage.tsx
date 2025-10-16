// src/pages/cheap/CheapRentalsTruthPage.tsx
import React from "react";
import {Card, Typography, Row, Col, Space, Divider, Tag, Button} from "antd";
import {CarOutlined, CheckCircleFilled, CloseCircleFilled} from "@ant-design/icons";
import {useLangRouter} from "../../resources/useLangRouter.ts";

const { Title, Paragraph, Text } = Typography;

const brandRed = "#ce0505";
const brandBlue = "#075eff";
const okGreen = "#20b36b";
const heroGradient = `linear-gradient(135deg, ${brandBlue} 0%, ${brandBlue} 60%, ${brandRed} 100%)`;

const Bar = ({ width = 160 }: { width?: number }) => (
    <div
        style={{
            height: 4,
            width,
            margin: "18px auto",
            borderRadius: 4,
            background: `linear-gradient(90deg, ${brandBlue}, ${brandRed})`,
        }}
    />
);

const SectionHeader = ({ index, title }: { index: number; title: string }) => (
    <div
        style={{
            background: brandBlue,
            color: "#fff",
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: 10,
            fontWeight: 800,
            margin: "26px 0 12px",
        }}
    >
        {index}.&nbsp; {title}
    </div>
);

function SideBadge({
                       ok,
                       label,
                   }: {
    ok: boolean;
    label: "4rent" | "Ανταγωνιστής";
}) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            {ok ? (
                <CheckCircleFilled style={{ color: okGreen, fontSize: 18 }} />
            ) : (
                <CloseCircleFilled style={{ color: brandRed, fontSize: 18 }} />
            )}
            <Tag color={ok ? brandBlue : brandRed} style={{ color: "#fff", borderRadius: 6 }}>
                {label}
            </Tag>
        </div>
    );
}

function CompareRow({
                        left,
                        right,
                    }: {
    left: React.ReactNode;
    right: React.ReactNode;
}) {
    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
                <Card
                    size="small"
                    style={{
                        borderRadius: 12,
                        border: "1px solid #e6e9f5",
                        boxShadow: "0 6px 22px rgba(0,0,0,0.04)",
                    }}
                    bodyStyle={{ padding: 16 }}
                >
                    <SideBadge ok={false} label="Ανταγωνιστής" />
                    <div style={{ lineHeight: 1.6 }}>{left}</div>
                </Card>
            </Col>
            <Col xs={24} md={12}>
                <Card
                    size="small"
                    style={{
                        borderRadius: 12,
                        border: "1px solid #e6e9f5",
                        boxShadow: "0 6px 22px rgba(0,0,0,0.04)",
                    }}
                    bodyStyle={{ padding: 16 }}
                >
                    <SideBadge ok={true} label="4rent" />
                    <div style={{ lineHeight: 1.6, fontWeight: 700 }}>{right}</div>
                </Card>
            </Col>
        </Row>
    );
}

export default function CheapRentalsTruthPage() {
    const { go } = useLangRouter(); // <<-- lang-aware helpers

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
                            Φθηνά ενοικιαζόμενα αυτοκίνητα
                        </Title>
                    </Space>
                </div>

                <div style={{padding: 20}}>
                    <Paragraph style={{maxWidth: 900, margin: "0 auto 8px", textAlign: "center"}}>
                        Δεν θα βρείτε φθηνά ενοικιαζόμενα αυτοκίνητα σε εμάς! Με 1,00€, 2,00€ ή 5,00€ ανά ημέρα δεν
                        ενοικιάζουμε αυτοκίνητα! Ένα ενοικιαζόμενο αυτοκίνητο που αρχικά κοστίζει π.χ. 5,00€ την ημέρα,
                        ΠΟΤΕ δεν είναι και η τελική τιμή. Αυτά τα “κόλπα” χρησιμοποιούνται από άλλες εταιρείες
                        ενοικίασης
                        αυτοκινήτων σε όλο τον κόσμο και ένα παράδειγμα θα σας το δείξουμε στο παρακάτω γράφημα.
                    </Paragraph>

                    <Bar/>

                    {/* Big price comparison block (styled like the other pages but same info) */}
                    <div style={{textAlign: "center", marginTop: 4, marginBottom: 8}}>
                        <div
                            style={{
                                display: "inline-block",
                                background: "#0f7a2a",
                                color: "#fff",
                                padding: "14px 18px",
                                borderRadius: 12,
                                minWidth: 320,
                                boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                            }}
                        >
                            <div style={{fontSize: 36, fontWeight: 900, lineHeight: 1}}>
                                4rent Thessaloniki
                            </div>
                            <div style={{fontSize: 40, fontWeight: 900, lineHeight: 1.1}}>
                                13,00€ / την ημέρα
                            </div>
                        </div>

                        <div style={{fontSize: 28, fontWeight: 900, margin: "10px 0"}}>vs</div>

                        <div
                            style={{
                                display: "inline-block",
                                padding: "6px 10px",
                                borderRadius: 10,
                                border: "2px solid #222",
                                fontWeight: 900,
                            }}
                        >
                            Ανταγωνιστής — 1,00€ / την ημέρα
                        </div>
                    </div>

                    {/* 1. ΜΙΚΤΗ ΑΣΦΑΛΕΙΑ */}
                    <SectionHeader index={1} title="ΜΙΚΤΗ ΑΣΦΑΛΕΙΑ"/>
                    <CompareRow
                        left={
                            <>
                                <div style={{fontWeight: 700, marginBottom: 4}}>
                                    Με απαλλαγή ή μικτή ασφάλεια!?
                                </div>
                                Μικτή ασφάλεια: <strong>+10,00€ / ημέρα</strong>
                                <br/>
                                Ελαστικά, κάτω μέρος &amp; περιοχή τζαμιού:
                                <br/>
                                <strong>+5,00€ / ημέρα</strong>
                            </>
                        }
                        right={
                            <>
                                Μικτή ασφάλεια <br/>
                                χωρίς συμμετοχή <br/>
                                <Text strong style={{color: "#0d1"}}>
                                    +0,00€
                                </Text>
                            </>
                        }
                    />

                    {/* 2. ΕΠΙΛΟΓΕΣ ΠΛΗΡΩΜΗΣ - ΠΙΣΤΩΤΙΚΗ ΚΑΡΤΑ */}
                    <SectionHeader index={2} title="ΕΠΙΛΟΓΕΣ ΠΛΗΡΩΜΗΣ - ΠΙΣΤΩΤΙΚΗ ΚΑΡΤΑ"/>
                    <CompareRow
                        left={
                            <>
                                Προπληρωμή όλο το ποσό; Με ή χωρίς πιστωτική κάρτα;
                                <br/>
                                Προκαταβολή: <strong>Υποχρεωτικό</strong>
                                <br/>
                                Δεν διαθέτετε κάρτα ή η κάρτα είναι του 2ου οδηγού:
                                <br/>
                                <strong>+5,00€ / ημέρα</strong>
                            </>
                        }
                        right={
                            <>
                                Με προκαταβολή μόνο <strong>49,00€</strong>
                                <br/>
                                Χωρίς πιστωτική κάρτα
                            </>
                        }
                    />

                    {/* 3. ΑΕΡΟΔΡΟΜΙΟ SKG */}
                    <SectionHeader index={3} title="ΑΕΡΟΔΡΟΜΙΟ SKG"/>
                    <CompareRow
                        left={
                            <>
                                Απευθείας στο Αεροδρόμιο;
                                <br/>
                                Shuttle Service: <strong>+0,00€ / ημέρα</strong>
                                <br/>
                                Απευθείας στο Αεροδρόμιο: <strong>+7,00€ / ημέρα</strong>
                            </>
                        }
                        right={
                            <>
                                Δωρεάν υπηρεσία μεταφοράς με <em>“Shuttle bus”</em>
                                <br/>
                                <Text strong style={{color: "#0d1"}}>
                                    +0,00€
                                </Text>
                            </>
                        }
                    />

                    {/* 4. ΔΩΡΕΑΝ ΑΚΥΡΩΣΗ */}
                    <SectionHeader index={4} title="ΔΩΡΕΑΝ ΑΚΥΡΩΣΗ"/>
                    <CompareRow
                        left={
                            <>
                                Αλλαγή ή ακύρωση;
                                <br/>
                                Δωρεάν αλλαγή: <strong>+0,00€ / ημέρα</strong>
                                <br/>
                                Χρέωση ακύρωσης: <strong>+3,00€ / ημέρα</strong>
                            </>
                        }
                        right={
                            <>
                                Premium Υπηρεσία
                                <br/>
                                <Text strong style={{color: brandRed}}>+1,00€ / την ημέρα</Text>
                            </>
                        }
                    />

                    {/* 5. ΚΑΙΝΟΥΡΓΙΑ ΑΥΤΟΚΙΝΗΤΑ */}
                    <SectionHeader index={5} title="ΚΑΙΝΟΥΡΓΙΑ ΑΥΤΟΚΙΝΗΤΑ"/>
                    <CompareRow
                        left={<>Μεγάλη παλαιότητα στόλου • Περιορισμένος εξοπλισμός</>}
                        right={
                            <>
                                Καινούργια &amp; προσεγμένα οχήματα
                                <br/>
                                <Text strong style={{color: "#0d1"}}>+0,00€</Text>
                            </>
                        }
                    />

                    {/* 6. ΠΡΩΤΟΚΟΛΛΟ ΕΠΙΣΤΡΟΦΗΣ */}
                    <SectionHeader index={6} title="ΠΡΩΤΟΚΟΛΛΟ ΕΠΙΣΤΡΟΦΗΣ"/>
                    <CompareRow
                        left={
                            <>
                                Αυστηρός έλεγχος ή όχι;
                                <br/>
                                Τα ενοικιαζόμενα αυτοκίνητα ελέγχονται!
                                <br/>
                                Ακριβή χρέωση σε περίπτωση ζημιάς!
                            </>
                        }
                        right={
                            <>
                                Άνετη επιστροφή
                                <br/>
                                <Text strong style={{color: "#0d1"}}>+0,00€</Text>
                            </>
                        }
                    />

                    {/* Final price box */}
                    <Card
                        style={{
                            borderRadius: 14,
                            border: "1px solid #e6e9f5",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                            marginTop: 24,
                        }}
                        bodyStyle={{padding: 18}}
                    >
                        <div
                            style={{
                                background: brandBlue,
                                color: "#fff",
                                display: "inline-block",
                                padding: "8px 14px",
                                borderRadius: 10,
                                fontWeight: 900,
                                marginBottom: 12,
                            }}
                        >
                            ΤΕΛΙΚΗ ΤΙΜΗ
                        </div>

                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Card size="small" bodyStyle={{padding: 14}} style={{borderRadius: 10}}>
                                    <SideBadge ok={false} label="Ανταγωνιστής"/>
                                    Τιμή ανταγωνιστή χωρίς ζημιά: <strong>30,00€ / ημέρα</strong>
                                    <br/>
                                    + τη ζημιά! (αν προκληθεί)
                                </Card>
                            </Col>
                            <Col xs={24} md={12}>
                                <Card size="small" bodyStyle={{padding: 14}} style={{borderRadius: 10}}>
                                    <SideBadge ok={true} label="4rent"/>
                                    <div style={{fontSize: 18, fontWeight: 800, lineHeight: 1.25}}>
                                        4rent Τιμή
                                        <br/>
                                        <span style={{fontSize: 30}}>13,00€ / την ημέρα!</span>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Card>

                    <Divider/>

                    <Title level={4} style={{textAlign: "center", marginTop: 0}}>
                        Η ειλικρίνεια μας κάνει τη διαφορά!
                    </Title>
                    <div style={{textAlign: "center", marginTop: 24, marginBottom: 8}}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<CarOutlined/>}
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
                    </div>
                </div>
            </Card>
        </div>
    );
}
