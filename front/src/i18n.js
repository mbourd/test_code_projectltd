import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { en/*, ...*/ } from './locales';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // resources: {
    //   en: {
    //     translation: {
    //       "table": {
    //         "exemple": "hi"
    //       }
    //     }
    //   }
    // },
    resources: { en/*, ...*/ },
    fallbackLng: ['en'/*, ...*/],
    interpolation: { escapeValue: false },
    detection: { order: ['path', 'navigator'] }
  });

export default i18n;