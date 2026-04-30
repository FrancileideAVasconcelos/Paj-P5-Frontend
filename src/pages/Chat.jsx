import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatService } from '../services/api';
import '../styles/Chat.css';
import { useTranslation } from "react-i18next";
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatWindow from '../components/chat/ChatWindow.jsx';

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
        // 1. Carrega os utilizadores já ordenados pelo Java
        ChatService.getContactos()
            .then(res => setUtilizadores(res))
            .catch(console.error);

        const token = localStorage.getItem('token');
        let pingInterval;

        // 2. Se houver token, liga o WebSocket
        if (token) {
            const socket = new WebSocket(ChatService.getWebSocketUrl(token));
            ws.current = socket;

            socket.onopen = () => {
                console.log("🟢 WebSocket Ligado ao Chat!");
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
                        // O chat está ABERTO com esta pessoa
                        setMensagens((prev) => {
                            const msgFinal = { ...novaMsg, id: novaMsg.id || Date.now() };
                            if (prev.some(m => m.id === msgFinal.id)) return prev;
                            return [...prev, msgFinal];
                        });

                        // Marca como lidas e DEPOIS pede ao Java a lista de contactos fresca
                        ChatService.marcarComoLidas(chatAtual.username)
                            .then(() => ChatService.getContactos())
                            .then(res => setUtilizadores(res))
                            .catch(console.error);
                    } else {
                        // 🚀 A MAGIA: O chat NÃO está aberto. Pedimos ao Java a lista fresca!
                        // Ela já vem ordenada e com os números exatos e não duplicados.
                        ChatService.getContactos()
                            .then(res => setUtilizadores(res))
                            .catch(console.error);
                    }

                } catch (error) {
                    console.error("Erro ao processar mensagem do WebSocket:", error);
                }
            };

            socket.onclose = (event) => {
                console.log("🔴 WebSocket Desligado. Código:", event.code);
                clearInterval(pingInterval);

                if (event.code !== 1000) {
                    const currentToken = localStorage.getItem('token');
                    if (!currentToken) {
                        navigate('/login', { state: { erro: t('geral.sessao_expirada') } });
                    }
                }
            };

            socket.onerror = (error) => {
                console.error("⚠️ Erro no WebSocket:", error);
            };
        }

        // 3. Função de Limpeza
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

    // --- AÇÕES DO CHAT ---
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

            // 🚀 Atualizar a lista diretamente do Java após enviar!
            ChatService.getContactos()
                .then(res => setUtilizadores(res))
                .catch(console.error);

        } catch (error) {
            console.error("Erro ao enviar:", error);
        }
    };

    const handleSelecionarChat = (user) => {
        setChatAtivo(user);
        setMostrarMensagensMobile(true);
        setUtilizadores((prevUsers) =>
            prevUsers.map(u =>
                u.username === user.username ? { ...u, unreadCount: 0 } : u
            )
        );
    };

    const handleVoltarLista = () => {
        setMostrarMensagensMobile(false);
        setChatAtivo(null); // Esquece a pessoa ao voltar
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