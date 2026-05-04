/**
 * @file Aside.jsx
 * @description Componente da barra de navegação lateral (Sidebar) da aplicação.
 * Fornece hiperligações para as rotas principais (Dashboard, Leads, Clientes, Chat, Admin).
 */

import { Link } from 'react-router-dom';
import '../styles/AsideFooterHeader.css';
import { useTranslation } from 'react-i18next';

/**
 * Componente funcional que renderiza a barra de navegação principal.
 *
 * @component
 * @param {Object} props - Propriedades do componente.
 * @param {Function} props.fecharMenu - Função para fechar o menu lateral (usado predominantemente em vista mobile ao clicar num link).
 * @returns {JSX.Element} Menu de navegação lateral.
 */
export default function Aside({ fecharMenu }) {

    const { t } = useTranslation();

    return (
        <nav className="sidebar">
            <Link to="/dashboard" onClick={fecharMenu}>
                <button className="nav-btn"><i className="fa-solid fa-chart-pie"></i> {t('menu.dashboard')}</button>
            </Link>

            <Link to="/leads" onClick={fecharMenu}>
                <button className="nav-btn"><i className="fa-solid fa-bullseye"></i> {t('menu.leads')}</button>
            </Link>

            <Link to="/client" onClick={fecharMenu}>
                <button className="nav-btn"><i className="fa-solid fa-users"></i> {t('menu.clients')}</button>
            </Link>

            <Link to="/chat" onClick={fecharMenu}>
                <button className="nav-btn"><i className="fa-solid fa-comment"></i> {t('menu.chat')}</button>
            </Link>

            <Link to="/admin" onClick={fecharMenu}>
                <button className="nav-btn"><i className="fa-solid fa-gear"></i> {t('menu.admin')}</button>
            </Link>
        </nav>
    );
}