import {Button, Carousel, Col, Image, Row, Space} from "antd";
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faStar} from "@fortawesome/free-solid-svg-icons";
import {width} from "../../resources/service.ts";
import {useLangRouter} from "../../resources/useLangRouter.ts";



function MainPage() {
    const contentStyle: React.CSSProperties = {
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };
    const style: React.CSSProperties = { background: '#0092ff', padding: '8px 0' };

    const { to, go } = useLangRouter(); // <<-- lang-aware helpers


    const handleOnClick = () => {
        go("/search"); // navigates to "/el/search" (or current lang)
    };

    return (
        <>
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
            />
            <h1
                style={{
                    color: '#ce0505',
                    fontSize: `${width<3.2 ? 5 : 2}rem`, // Adjust size as needed
                    textAlign: 'center', // Center align the text
                    opacity: 0.7,
                    marginBottom: '0.5rem',

                }}
            >
                4RENT ΕΝΟΙΚΙΑΣΕΙΣ<br/>
                ΑΥΤΟΚΙΝΗΤΩΝ<br/>
                ΘΕΣΣΑΛΟΝΙΚΗ
            </h1>
            <h2
                style={{
                    color: '#ce0505',
                    textAlign: 'center', // Center align the text
                    opacity: 0.7,
                    fontWeight: 'normal',
                    display: "flex",
                    maxWidth: '80%',
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
                onClick={() => handleOnClick()}
            >
                ΚΑΝΤΕ ΚΡΑΤΗΣΗ ΤΩΡΑ
            </Button>
            <div style={{width: '60%', textAlign: 'start', lineHeight: '1.6', marginTop: '60px', fontSize: '1rem'}}>
                <h2 style={{fontSize: '2rem'}}>Ενοικιάσεις Αυτοκινήτων Θεσσαλονίκη Αεροδρόμιο</h2>

                Καλώς ήρθατε στη <b>4rent!</b><br/>

                Η <b>εταιρία με χώρα δραστηριοποίησης την Ελλάδα και βάση τη Θεσσαλονίκη</b> η οποία ασχολείται
                με τις ενοικιάσεις αυτοκινήτων σας προσφέρει οχήματα διαφόρων <a
                style={{color: '#ce0505', fontWeight: 'bold',}}
                href="/el/stolos/diathesimes-katigories-o-stolos-mas">Κατηγοριών </a>
                (στόλος
                αυτοκινήτων), σε προνομιακές τιμές, ώστε να μπορείτε να επιλέξετε εκείνη που ικανοποιεί
                πλήρως τις ανάγκες σας.
                Επίσης, σας παρέχουμε προσωπική εξυπηρέτηση οποιαδήποτε στιγμή τη χρειάζεστε.<br/><br/>

                Νοικιάστε το αυτοκίνητο σας στο <b>Αεροδρόμιο Θεσσαλονίκης / SKG </b>
                (με δωρεάν υπηρεσία μεταφοράς με shuttle bus προς το γραφείο, μόλις 1,8 χλμ. μακριά από
                το Αεροδρόμιο)
                ή με παράδοση στο ξενοδοχείο σας στη Θεσσαλονίκη (<b>Ξενοδοχείο ή Airbnb</b>).
                Έχετε επίσης τη δυνατότητα να <b>νοικιάσετε το αυτοκίνητό</b> σας στη <b>Χαλκιδική </b>(Κασσάνδρα,
                Σιθωνία).<br/><br/>

                Όλα τα <b>ενοικιαζόμενα αυτοκίνητα</b> μας είναι <a style={{color: '#ce0505', fontWeight: 'bold',}}
                                                                    href="/el/enoikiaseis-autokiniton-thessaloniki/mikti-asfaleia-xoris-eggyisis">πλήρως
                ασφαλισμένα - μικτή χωρίς απαλλαγή </a>
                (περιλαμβάνει ζημιά στα ελαστικά, το κάτω μέρος του αυτοκινήτου και την περιοχή
                τζαμιού).
                Δεν απαιτείται καμία μορφή εγγύησης όπως και δεν υφίσταται όριο στα χιλιόμετρα,
                επίσης χωρίς έξτρα χρέωση έχετε τη δυνατότητα να προσθέσετε δεύτερο οδηγό για να είστε
                βέβαιοι για την ασφάλεια σας.<br/><br/>

                Κάντε κράτηση την κατηγορία που επιθυμείτε με μόνο <b>49,00 € προκαταβολή</b> και τo υπόλοιπο
                ποσό κατά την άφιξη σε μετρητά ή κάρτα (πιστωτική, χρεωστική).<br/><br/>

                Επιπλέον, επιλέγοντας την εξτρά <a
                style={{color: '#ce0505', fontWeight: 'bold',}}
                href="/el/enoikiaseis-autokiniton-thessaloniki/ypiresia-premium">Υπηρεσία Premium </a>
                (<b>1,00€/ημέρα</b>), έχετε πρόσβαση σε
                πρόσθετες υπηρεσίες, όπως δωρεάν ακύρωση, αλλαγές και έκπτωση 10% στην επόμενη κράτησή
                σας.<br/><br/>

                Αν επιθυμείτε να έχετε μία ακόμα πιο ολοκληρωμένη εικόνα σχετικά με τις υπηρεσίες μας
                ρίξτε μια ματιά στις <a
                style={{color: '#ce0505', fontWeight: 'bold',}}
                href="/el/enoikiasi-autokinitou-thessaloniki-kritikes">Αξιολογήσεις </a> μας
                ⭐️⭐️⭐️⭐️⭐️.<br/><br/>

                <h2 style={{fontSize: '2rem', color: '#ce0505', textAlign: 'center'}}>Ο ΕΞΥΠΝΟΣ ΤΡΟΠΟΣ ΓΙΑ ΤΗΝ ΕΝΟΙΚΙΑΣΗ
                    ΤΟΥ ΑΥΤΟΚΙΝΗΤΟΥ ΣΑΣ</h2><br/>

                <h4>Ο ΣΤΟΛΟΣ ΤΗΣ 4RENT ΘΕΣΣΑΛΟΝΙΚΗ</h4>

                Η 4rent Thessaloniki προσφέρει ένα ευρύ φάσμα ενοικιαζόμενων αυτοκινήτων προσαρμοσμένων στις ανάγκες
                σας, σε όλες τις κατηγορίες...και το καλύτερο από όλα;
                Ο στόλος μας είναι ένας από τους πιο μοντέρνους στην αγορά !!

                Δείτε <a
                style={{color: '#ce0505', fontWeight: 'bold',}}
                href="el/stolos/diathesimes-katigories-o-stolos-mas">εδώ </a> όλο τον Στολο μας.

            </div>

            <div
                style={{
                    width: '80%', // Constrain the Carousel to full width
                    maxWidth: '500px', // Optional: limit max width for large screens
                    marginTop: '30px'
                }}
            >
                <Carousel autoplay speed='1000' style={{height: '300px'}}>
                    <div
                        style={contentStyle}
                    >
                        <Image

                            src={`https://4rent-thessaloniki.com/images/fleet/aygox.png`}
                            style={{width: '100%', height: 'auto'}} // Ensures responsiveness
                        />
                    </div>
                    <div
                        style={contentStyle}
                    >
                        <Image

                            src={`https://4rent-thessaloniki.com/images/fleet/ibiza.png`}
                            style={{width: '100%', height: 'auto'}} // Ensures responsiveness

                        />
                    </div>
                    <div
                        style={contentStyle}
                    >
                        <Image

                            src={`https://4rent-thessaloniki.com/images/fleet/golf.png`}
                            style={{width: '100%', height: 'auto'}} // Ensures responsiveness

                        />
                    </div>
                    <div
                        style={contentStyle}
                    >
                        <Image

                            src={`https://4rent-thessaloniki.com/images/fleet/arona-site-2.png`}
                            style={{width: '100%', height: 'auto'}} // Ensures responsiveness

                        />
                    </div>
                    <div
                        style={contentStyle}
                    >
                        <Image

                            src={`https://4rent-thessaloniki.com/images/fleet/corolla.png`}
                            style={{width: '100%', height: 'auto'}} // Ensures responsiveness

                        />
                    </div>
                    <div
                        style={contentStyle}
                    >
                        <Image

                            src={`https://4rent-thessaloniki.com/images/fleet/chr.png`}
                            style={{width: '100%', height: 'auto'}} // Ensures responsiveness

                        />
                    </div>
                    <div
                        style={contentStyle}
                    >
                        <Image

                            src={`https://4rent-thessaloniki.com/images/fleet/jogger.png`}
                            style={{width: '100%', height: 'auto'}} // Ensures responsiveness

                        />
                    </div>
                    <div
                        style={contentStyle}
                    >
                        <Image

                            src={`https://4rent-thessaloniki.com/images/fleet/caddy.png`}
                            style={{width: '100%', height: 'auto'}} // Ensures responsiveness

                        />
                    </div>
                </Carousel>

            </div>

            <Button
                style={{
                    backgroundColor: '#0b9f9a',
                    color: '#fff',
                    padding: '20px 20px',
                    fontSize: '1.2rem',
                    border: 'none',
                    cursor: 'pointer',
                    margin: '40px 0', // Add spacing between the subtitle and the button
                }}
            >
                ΕΠΙΛΕΞΤΕ ΚΑΤΗΓΟΡΙΑ
            </Button>

            <Row gutter={[16, 24]} style={{width: '60%', marginBottom: '40px'}}>
                <Col className="gutter-row" span={12}>
                    <Space style={{alignItems: 'start'}}>
                        <Image
                            src={`https://4rent-thessaloniki.com/images/Deals/premium-paket2.jpg`}
                            style={{maxWidth: '250px', width: '100%', height: 'auto'}} // Ensures responsiveness
                            preview={false}
                        />
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start', // Aligns items to the left (or adjust as needed)
                            gap: '10px', // Adds horizontal spacing between elements
                        }}>
                            <a style={{color: '#ce0505', textAlign: 'start', fontSize: '1rem'}}>Premium πακέτο μόνο με 1,00 € ανά ημέρα </a>
                            <Button style={{
                                backgroundColor: '#ce0505',
                                color: '#fff',
                                fontSize: '1.2rem',
                                border: 'none',
                                cursor: 'pointer',
                            }}><FontAwesomeIcon icon={faCheck} /> PREMIUM!</Button>
                        </div>
                    </Space>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Space style={{alignItems: 'start'}}>
                        <Image
                            src={`https://4rent-thessaloniki.com/images/Logos/car-crash.png`}
                            style={{maxWidth: '250px', width: '100%', height: 'auto'}} // Ensures responsiveness
                            preview={false}
                        />
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start', // Aligns items to the left (or adjust as needed)
                            gap: '10px', // Adds horizontal spacing between elements
                        }}>
                            <a style={{color: '#ce0505', textAlign: 'start', fontSize: '1rem'}}>Μικτή ασφάλεια - χωρίς εγγύηση </a>
                            <Button style={{
                                backgroundColor: '#ce0505',
                                color: '#fff',
                                fontSize: '1.2rem',
                                border: 'none',
                                cursor: 'pointer',
                            }}><FontAwesomeIcon icon={faStar}/> ΠΑΡΑΔΕΙΓΜΑ</Button>
                        </div>
                    </Space>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Space style={{alignItems: 'start'}}>
                        <Image
                            src={`https://4rent-thessaloniki.com/images/Logos/5-Sterne.png`}
                            style={{maxWidth: '250px', width: '100%', height: 'auto'}} // Ensures responsiveness
                            preview={false}
                        />
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start', // Aligns items to the left (or adjust as needed)
                            gap: '10px', // Adds horizontal spacing between elements
                        }}>
                            <a style={{color: '#ce0505', textAlign: 'start', fontSize: '1rem'}}>Κάθε πελάτης είναι μοναδικός για εμάς!</a>
                            <Button style={{
                                backgroundColor: '#ce0505',
                                color: '#fff',
                                fontSize: '1.2rem',
                                border: 'none',
                                cursor: 'pointer',
                            }}><FontAwesomeIcon icon={faStar} /> ΚΡΙΤΙΚΕΣ</Button>
                        </div>
                    </Space>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Space style={{alignItems: 'start'}}>
                        <Image
                            src={`https://4rent-thessaloniki.com/images/prosfores2024-.png`}
                            style={{maxHeight: '150px', maxWidth: '250px', width: '100%', height: 'auto'}} // Ensures responsiveness
                            preview={false}
                        />
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start', // Aligns items to the left (or adjust as needed)
                            gap: '10px', // Adds horizontal spacing between elements
                        }}>
                            <a style={{color: '#ce0505', textAlign: 'start', fontSize: '1rem'}}>Εξοικονομήστε χρήματα στην ενοικίαση αυτοκινήτου σας, στην Θεσσαλονίκη </a>
                            <Button style={{
                                backgroundColor: '#ce0505',
                                color: '#fff',
                                fontSize: '1.2rem',
                                border: 'none',
                                cursor: 'pointer',
                            }}><FontAwesomeIcon icon={faCheck} /> ΠΡΟΣΦΟΡΕΣ 2025</Button>
                        </div>
                    </Space>
                </Col>
            </Row>
        </>
    );
}

export default MainPage;