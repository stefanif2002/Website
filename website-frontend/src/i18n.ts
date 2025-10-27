import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import elCommon from "./locales/el-GR/common.json";
import enMain from "./locales/en/main.json";
import elMain from "./locales/el-GR/main.json";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { common: enCommon, main: enMain },
            "el-GR": { common: elCommon, main: elMain }
        },
        lng: "el-GR",
        fallbackLng: "en",
        ns: ["common", "main"],
        defaultNS: "common",
        interpolation: { escapeValue: false },
        react: { useSuspense: false }
    });

export default i18n;
