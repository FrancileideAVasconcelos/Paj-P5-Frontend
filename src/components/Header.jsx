/**
 * @file Header.jsx
 * @description Componente de cabeçalho global da aplicação.
 * Responsável por exibir a identidade da marca, saudar o utilizador autenticado
 * e fornecer atalhos para o perfil e logout.
 */

import {useEffect, useRef, useState} from "react";
import '../styles/AsideFooterHeader.css'
import tokenStore from "../store/tokenStore.js";
import useUserStore from '../store/useUserStore.js';
import {useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { NotificationService } from '../services/api';

/**
 * Componente funcional que renderiza a barra superior da interface.
 * @component
 * @param {Object} props - Propriedades do componente.
 * @param {Function} props.toggleMenu - Função para alternar a visibilidade do menu lateral (útil em dispositivos móveis).
 * @returns {JSX.Element} Estrutura do cabeçalho com logótipo e ações do utilizador.
 */
export default function Header({ toggleMenu }) {
    const navigate = useNavigate();

    // --- NOVO: Puxar traduções ---
    const { t, i18n } = useTranslation();

    // --- NOVO: Gestão do Dropdown de Idiomas ---
    const [isLangOpen, setIsLangOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Fecha o menu se clicar em qualquer lugar fora dele
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Muda o idioma e fecha o dropdown
    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        setIsLangOpen(false);
    };

    // Dicionário visual para apresentar bonitinho
    const languageNames = {
        'pt': 'Português',
        'en': 'English'
    };

    // --- ZUSTAND E TOKENS ---
    const currentUser = useUserStore((state) => state.currentUser);
    const fetchCurrentUser = useUserStore((state) => state.fetchCurrentUser); // <-- ADICIONA ESTA LINHA
    const unreadCount = useUserStore((state) => state.unreadCount);
    const setUnreadCount = useUserStore((state) => state.setUnreadCount);
    const token = tokenStore((state) => state.token);
    const wsNotif = useRef(null);

    // --- GARANTIR QUE O UTILIZADOR ESTÁ CARREGADO ---
    useEffect(() => {
        if (token && !currentUser) {
            fetchCurrentUser();
        }
    }, [token, currentUser, fetchCurrentUser]);

    // --- LIGAÇÃO GLOBAL DE NOTIFICAÇÕES ---
    useEffect(() => {
        if (!token) return;

        let pingInterval;
        // Variável local — nunca muda dentro deste closure
        const ws = new WebSocket(NotificationService.getWebSocketUrl(token));
        wsNotif.current = ws;

        ws.onopen = () => {
            console.log("🔔 Header Conectado ao Serviço de Notificações!");
            pingInterval = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send("PING");
                }
            }, 60000);
        };

        ws.onmessage = (event) => {
            const dados = JSON.parse(event.data);
            if (dados.type === 'UNREAD_COUNT') {
                setUnreadCount(dados.count);
            }
        };

        return () => {
            clearInterval(pingInterval);
            // Usa a variável local `ws`, não o ref que pode já ter mudado
            if (ws.readyState === WebSocket.CONNECTING) {
                ws.onopen = () => ws.close(1000, 'Cleanup');
            } else if (ws.readyState === WebSocket.OPEN) {
                ws.close(1000, 'Cleanup');
            }
        };
    }, [token, setUnreadCount]);

    return (
        <header className="main-header">
            <div className="header-left">
                {/* Botão de controlo do menu lateral para resoluções móveis */}
                <button className="menu-toggle" onClick={toggleMenu}>
                    <i className="fa-solid fa-bars"></i>
                </button>
                <div className="logo">CRM</div>
            </div>

            {/* Secção de ações do utilizador, visível apenas se autenticado */}
            <div className="header-actions">

                {/* --- GRUPO 1: INFORMAÇÕES (Fica à esquerda no PC, e em baixo no Mobile) --- */}
                <div className="header-info">
                    {/* ÍCONE DO SINO COM NOTIFICAÇÕES */}
                    {token && (
                        <div
                            onClick={() => navigate('/chat')}
                            style={{ position: 'relative', cursor: 'pointer', color: 'white' }}
                            title="Ir para o Chat"
                        >
                            <i className="fa-solid fa-bell" style={{ fontSize: '20px' }}></i>

                            {unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: '-8px', right: '-12px', background: '#e74c3c',
                                    color: 'white', borderRadius: '50%', minWidth: '18px', height: '18px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '11px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}>
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </div>
                    )}

                    {/* TEXTO DE BEM-VINDO */}
                    {token && <p className="header-welcome-text">{t('header.welcome')}, {currentUser ? currentUser.primeiroNome : '...'}</p>}
                </div>

                {/* --- GRUPO 2: BOTÕES (Fica à direita no PC, e em cima no Mobile) --- */}
                <div className="header-buttons">
                    {token && <div className="logout-btn" onClick={() => navigate('/profile')}>{t('header.profile')}</div>}
                    {token && <div className="logout-btn" onClick={() => tokenStore.getState().logout()}>{t('header.logout')}</div>}

                    {/* SELETOR DE IDIOMA (DROPDOWN) */}
                    {token && (
                        <div className="language-selector" ref={dropdownRef}>
                            <button
                                className="lang-btn-current"
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                title={t('header.change_language')}
                            >
                                <i className="fa-solid fa-globe"></i>
                                {i18n.language.toUpperCase()}
                                <i className={`fa-solid fa-chevron-${isLangOpen ? 'up' : 'down'}`} style={{ fontSize: '10px', marginLeft: '5px' }}></i>
                            </button>

                            <div className={`lang-dropdown-menu ${isLangOpen ? 'open' : ''}`}>
                                <button className={`lang-option ${i18n.language === 'pt' ? 'active' : ''}`} onClick={() => changeLanguage('pt')}>
                                    🇵🇹 Português
                                </button>
                                <button className={`lang-option ${i18n.language === 'en' ? 'active' : ''}`} onClick={() => changeLanguage('en')}>
                                    🇬🇧 English
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}