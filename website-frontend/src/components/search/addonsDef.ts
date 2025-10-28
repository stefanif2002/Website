import type { AddonDef } from "./types";
import { useTranslation } from "react-i18next";

/**
 * Returns ADDONS translated according to current language.
 * Keeps same structure (value, title, description, price, qty).
 */
export function useAddons(): AddonDef[] {
    const { t } = useTranslation("booking");

    return [
        {
            value: "GPS",
            title: t("addons.items.GPS.title", "Σύστημα πλοήγησης (GPS)"),
            description: t("addons.items.GPS.desc", "Εύκολος προσανατολισμός και αποφυγή κίνησης."),
            price: 23.99,
        },
        {
            value: "CHAINS_FOR_SNOW",
            title: t("addons.items.CHAINS_FOR_SNOW.title", "Αλυσίδες χιονιού"),
            description: t("addons.items.CHAINS_FOR_SNOW.desc", "Για δύσκολες καιρικές συνθήκες."),
            price: 44.97,
        },
        {
            value: "BS1",
            title: t("addons.items.BS1.title", "Κάθισμα μωρού (3–14 kg)"),
            description: t("addons.items.BS1.desc", "Έξτρα προστασία για μωρά."),
            price: 19.49,
            qty: true,
        },
        {
            value: "BS2",
            title: t("addons.items.BS2.title", "Παιδικό ενισχυτικό κάθισμα (14kg+)"),
            description: t("addons.items.BS2.desc", "Άνεση και ασφάλεια για μεγαλύτερα παιδιά."),
            price: 19.49,
            qty: true,
        },
    ];
}
