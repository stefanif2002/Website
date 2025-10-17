import React from "react";

/** App-level navigation type (simple, stable) */
export type NavItem = {
    key: string;
    label: React.ReactNode;      // string | JSX is fine
    href?: string;               // language-agnostic path (no /en or /el-GR)
    children?: NavItem[];
};

export const mainMenuItems: NavItem[] = [
    {
        key: "rent",
        label: (
            <span
                style={{
                    color: "#ce0505",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    fontSize: "17px",
                }}
            >
        ❹rent
      </span>
        ),
        href: "/",
    },
    { key: "booking", label: "Κάντε κράτηση!", href: "/search" },
    {
        key: "fleet",
        label: "Στόλος | Κατηγορίες",
        children: [
            { key: "fleet-categories", label: "Κατηγορίες | Στόλος", href: "/stolos/diathesimes-katigories-o-stolos-mas" },
            { key: "small-category",   label: "Μικρή Κατηγορία",      href: "/stolos/mikri-katigoria-enoikiaseis-autokiniton-thessaloniki" },
            { key: "medium-category",  label: "Μεσαία κατηγορία",     href: "/stolos/mesaia-katigoria-enoikiaseis-autokiniton-thessaloniki" },
            { key: "large-category",   label: "Μεγάλη Κατηγορία",     href: "/stolos/megali-katigoria-enoikiaseis-autokiniton-thessaloniki" },
            { key: "family-category",  label: "Οικογενειακή κατηγορία", href: "/stolos/oikogeniaki-katigoria-enoikiaseis-autokiniton-thessaloniki" },
            { key: "upper-category",   label: "Ανώτερη κατηγορία",    href: "/stolos/anoteri-katigoria-enoikiaseis-autokiniton-thessaloniki" },
            { key: "upper-caravan",    label: "Ανώτερη κατηγορία Καραβάν", href: "/stolos/karaban-katigoria-enoikiaseis-autokiniton-thessaloniki" },
            { key: "suv",              label: "SUV / Jeep",           href: "/stolos/suv-jeep-enoikiaseis-autokiniton-thessaloniki" },
            { key: "minivan7",         label: "Μίνι Βαν 7 Θέσεων",    href: "/stolos/minivan-7theseis-enoikiaseis-autokiniton-thessaloniki" },
            { key: "minivan9",         label: "Μίνι Βαν 9 Θέσεων",    href: "/stolos/minivan-9theseis-enoikiaseis-autokiniton-thessaloniki" },
            { key: "automatic",        label: "Αυτόματο Kιβώτιο",     href: "/stolos/automato-autokinito-enoikiaseis-thessaloniki" },
            { key: "diesel",           label: "Πετρέλαιο (Diesel)",   href: "/stolos/petrelaio-autokinito-enoikiaseis-thessaloniki" },
            { key: "luxury",           label: "Κατηγορία πολυτελείας", href: "/stolos/enoikiasi-politeleias-autokinito-thessaloniki" },
        ],
    },
    { key: "offer-2026", label: "Προσφορά 2026!", href: "/prosfora-enoikiasi-autokinitou-thessaloniki" },
    { key: "reviews",    label: "Κριτικές ★",     href: "/enoikiasi-autokinitou-thessaloniki-kritikes" },
    {
        key: "why-us",
        label: "Γιατί εμας;",
        children: [
            { key: "4rent-vs",        label: "4rent vs Ανταγωνιστής", href: "/enoikiaseis-autokiniton-thessaloniki/4rent-vs-antagonistis" },
            { key: "premium-service", label: "Υπηρεσία Premium",      href: "/enoikiaseis-autokiniton-thessaloniki/ypiresia-premium" },
            { key: "cheap-cars",      label: "Φθηνά ενοικιαζόμενα αυτοκίνητα", href: "/enoikiaseis-autokiniton-thessaloniki/fthina-enoikiazomena-aftokinita-thessaloniki" },
            { key: "full-insurance",  label: "Μικτή ασφάλεια χωρίς εγγύηση",   href: "/enoikiaseis-autokiniton-thessaloniki/mikti-asfaleia-xoris-eggyisis" },
            { key: "faq",             label: "Συχνές Ερωτήσεις",       href: "/enoikiaseis-autokiniton-thessaloniki/syxnes-erotiseis" },
            { key: "chalkidiki",      label: "Ενοικίαση στην Χαλκιδική", href: "/enoikiaseis-autokiniton-thessaloniki/enoikiasi-aftokinitou-xalkidiki" },
        ],
    },
    {
        key: "contact",
        label: "Επικοινωνία",
        children: [
            { key: "contact-us",  label: "Επικοινωνήστε μαζί μας", href: "/epikoinonia/epikoinoniste-mazi-mas" },
            { key: "terms",       label: "Όροι",                   href: "/epikoinonia/oroi-kai-proipotheseis" },
            { key: "privacy",     label: "Πολιτική προστασίας δεδομένων", href: "/epikoinonia/politiki-prostasias-dedomenon" },
            { key: "video-call",  label: "Επικοινωνία μέσω Video call",   href: "/epikoinonia/epikoinonia-meso-video-call" },
            { key: "sitemap",     label: "Sitemap",                      href: "/epikoinonia/sitemap" },
            {
                key: "partners",
                label: "Συνεργάτες",
                children: [
                    {
                        key: "be-partner",
                        label: "Γίνε συνεργάτης!",
                        children: [
                            {
                                key: "hotel-airbnb",
                                label: "Ξενοδοχείο ή Airbnb",
                                href: "/epokoinonia/synergates/gine-synergatis/ksenodoxeio-i-airbnb-enoikiasi-autokinitou-thessaloniki",
                            },
                            {
                                key: "travel-agency",
                                label: "Ταξιδιωτικό Γραφείο",
                                href: "/epokoinonia/synergates/gine-synergatis/taksidiotiko-grafeio-thessaloniki",
                            },
                        ],
                    },
                ],
            },
            {
                key: "careers",
                label: "Θέσεις Εργασίας 4rent Thessaloniki",
                href: "/epokoinonia/career-theseis-ergasias-rentacar-thessaloniki",
            },
        ],
    },
];
