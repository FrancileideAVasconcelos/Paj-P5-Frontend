import '../styles/AsideFooterHeader.css';
import {useTranslation} from "react-i18next";

export default function Footer() {
    const {t, i18n} = useTranslation()

    return (
        <footer className="main-footer">
            <p>&copy; 2026 - {t('footer.title')}</p>
        </footer>
    );
}