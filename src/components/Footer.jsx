/**
 * @file Footer.jsx
 * @description Componente de rodapé global da aplicação.
 * Renderiza informações de direitos de autor e título da plataforma.
 */

import '../styles/AsideFooterHeader.css';
import { useTranslation } from "react-i18next";

/**
 * Componente funcional para renderização estática do rodapé.
 *
 * @component
 * @returns {JSX.Element} Rodapé com o ano e o nome do projeto traduzido.
 */
export default function Footer() {
    const { t } = useTranslation()

    return (
        <footer className="main-footer">
            <p>&copy; 2026 - {t('footer.title')}</p>
        </footer>
    );
}