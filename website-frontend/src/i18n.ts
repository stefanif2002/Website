import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import elCommon from "./locales/el-GR/common.json";
import enMain from "./locales/en/main.json";
import elMain from "./locales/el-GR/main.json";
import enFleetView from "./locales/en/fleetView.json";
import elFleetView from "./locales/el-GR/fleetView.json";
import enBooking from "./locales/en/booking.json";
import elBooking from "./locales/el-GR/booking.json";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                common: enCommon,
                main: enMain,
                fleetView: enFleetView,
                booking: enBooking,
            },
            "el-GR": {
                common: elCommon,
                main: elMain,
                fleetView: elFleetView,
                booking: elBooking,
            },
        },
        lng: "el-GR",
        fallbackLng: "en",
        ns: ["common", "main"],
        defaultNS: "common",
        interpolation: { escapeValue: false },
        react: { useSuspense: false }
    });

export default i18n;
