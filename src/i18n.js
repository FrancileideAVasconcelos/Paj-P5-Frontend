import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 1. Os nossos "Dicionários"
const resources = {
    pt: {
        translation: {
            "header": {
                "welcome": "Bem-vindo",
                "profile": "Meu Perfil",
                "logout": "Sair"
            },
            "menu": {
                "dashboard": "Painel",
                "leads": "Oportunidades",
                "clients": "Clientes",
                "chat": "Mensagens",
                "admin": "Administração"
            },
            "dashboard": {
                "title": "Painel de Resumo",
                "total_leads": "Total de leads",
                "total_clients": "Total de clientes"
            }
        }
    },
    en: {
        translation: {
            "header": {
                "welcome": "Welcome",
                "profile": "My Profile",
                "logout": "Logout"
            },
            "menu": {
                "dashboard": "Dashboard",
                "leads": "Leads",
                "clients": "Clients",
                "chat": "Chat",
                "admin": "Administration"
            },
            "dashboard": {
                "title": "Summary Panel",
                "total_leads": "Total leads",
                "total_clients": "Total clients"
            }
        }
    }
};

// 2. Inicialização
i18n
    .use(initReactI18next) // Passa a instância do i18n para o react-i18next
    .init({
        resources,
        lng: "pt", // Idioma inicial por defeito
        fallbackLng: "en", // Se faltar alguma palavra em PT, ele mostra em EN
        interpolation: {
            escapeValue: false // O React já é seguro contra XSS, não precisamos disto
        }
    });

export default i18n;