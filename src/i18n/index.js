/**
 * @file index.js
 * @description Configuração principal da internacionalização (i18n) da aplicação React.
 * Inicializa o i18next com os idiomas suportados (Português e Inglês) e define o idioma de fallback.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from './pt.js';
import en from './en.js';

const resources = { pt, en };

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "pt",           // Idioma inicial por defeito
        fallbackLng: "en",   // Se faltar alguma palavra em PT, ele mostra em EN
        interpolation: {
            escapeValue: false // O React já previne XSS por defeito
        }
    });

export default i18n;