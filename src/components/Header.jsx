/**
 * @file Header.jsx
 * @description Componente de cabeçalho global da aplicação.
 * Responsável por exibir a identidade da marca, saudar o utilizador autenticado
 * e fornecer atalhos para o perfil e logout.
 */

import {useEffect, useRef} from "react";
import '../styles/AsideFooterHeader.css'
import tokenStore from "../store/tokenStore.js";
import useUserStore from '../store/useUserStore.js';
import {useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';

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

    // Função para trocar o idioma
    const toggleLanguage = () => {
        const nextLang = i18n.language === 'pt' ? 'en' : 'pt';
        i18n.changeLanguage(nextLang);
    };

    // --- ZUSTAND E TOKENS ---
    const currentUser = useUserStore((state) => state.currentUser);
    const unreadCount = useUserStore((state) => state.unreadCount);
    const setUnreadCount = useUserStore((state) => state.setUnreadCount);
    const token = tokenStore((state) => state.token);
    const wsNotif = useRef(null);

    // --- LIGAÇÃO GLOBAL DE NOTIFICAÇÕES ---
    useEffect(() => {
        if (!token) return;

        let pingInterval;
        // Variável local — nunca muda dentro deste closure
        const ws = new WebSocket(`ws://localhost:8080/projeto5/ws/notifications/${token}`);
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

                {/* Usa a tradução para o Bem-Vindo */}
                {token && <p style={{ color: 'white', marginRight: '15px' }}>{t('header.welcome')}, {currentUser ? currentUser.primeiroNome : '...'}</p>}

                {/* --- ÍCONE DO SINO COM NOTIFICAÇÕES --- */}
                {token && <div
                    onClick={() => navigate('/chat')}
                    style={{ position: 'relative', cursor: 'pointer', color: 'white', marginRight: '10px' }}
                    title="Ir para o Chat"
                >
                    <i className="fa-solid fa-bell" style={{ fontSize: '22px' }}></i>

                    {unreadCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-12px',
                            background: '#e74c3c',
                            color: 'white',
                            borderRadius: '50%',
                            minWidth: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </div>}
                {/* -------------------------------------- */}


                {token && <div className="logout-btn" onClick={() => navigate('/profile')}>{t('header.profile')}</div>}
                {token && <div className="logout-btn" onClick={() => tokenStore.getState().logout()}>{t('header.logout')}</div>}

                {/* --- BOTÃO DE MUDAR IDIOMA --- */}
                {token && <button
                    onClick={toggleLanguage}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '15px', marginRight: '15px', color: 'white' }}
                    title="Mudar Idioma"
                >
                    {i18n.language === 'pt' ? 'EN' : 'PT'}
                </button>}

            </div>
        </header>
    );
}