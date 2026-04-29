import { useState, useEffect, useRef } from 'react';
import useUserStore from "../store/useUserStore.js";
import { ChatService, UserService } from '../services/api';
import '../styles/Chat.css';
import { useTranslation } from "react-i18next";

export default function Chat() {
    const [utilizadores, setUtilizadores] = useState([]);
    const [chatAtivo, setChatAtivo] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [novaMensagem, setNovaMensagem] = useState('');

    // NOVO ESTADO: Controla a vista no telemóvel (se mostra contactos ou mensagens)
    const [mostrarMensagensMobile, setMostrarMensagensMobile] = useState(false);

    const ws = useRef(null);
    const mensagensFimRef = useRef(null);
    const setUnreadCount = useUserStore((state) => state.setUnreadCount);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        UserService.getActiveUsers()
            .then(res => setUtilizadores(res))
            .catch(console.error);

        const token = localStorage.getItem('token');
        let pingInterval;

        if (token) {
            ws.current = new WebSocket(`ws://localhost:8080/projeto5/ws/chat/${token}`);

            ws.current.onopen = () => {
                console.log("🟢 WebSocket Ligado ao Chat!");
                pingInterval = setInterval(() => {
                    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                        ws.current.send("PING");
                    }
                }, 60000);
            };

            ws.current.onmessage = (event) => {
                const dados = JSON.parse(event.data);
                if (dados.type === 'NEW_MESSAGE') {
                    const novaMsg = dados.payload;

                    setChatAtivo((chatAtual) => {
                        if (chatAtual && chatAtual.username === novaMsg.remetenteUsername) {
                            setMensagens((prev) => [...prev, novaMsg]);
                            ChatService.marcarComoLidas(chatAtual.username);
                        } else {
                            setUtilizadores((prevUsers) =>
                                prevUsers.map(u =>
                                    u.username === novaMsg.remetenteUsername
                                        ? { ...u, unreadCount: (u.unreadCount || 0) + 1 }
                                        : u
                                )
                            );
                        }
                        return chatAtual;
                    });
                }
            };

            ws.current.onclose = (event) => {
                console.log("🔴 WebSocket Desligado.");
                clearInterval(pingInterval);

                // Se o código de fecho for 4001 (ou outro que definas no Java)
                // ou se o token simplesmente desapareceu da store
                const { token } = tokenStore.getState();
                if (!token) {
                    // Redireciona para o login com o estado de erro
                    navigate('/login', { state: { erro: t('login.sessao_expirada') } });
                }
            };
        }

        return () => {
            if (ws.current) ws.current.close();
            if (pingInterval) clearInterval(pingInterval);
        };
    }, []);

    useEffect(() => {
        if (chatAtivo) {
            ChatService.getHistorico(chatAtivo.username)
                .then(res => setMensagens(res))
                .catch(console.error);

            ChatService.marcarComoLidas(chatAtivo.username).catch(console.error);
        }
    }, [chatAtivo]);

    useEffect(() => {
        mensagensFimRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensagens]);

    const handleEnviar = async (e) => {
        e.preventDefault();
        if (!novaMensagem.trim() || !chatAtivo) return;

        try {
            const res = await ChatService.enviarMensagem(chatAtivo.username, novaMensagem);
            setMensagens((prev) => [...prev, res]);
            setNovaMensagem('');
        } catch (error) {
            console.error("Erro ao enviar:", error);
        }
    };

    const handleSelecionarChat = (user) => {
        setChatAtivo(user);
        setMostrarMensagensMobile(true); // Activa a vista de mensagens no mobile
        setUtilizadores((prevUsers) =>
            prevUsers.map(u =>
                u.username === user.username ? { ...u, unreadCount: 0 } : u
            )
        );
    };

    // Função para o botão voltar no telemóvel
    const handleVoltarLista = () => {
        setMostrarMensagensMobile(false);
        // Opcional: setChatAtivo(null) se quiseres desmarcar o contacto ao voltar
    };

    return (
        <div className="chat-container">

            {/* BARRA LATERAL: Adicionada classe dinâmica para controlar a visibilidade mobile */}
            <div className={`chat-sidebar ${mostrarMensagensMobile ? 'mobile-hide' : ''}`}>
                <h3>{t('chat.title')}</h3>

                {utilizadores.length === 0 && <p className="chat-empty-text">{t('chat.empty')}</p>}

                {utilizadores.map((user) => (
                    <div
                        key={user.username}
                        onClick={() => handleSelecionarChat(user)}
                        className={`chat-contact-item ${chatAtivo?.username === user.username ? 'chat-contact-active' : ''}`}
                    >
                        <div className="chat-contact-info">
                            <span className="chat-contact-name">{user.primeiroNome} {user.ultimoNome}</span>
                            <span className="chat-contact-username">@{user.username}</span>
                        </div>

                        {user.unreadCount > 0 && (
                            <span className="chat-unread-badge">
                                {user.unreadCount}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* JANELA DE CONVERSA: Adicionada classe dinâmica para controlar a visibilidade mobile */}
            <div className={`chat-main ${!mostrarMensagensMobile ? 'mobile-hide' : ''}`}>
                {chatAtivo ? (
                    <>
                        <div className="chat-header">
                            {/* NOVO: Botão Voltar (só aparece no CSS mobile) */}
                            <button className="chat-back-btn" onClick={handleVoltarLista}>
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            <span className="chat-header-title">
                                {t('chat.chatMsg')} <strong>{chatAtivo.username}</strong>
                            </span>
                        </div>

                        <div className="chat-messages">
                            {mensagens.map((msg, index) => {
                                const souEu = msg.destinatarioUsername === chatAtivo.username;
                                return (
                                    <div key={index} className={`chat-message-wrapper ${souEu ? 'message-mine' : 'message-theirs'}`}>
                                        <div className={`chat-bubble ${souEu ? 'bubble-mine' : 'bubble-theirs'}`}>
                                            {msg.conteudo}
                                        </div>
                                        <div className="chat-time">
                                            {new Date(msg.dataEnvio).toLocaleTimeString()}
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={mensagensFimRef} />
                        </div>

                        <form onSubmit={handleEnviar} className="chat-input">
                            <input
                                type="text"
                                value={novaMensagem}
                                onChange={(e) => setNovaMensagem(e.target.value)}
                                placeholder={t('chat.placeholderMsg')}
                                className="chat-input-field"
                            />
                            <button
                                type="submit"
                                className="chat-send-btn"
                                disabled={!novaMensagem.trim()}
                                title={t('chat.enviar')}
                            >
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="chat-no-selection">
                        <i className="fa-regular fa-comments"></i>
                        <p>{t('chat.select_contacto')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}