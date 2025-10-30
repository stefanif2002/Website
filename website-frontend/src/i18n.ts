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
import enExtraPages from "./locales/en/extraPages.json";
import elExtraPages from "./locales/el-GR/extraPages.json";
import enReviews from "./locales/en/reviews.json";
import elReviews from "./locales/el-GR/reviews.json";
import enTerms from "./locales/en/terms.json";
import elTerms from "./locales/el-GR/terms.json";
import enPrivacy from "./locales/en/privacy.json";
import elPrivacy from "./locales/el-GR/privacy.json";
import enFaqThess from "./locales/en/faqThess.json";
import elFaqThess from "./locales/el-GR/faqThess.json";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                common: enCommon,
                main: enMain,
                fleetView: enFleetView,
                booking: enBooking,
                extraPages: enExtraPages,
                reviews: enReviews,
                terms: enTerms,
                privacy: enPrivacy,          // <-- add
                faqThess: enFaqThess,          // <-- add

            },
            "el-GR": {
                common: elCommon,
                main: elMain,
                fleetView: elFleetView,
                booking: elBooking,
                extraPages: elExtraPages,
                reviews: elReviews,
                terms: elTerms,
                privacy: elPrivacy,          // <-- add
                faqThess: elFaqThess,          // <-- add

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
