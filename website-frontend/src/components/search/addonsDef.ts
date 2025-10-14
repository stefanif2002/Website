import type { AddonDef } from "./types";

export const ADDONS: AddonDef[] = [
    { value: "GPS",                  title: "Σύστημα πλοήγησης (GPS)",             description: "Εύκολος προσανατολισμός και αποφυγή κίνησης.", price: 23.99 },
    { value: "CHAINS_FOR_SNOW",     title: "Αλυσίδες χιονιού",                     description: "Για δύσκολες καιρικές συνθήκες.",               price: 44.97 },
    { value: "BS1",                  title: "Κάθισμα μωρού (3–14 kg)",              description: "Έξτρα προστασία για μωρά.",                     price: 19.49, qty: true },
    { value: "BS2",                  title: "Παιδικό ενισχυτικό κάθισμα (14kg+)",   description: "Άνεση και ασφάλεια για μεγαλύτερα παιδιά.",     price: 19.49, qty: true },
];
