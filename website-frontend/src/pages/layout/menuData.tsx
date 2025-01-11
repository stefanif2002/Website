// menuData.ts or inline in the same file
import type { MenuProps } from 'antd';

export const mainMenuItems: MenuProps['items'] = [
    {
        key: 'rent',
        label: (
            <span
                style={{
                    color: '#ce0505',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    fontSize: '17px',
                }}
            >
            ❹rent
        </span>
        ),
        // Direct link => "href" approach depends on your routing setup:
        onClick: () => window.location.href = '/el/'
    },
    {
        key: 'booking',
        label: 'Κάντε κράτηση!',
        onClick: () => window.location.href = '/el/kratisi',
    },
    {
        key: 'fleet',
        label: 'Στόλος | Κατηγορίες',
        children: [
            {
                key: 'fleet-categories',
                label: 'Κατηγορίες | Στόλος',
                onClick: () => window.location.href = '/el/stolos/diathesimes-katigories-o-stolos-mas',
            },
            {
                key: 'small-category',
                label: 'Μικρή Κατηγορία',
                onClick: () => window.location.href = '/el/stolos/mikri-katigoria-enoikiaseis-autokiniton-thessaloniki',
            },
            {
                key: 'medium-category',
                label: 'Μεσαία κατηγορία',
                onClick: () => window.location.href = '/el/stolos/mesaia-katigoria-enoikiaseis-autokiniton-thessaloniki',
            },
            {
                key: 'large-category',
                label: 'Μεγάλη Κατηγορία',
                onClick: () => window.location.href = '/el/stolos/megali-katigoria-enoikiaseis-autokiniton-thessaloniki',
            },
            {
                key: 'family-category',
                label: 'Οικογενειακή κατηγορία',
                onClick: () => window.location.href = '/el/stolos/oikogeniaki-katigoria-enoikiaseis-autokiniton-thessaloniki',
            },
            {
                key: 'upper-category',
                label: 'Ανώτερη κατηγορία',
                onClick: () => window.location.href = '/el/stolos/anoteri-katigoria-enoikiaseis-autokiniton-thessaloniki',
            },
            {
                key: 'upper-caravan',
                label: 'Ανώτερη κατηγορία Καραβάν',
                onClick: () => window.location.href = '/el/stolos/karaban-katigoria-enoikiaseis-autokiniton-thessaloniki',
            },
            {
                key: 'suv',
                label: 'SUV / Jeep',
                onClick: () => window.location.href = '/el/stolos/suv-jeep-enoikiaseis-autokiniton-thessaloniki',
            },
            {
                key: 'minivan7',
                label: 'Μίνι Βαν 7 Θέσεων',
                onClick: () => window.location.href = '/el/stolos/minivan-7theseis-enoikiaseis-autokiniton-thessaloniki',
            },
            {
                key: 'minivan9',
                label: 'Μίνι Βαν 9 Θέσεων',
                onClick: () => window.location.href = '/el/stolos/minivan-9theseis-enoikiaseis-autokiniton-thessaloniki',
            },
            {
                key: 'automatic',
                label: 'Αυτόματο Kιβώτιο',
                onClick: () => window.location.href = '/el/stolos/automato-autokinito-enoikiaseis-thessaloniki',
            },
            {
                key: 'diesel',
                label: 'Πετρέλαιο (Diesel)',
                onClick: () => window.location.href = '/el/stolos/petrelaio-autokinito-enoikiaseis-thessaloniki',
            },
            {
                key: 'luxury',
                label: 'Κατηγορία πολυτελείας',
                onClick: () => window.location.href = '/el/stolos/enoikiasi-politeleias-autokinito-thessaloniki',
            },
        ]
    },
    {
        key: 'offer-2025',
        label: 'Προσφορά 2025!',
        onClick: () => window.location.href = '/el/prosfora-enoikiasi-autokinitou-thessaloniki',
    },
    {
        key: 'reviews',
        label: 'Κριτικές ★',
        onClick: () => window.location.href = '/el/enoikiasi-autokinitou-thessaloniki-kritikes',
    },
    {
        key: 'why-us',
        label: 'Γιατί εμας;',
        children: [
            {
                key: '4rent-vs',
                label: '4rent vs Ανταγωνιστής',
                onClick: () => window.location.href = '/el/enoikiaseis-autokiniton-thessaloniki/4rent-vs-antagonistis',
            },
            {
                key: 'premium-service',
                label: 'Υπηρεσία Premium',
                onClick: () => window.location.href = '/el/enoikiaseis-autokiniton-thessaloniki/ypiresia-premium',
            },
            {
                key: 'cheap-cars',
                label: 'Φθηνά ενοικιαζόμενα αυτοκίνητα',
                onClick: () => window.location.href = '/el/enoikiaseis-autokiniton-thessaloniki/fthina-enoikiazomena-aftokinita-thessaloniki',
            },
            {
                key: 'full-insurance',
                label: 'Μικτή ασφάλεια χωρίς εγγύηση',
                onClick: () => window.location.href = '/el/enoikiaseis-autokiniton-thessaloniki/mikti-asfaleia-xoris-eggyisis',
            },
            {
                key: 'faq',
                label: 'Συχνές Ερωτήσεις',
                onClick: () => window.location.href = '/el/enoikiaseis-autokiniton-thessaloniki/syxnes-erotiseis',
            },
            {
                key: 'chalkidiki',
                label: 'Ενοικίαση στην Χαλκιδική',
                onClick: () => window.location.href = '/el/enoikiaseis-autokiniton-thessaloniki/enoikiasi-aftokinitou-xalkidiki',
            },
        ]
    },
    {
        key: 'contact',
        label: 'Επικοινωνία',
        children: [
            {
                key: 'contact-us',
                label: 'Επικοινωνήστε μαζί μας',
                onClick: () => window.location.href = '/el/epokoinonia/epikoinoniste-mazi-mas',
            },
            {
                key: 'terms',
                label: 'Όροι',
                onClick: () => window.location.href = '/el/epokoinonia/oroi-kai-proipotheseis',
            },
            {
                key: 'privacy',
                label: 'Πολιτική προστασίας δεδομένων',
                onClick: () => window.location.href = '/el/epokoinonia/politiki-prostasias-dedomenon',
            },
            {
                key: 'video-call',
                label: 'Επικοινωνία μέσω Video call',
                onClick: () => window.location.href = '/el/epokoinonia/epikoinonia-meso-video-call',
            },
            {
                key: 'sitemap',
                label: 'Sitemap',
                onClick: () => window.location.href = '/el/epokoinonia/sitemap',
            },
            {
                key: 'partners',
                label: 'Συνεργάτες',
                // Sub-sub-menu
                children: [
                    {
                        key: 'be-partner',
                        label: 'Γίνε συνεργάτης!',
                        // Another sub-sub-sub-menu
                        children: [
                            {
                                key: 'hotel-airbnb',
                                label: 'Ξενοδοχείο ή Airbnb',
                                onClick: () => window.location.href = '/el/epokoinonia/synergates/gine-synergatis/ksenodoxeio-i-airbnb-enoikiasi-autokinitou-thessaloniki',
                            },
                            {
                                key: 'travel-agency',
                                label: 'Ταξιδιωτικό Γραφείο',
                                onClick: () => window.location.href = '/el/epokoinonia/synergates/gine-synergatis/taksidiotiko-grafeio-thessaloniki',
                            },
                        ],
                    },
                ],
            },
            {
                key: 'careers',
                label: 'Θέσεις Εργασίας 4rent Thessaloniki',
                onClick: () => window.location.href = '/el/epokoinonia/career-theseis-ergasias-rentacar-thessaloniki',
            },
        ]
    },
];
