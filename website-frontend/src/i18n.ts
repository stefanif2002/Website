import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languageDetector'
import LocizeBackend from 'i18next-locize-backend'

const isDev = import.meta.env.DEV

i18n
    .use(LocizeBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: isDev,
        fallbackLng: 'en',
        supportedLngs: ['en', 'el-GR'],
        load: 'currentOnly',              // don’t also load bare "el"
        ns: ['translation'],
        defaultNS: 'translation',
        keySeparator: false,              // you use flat keys
        interpolation: { escapeValue: false },

        backend: {
            projectId: import.meta.env.VITE_LOCIZE_PROJECTID,
            apiKey: isDev ? import.meta.env.VITE_LOCIZE_APIKEY : undefined, // never in prod
            version: import.meta.env.VITE_LOCIZE_VERSION || 'latest',       // must be editable
            referenceLng: 'en',
        },

        saveMissing: isDev,               // create keys (dev only)
        updateMissing: false,             // don’t overwrite existing translations
        saveMissingTo: 'current',         // write only to the current (reference) language
    })

export default i18n
