/**
 * @file Chat.jsx
 * @description Componente de página mestre do módulo de Mensagens/Chat em tempo real.
 * Gere a ligação WebSocket global para o chat, o estado do contacto ativo e a sincronização do histórico.
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatService } from '../services/api';
import '../styles/Chat.css';
import { useTranslation } from "react-i18next";
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatWindow from '../components/chat/ChatWindow.jsx';

/**
 * Componente funcional que engloba a barra lateral de contactos e a janela de conversação.
 *
 * @component
 * @returns {JSX.Element} A interface completa do módulo de Chat.
 */
export default function Chat() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // --- ESTADOS ---
    const [utilizadores, setUtilizadores] = useState([]);
    const [chatAtivo, setChatAtivo] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [novaMensagem, setNovaMensagem] = useState('');
    const [mostrarMensagensMobile, setMostrarMensagensMobile] = useState(false);

    // --- REFERÊNCIAS ---
    const chatAtivoRef = useRef(null);
    const ws = useRef(null);
    const mensagensFimRef = useRef(null);

    useEffect(() => {
        chatAtivoRef.current = chatAtivo;
    }, [chatAtivo]);

    // --- CARREGAMENTO INICIAL E WEBSOCKET ---
    useEffect(() => {
        ChatService.getContactos()
            .then(res => setUtilizadores(res))
            .catch(console.error);

        const token = localStorage.getItem('token');
        let pingInterval;

        if (token) {
            const socket = new WebSocket(ChatService.getWebSocketUrl(token));
            ws.current = socket;

            socket.onopen = () => {
                console.log(t('websocket.ligado'));
                pingInterval = setInterval(() => {
                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send("PING");
                    }
                }, 60000);
            };

            socket.onmessage = (event) => {
                try {
                    const dados = JSON.parse(event.data);
                    const novaMsg = dados.payload ? dados.payload : dados;

                    if (!novaMsg.remetenteUsername) return;

                    const chatAtual = chatAtivoRef.current;

                    if (chatAtual && chatAtual.username === novaMsg.remetenteUsername) {
                        setMensagens((prev) => {
                            const msgFinal = { ...novaMsg, id: novaMsg.id || Date.now() };
                            if (prev.some(m => m.id === msgFinal.id)) return prev;
                            return [...prev, msgFinal];
                        });

                        ChatService.marcarComoLidas(chatAtual.username)
                            .then(() => ChatService.getContactos())
                            .then(res => setUtilizadores(res))
                            .catch(console.error);
                    } else {
                        ChatService.getContactos()
                            .then(res => setUtilizadores(res))
                            .catch(console.error);
                    }

                } catch (error) {
                    console.error(t('websocket.erro_mensagem'), error);
                }
            };

            socket.onclose = (event) => {
                console.log(t('websocket.desligado'), event.code);
                clearInterval(pingInterval);

                if (event.code !== 1000) {
                    const currentToken = localStorage.getItem('token');
                    if (!currentToken) {
                        navigate('/login', { state: { erro: t('geral.sessao_expirada') } });
                    }
                }
            };

            socket.onerror = (error) => {
                console.error(t('websocket.erro_web'), error);
            };
        }

        return () => {
            if (pingInterval) clearInterval(pingInterval);

            if (ws.current) {
                const socket = ws.current;
                if (socket.readyState === WebSocket.OPEN) {
                    socket.onopen = null;
                    socket.onmessage = null;
                    socket.onclose = null;
                    socket.onerror = null;
                    socket.close(1000, 'Cleanup React');
                } else if (socket.readyState === WebSocket.CONNECTING) {
                    socket.onopen = () => {
                        socket.close(1000, 'Cleanup React StrictMode');
                    };
                    socket.onmessage = null;
                    socket.onclose = null;
                    socket.onerror = null;
                }
                ws.current = null;
            }
        };
    }, []);

    // --- SINCRONIZAÇÃO DE MENSAGENS ---
    useEffect(() => {
        let intervaloSync;

        if (chatAtivo) {
            const carregarHistorico = () => {
                ChatService.getHistorico(chatAtivo.username)
                    .then(res => {
                        setMensagens(prev => {
                            const prevIds = prev.map(m => m.id).join(',');
                            const resIds = res.map(m => m.id).join(',');
                            const lidasMudaram = res.some((m, i) => prev[i] && m.lida !== prev[i].lida);
                            const mudou = prevIds !== resIds || lidasMudaram;
                            return mudou ? res : prev;
                        });
                    })
                    .catch(console.error);
            };

            ChatService.getHistorico(chatAtivo.username)
                .then(res => setMensagens(res))
                .catch(console.error);

            ChatService.marcarComoLidas(chatAtivo.username).catch(console.error);

            intervaloSync = setInterval(() => {
                carregarHistorico();
            }, 3000);
        }

        return () => {
            if (intervaloSync) clearInterval(intervaloSync);
        };
    }, [chatAtivo]);

    useEffect(() => {
        mensagensFimRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [mensagens]);

    /**
     * Gere o envio de uma nova mensagem via HTTP e atualiza o estado local otimisticamente.
     * @async
     * @param {React.FormEvent} e - O evento de submissão do formulário.
     */
    const handleEnviar = async (e) => {
        e.preventDefault();
        if (!novaMensagem.trim() || !chatAtivo) return;

        const textoEnviado = novaMensagem;
        setNovaMensagem('');

        try {
            const res = await ChatService.enviarMensagem(chatAtivo.username, textoEnviado);

            setMensagens((prev) => {
                const msgFinal = (res && typeof res === 'object' && res.conteudo) ? res : {
                    id: Date.now(),
                    conteudo: textoEnviado,
                    destinatarioUsername: chatAtivo.username,
                    dataEnvio: new Date().toISOString(),
                    lida: false
                };

                if (msgFinal.id && prev.some(m => m.id === msgFinal.id)) return prev;
                return [...prev, msgFinal];
            });

            ChatService.getContactos()
                .then(res => setUtilizadores(res))
                .catch(console.error);

        } catch (error) {
            console.error(t('websocket.erro_envio_msg'), error);
        }
    };

    /**
     * Define o contacto atualmente ativo e esconde a barra lateral em ecrãs mobile.
     * @param {Object} user - O objeto do utilizador selecionado.
     */
    const handleSelecionarChat = (user) => {
        setChatAtivo(user);
        setMostrarMensagensMobile(true);
        setUtilizadores((prevUsers) =>
            prevUsers.map(u =>
                u.username === user.username ? { ...u, unreadCount: 0 } : u
            )
        );
    };

    /**
     * Desseleciona o contacto atual, regressando à lista de contactos na vista mobile.
     */
    const handleVoltarLista = () => {
        setMostrarMensagensMobile(false);
        setChatAtivo(null);
    };

    return (
        <div className="chat-container">
            <ChatSidebar
                utilizadores={utilizadores}
                chatAtivo={chatAtivo}
                onSelectChat={handleSelecionarChat}
                isMobileHidden={mostrarMensagensMobile}
            />

            <ChatWindow
                chatAtivo={chatAtivo}
                mensagens={mensagens}
                novaMensagem={novaMensagem}
                setNovaMensagem={setNovaMensagem}
                onEnviar={handleEnviar}
                onVoltar={handleVoltarLista}
                isMobileHidden={mostrarMensagensMobile}
                mensagensFimRef={mensagensFimRef}
            />
        </div>
    );
}