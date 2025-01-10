import React, {useRef, useState} from 'react';
import styles from "./Dashboard.module.css";
import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
    ShopOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Layout, Menu, theme, Image, Select, Space, Col, Button, Row} from 'antd';
import {featureNotImplemented, url, width} from "../resources/service.ts";

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
    overflowY: 'auto',
    height: '100vh',
    position: 'fixed',
    scrollbarWidth: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Black with 60% transparency
    zIndex: 2,
};

const items: MenuProps['items'] = [
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    BarChartOutlined,
    CloudOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShopOutlined,
].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
}));

function Dashboard () {
    const [stringImage] = useState<string>("/resources/main.png");
    const contentRef = useRef<HTMLDivElement>(null); // Reference for the Content area


    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const typeOptions = [
        {
            label: (
                <Space >
                    <img
                        src="https://flagcdn.com/w40/gb.png"
                        alt="English"
                        style={{ width: 20, height: 15, marginTop:'8px' }}
                    />
                    English
                </Space>
            ),
            value: 'en',
        },
        {
            label: (
                <Space>
                    <img
                        src="https://flagcdn.com/w40/gr.png"
                        alt="Ελληνικά"
                        style={{ width: 20, height: 15, marginTop:'8px' }}

                    />
                    Ελληνικά
                </Space>
            ),
            value: 'el',
        },
        // Add more languages here as needed
    ];

    const [language, setLanguage] = useState<string>('en'); // Default language

    // Handle language change
    const handleLanguageChange = (value: string) => {
        if (value === "el")
            featureNotImplemented()
        else {
            setLanguage(value);
        }

        // You can implement the language switching logic here (e.g., update translations)
    };
    return (
            <Layout style={{ height: '100vh', width: '100vw', backgroundColor: 'white'}} hasSider>
                <Sider trigger={null} style={siderStyle} collapsed={true}>
                    <div className={styles.logo}>
                        <Image

                            src={`https://4rent-thessaloniki.com/images/Logo_White.png`}
                            style={{ maxWidth: '55px', height: 'auto' }} // Ensures responsiveness

                        />
                    </div>
                    <Menu mode="inline" items={items} style={{backgroundColor: 'transparent'}}/>
                </Sider>
                <Layout style={{ overflowY: 'auto'}}>
                    <Header style={{ padding: 10, background: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', marginInlineStart: 80 }}>
                        <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                            <Col>
                                <div>Hi</div>
                            </Col>

                            <Col style={{ display: 'flex', alignItems: 'center'}}>
                                <Space>
                                    <Select
                                        defaultValue={language}
                                        onChange={handleLanguageChange}
                                        options={typeOptions}
                                        style={{width:'120px'}}
                                    />

                                </Space>

                            </Col>
                        </Row>
                    </Header>
                    <Content
                        ref={contentRef}
                        style={{
                            position: 'relative', // Make the content container a relative parent
                            zIndex: 1, // Ensure the text stays on top
                            height: '100%',
                            display: 'flex', // Flexbox for centering
                            flexGrow: 1,
                            justifyContent: 'center', // Center horizontally
                            backgroundColor: 'white',
                            overflow: 'auto'
                        }}
                    >
                        {/* Background image div */}
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: `
                linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 70%),
                url(https://4rent-thessaloniki.com/images/background.jpg)
            `,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                opacity: 0.6, // Apply opacity only to the background
                                zIndex: -1, // Place it behind the text
                            }}
                        ></div>

                        {/* Centered Content */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column', // Stack elements vertically
                                alignItems: 'center', // Center horizontally
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <h1
                                style={{
                                    color: 'red',
                                    fontSize: '5rem', // Adjust size as needed
                                    textAlign: 'center', // Center align the text
                                }}
                            >
                                4Rent Ενοικιάσεις<br/>
                                Αυτοκινήτων<br/>
                                Θεσσαλονίκη
                            </h1>
                            <h2
                                style={{
                                    color: 'red',
                                    textAlign: 'center', // Center align the text
                                }}
                            >
                                Όλα τα αυτοκίνητα ενοικίασης είναι πλήρως ασφαλισμένα με μικτή ασφάλεια χωρίς απαλλαγή.
                            </h2>
                            <Button
                                style={{
                                    backgroundColor: '#ce0505',
                                    color: '#fff',
                                    padding: '10px 20px',
                                    fontSize: '1.2rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginTop: '80px', // Add spacing between the subtitle and the button
                                }}
                            >
                                ΚΑΝΤΕ ΚΡΑΤΗΣΗ ΤΩΡΑ
                            </Button>
                            <div style={{width: '60%', textAlign: 'start', lineHeight: '1.6', marginTop: '60px'}}>
                                <h2 style={{fontSize: '2rem'}}>Ενοικιάσεις Αυτοκινήτων Θεσσαλονίκη Αεροδρόμιο</h2>

                                Καλώς ήρθατε στη 4rent!<br/>

                                Η εταιρία με χώρα δραστηριοποίησης την Ελλάδα και βάση τη Θεσσαλονίκη η οποία ασχολείται
                                με τις ενοικιάσεις αυτοκινήτων σας προσφέρει οχήματα διαφόρων Κατηγοριών (στόλος
                                αυτοκινήτων), σε προνομιακές τιμές, ώστε να μπορείτε να επιλέξετε εκείνη που ικανοποιεί
                                πλήρως τις ανάγκες σας.
                                Επίσης, σας παρέχουμε προσωπική εξυπηρέτηση οποιαδήποτε στιγμή τη χρειάζεστε.<br/><br/>

                                Νοικιάστε το αυτοκίνητο σας στο Αεροδρόμιο Θεσσαλονίκης / SKG
                                (με δωρεάν υπηρεσία μεταφοράς με shuttle bus προς το γραφείο, μόλις 1,8 χλμ. μακριά από
                                το Αεροδρόμιο)
                                ή με παράδοση στο ξενοδοχείο σας στη Θεσσαλονίκη (Ξενοδοχείο ή Airbnb).
                                Έχετε επίσης τη δυνατότητα να νοικιάσετε το αυτοκίνητό σας στη Χαλκιδική(Κασσάνδρα,
                                Σιθωνία).<br/><br/>

                                Όλα τα ενοικιαζόμενα αυτοκίνητα μας είναι πλήρως ασφαλισμένα - μικτή χωρίς απαλλαγή
                                (περιλαμβάνει ζημιά στα ελαστικά, το κάτω μέρος του αυτοκινήτου και την περιοχή
                                τζαμιού).
                                Δεν απαιτείται καμία μορφή εγγύησης όπως και δεν υφίσταται όριο στα χιλιόμετρα,
                                επίσης χωρίς έξτρα χρέωση έχετε τη δυνατότητα να προσθέσετε δεύτερο οδηγό για να είστε
                                βέβαιοι για την ασφάλεια σας.<br/><br/>

                                Κάντε κράτηση την κατηγορία που επιθυμείτε με μόνο 49,00 € προκαταβολή και τo υπόλοιπο
                                ποσό κατά την άφιξη σε μετρητά ή κάρτα (πιστωτική, χρεωστική).<br/><br/>

                                Επιπλέον, επιλέγοντας την εξτρά Υπηρεσία Premium (1,00€/ημέρα), έχετε πρόσβαση σε
                                πρόσθετες υπηρεσίες, όπως δωρεάν ακύρωση, αλλαγές και έκπτωση 10% στην επόμενη κράτησή
                                σας.<br/><br/>

                                Αν επιθυμείτε να έχετε μία ακόμα πιο ολοκληρωμένη εικόνα σχετικά με τις υπηρεσίες μας
                                ρίξτε μια ματιά στις Αξιολογήσεις μας ⭐️⭐️⭐️⭐️⭐️.<br/><br/>

                            </div>

                            <Footer style={{textAlign: 'center', backgroundColor: 'rgba(229,230,232,0.8)', width: '100%'}}>
                            Car Rental CRM ©{new Date().getFullYear()} Created by Stefanos Yfoulis
                            </Footer>
                        </div>



                    </Content>


                </Layout>
            </Layout>
    )
        ;
}

export default Dashboard;