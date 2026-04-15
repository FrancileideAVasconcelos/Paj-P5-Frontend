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

/**
 * Componente funcional que renderiza a barra superior da interface.
 * @component
 * @param {Object} props - Propriedades do componente.
 * @param {Function} props.toggleMenu - Função para alternar a visibilidade do menu lateral (útil em dispositivos móveis).
 * @returns {JSX.Element} Estrutura do cabeçalho com logótipo e ações do utilizador.
 */
export default function Header({ toggleMenu }) {
    const navigate = useNavigate();

    // --- ZUSTAND E TOKENS ---
    const currentUser = useUserStore((state) => state.currentUser);
    const unreadCount = useUserStore((state) => state.unreadCount);
    const setUnreadCount = useUserStore((state) => state.setUnreadCount);
    const token = tokenStore((state) => state.token);
    const wsNotif = useRef(null);

    // --- LIGAÇÃO GLOBAL DE NOTIFICAÇÕES ---
    useEffect(() => {
        let pingInterval;

        if (token) {
            // Ligar à autoestrada das Notificações
            wsNotif.current = new WebSocket(`ws://localhost:8080/projeto5/ws/notifications/${token}`);

            wsNotif.current.onopen = () => {
                console.log("🔔 Header Conectado ao Serviço de Notificações!");
                pingInterval = setInterval(() => {
                    if (wsNotif.current?.readyState === WebSocket.OPEN) {
                        wsNotif.current.send("PING");
                    }
                }, 60000);
            };

            wsNotif.current.onmessage = (event) => {
                const dados = JSON.parse(event.data);
                if (dados.type === 'UNREAD_COUNT') {
                    setUnreadCount(dados.count);
                }
            };

            wsNotif.current.onclose = () => {
                clearInterval(pingInterval);
            };
        }

        return () => {
            if (wsNotif.current) wsNotif.current.close();
            if (pingInterval) clearInterval(pingInterval);
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
                {/* Saudação personalizada utilizando o primeiro nome do utilizador */}
                {token && <p>Bem-vindo, {currentUser ? currentUser.primeiroNome : '...'}</p>}

                {/* --- ÍCONE DO SINO COM NOTIFICAÇÕES --- */}
                <div
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
                </div>
                {/* -------------------------------------- */}


                {/* Link para a página de edição de perfil */}
                {token && <div className="logout-btn" onClick={() => navigate('/profile')}>Meu Perfil</div>}

                {/* Botão de encerramento de sessão */}
                {token && <div className="logout-btn" onClick={() => tokenStore.getState().logout()}>Logout</div>}
            </div>
        </header>
    );
}