import {Button} from "antd";
import React from "react";


function MainPage() {
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
                    fontSize: '5rem', // Adjust size as needed
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

                Νοικιάστε το αυτοκίνητο σας στο <b>Αεροδρόμιο Θεσσαλονίκης / SKG</b>
                (με δωρεάν υπηρεσία μεταφοράς με shuttle bus προς το γραφείο, μόλις 1,8 χλμ. μακριά από
                το Αεροδρόμιο)
                ή με παράδοση στο ξενοδοχείο σας στη Θεσσαλονίκη (<b>Ξενοδοχείο ή Airbnb</b>).
                Έχετε επίσης τη δυνατότητα να <b>νοικιάσετε το αυτοκίνητό</b> σας στη <b>Χαλκιδική</b>(Κασσάνδρα,
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

            </div>
        </>
    );
}

export default MainPage;