import { useState, useEffect, useRef } from 'react';
import useUserStore from "../store/useUserStore.js";
import { ChatService, UserService } from '../services/api'; // Certifica-te que tens um endpoint para listar utilizadores!
import '../styles/chat.css';
import {useTranslation} from "react-i18next";

export default function Chat() {
    const [utilizadores, setUtilizadores] = useState([]);
    const [chatAtivo, setChatAtivo] = useState(null); // Quem é que selecionaste para falar
    const [mensagens, setMensagens] = useState([]);
    const [novaMensagem, setNovaMensagem] = useState('');
    const ws = useRef(null); // Guarda a ligação do WebSocket
    const mensagensFimRef = useRef(null); // Para fazer scroll automático para o fundo
    const setUnreadCount = useUserStore((state) => state.setUnreadCount);

    const { t, i18n } = useTranslation();

    // 1. Ao abrir a página, vai buscar a lista de pessoas para falar e LIGA O WEBSOCKET
    useEffect(() => {
        UserService.getActiveUsers()
            .then(res => setUtilizadores(res))
            .catch(console.error);

        const token = localStorage.getItem('token');
        let pingInterval; // Variável para guardar o nosso temporizador

        if (token) {
            ws.current = new WebSocket(`ws://localhost:8080/projeto5/ws/chat/${token}`);

            ws.current.onopen = () => {
                console.log("🟢 WebSocket Ligado ao Chat!");

                // --- INÍCIO DO HEARTBEAT ---
                // A cada 60 segundos (60000 ms), envia a palavra "PING" para o Java
                pingInterval = setInterval(() => {
                    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                        ws.current.send("PING");
                    }
                }, 60000);
                // ---------------------------
            };

            ws.current.onmessage = (event) => {
                const dados = JSON.parse(event.data);
                if (dados.type === 'NEW_MESSAGE') {
                    const novaMsg = dados.payload;

                    setChatAtivo((chatAtual) => {
                        // Se a mensagem for da pessoa com quem estamos a falar AGORA, adiciona ao ecrã
                        if (chatAtual && chatAtual.username === novaMsg.remetenteUsername) {
                            setMensagens((prev) => [...prev, novaMsg]);
                            // Aproveita e diz logo ao Java para marcar como lida!
                            ChatService.marcarComoLidas(chatAtual.username);
                        } else {
                            // Se for de OUTRA pessoa, aumenta a bolinha vermelha dela na barra lateral!
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

            ws.current.onclose = () => {
                console.log("🔴 WebSocket Desligado.");
                clearInterval(pingInterval); // Pára o relógio se o WebSocket cair
            };
        }

        // Quando o utilizador muda de página, limpa tudo de forma segura
        return () => {
            if (ws.current) ws.current.close();
            if (pingInterval) clearInterval(pingInterval);
        };
    }, []);


    // 2. Quando selecionas uma pessoa à esquerda, vai buscar o histórico
    useEffect(() => {
        if (chatAtivo) {
            // CORRIGIDO AQUI (res em vez de res.data)
            ChatService.getHistorico(chatAtivo.username)
                .then(res => setMensagens(res))
                .catch(console.error);

            ChatService.marcarComoLidas(chatAtivo.username).catch(console.error);
        }
    }, [chatAtivo]);

    // 3. Fazer Scroll automático para a última mensagem
    useEffect(() => {
        mensagensFimRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensagens]);

    // 4. Enviar Mensagem (Usa REST como pede o enunciado)
    const handleEnviar = async (e) => {
        e.preventDefault();
        if (!novaMensagem.trim() || !chatAtivo) return;

        try {
            const res = await ChatService.enviarMensagem(chatAtivo.username, novaMensagem);
            // CORRIGIDO AQUI (res em vez de res.data)
            setMensagens((prev) => [...prev, res]);
            setNovaMensagem('');
        } catch (error) {
            console.error("Erro ao enviar:", error);
        }
    };

    const handleSelecionarChat = (user) => {
        setChatAtivo(user); // Abre a conversa

        // Coloca a bolinha de notificações desse contacto a Zero visualmente
        setUtilizadores((prevUsers) =>
            prevUsers.map(u =>
                u.username === user.username ? { ...u, unreadCount: 0 } : u
            )
        );
    };

    return (
        <div className="chat-container" style={{ display: 'flex', height: '80vh', border: '1px solid #ccc' }}>

            {/* BARRA LATERAL: Lista de Utilizadores */}
            <div className="chat-sidebar" style={{ width: '30%', borderRight: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
                <h3>{t('chat.title')}</h3>

                {utilizadores.length === 0 && <p style={{color: '#888'}}>{t('chat.empty')}</p>}

                {utilizadores.map((user) => (
                    <div
                        key={user.username}
                        onClick={() => handleSelecionarChat(user)} // <-- Usa a nova função aqui!
                        style={{
                            padding: '10px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #eee',
                            background: chatAtivo?.username === user.username ? '#e9ecef' : 'transparent',
                            fontWeight: chatAtivo?.username === user.username ? 'bold' : 'normal',
                            display: 'flex', // <-- Adiciona display flex para alinhar o nome e a bolinha
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <span>
                            {user.primeiroNome} {user.ultimoNome} <span style={{fontSize: '12px', color: '#666'}}>({user.username})</span>
                        </span>

                        {/* --- BOLINHA VERMELHA DO CONTACTO --- */}
                        {user.unreadCount > 0 && (
                            <span style={{
                                background: '#e74c3c',
                                color: 'white',
                                borderRadius: '50%',
                                padding: '2px 8px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>
                                {user.unreadCount}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* JANELA DE CONVERSA */}
            <div className="chat-main" style={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
                {chatAtivo ? (
                    <>
                        <div className="chat-header" style={{ padding: '15px', background: '#f4f4f4', borderBottom: '1px solid #ccc' }}>
                            {t('chat.chatMsg')} <strong>{chatAtivo.username}</strong>
                        </div>

                        <div className="chat-messages" style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#fafafa' }}>
                            {mensagens.map((msg, index) => {
                                const souEu = msg.destinatarioUsername === chatAtivo.username;
                                return (
                                    <div key={index} style={{ textAlign: souEu ? 'right' : 'left', margin: '10px 0' }}>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '10px 15px',
                                            borderRadius: '15px',
                                            background: souEu ? '#007bff' : '#e9ecef',
                                            color: souEu ? 'white' : 'black'
                                        }}>
                                            {msg.conteudo}
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#888', marginTop: '5px' }}>
                                            {new Date(msg.dataEnvio).toLocaleTimeString()}
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={mensagensFimRef} />
                        </div>

                        <form onSubmit={handleEnviar} className="chat-input" style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ccc' }}>
                            <input
                                type="text"
                                value={novaMensagem}
                                onChange={(e) => setNovaMensagem(e.target.value)}
                                placeholder={t('chat.placeholder_msg')}
                                style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc', marginRight: '10px' }}
                            />
                            <button type="submit" style={{ padding: '10px 20px', borderRadius: '20px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                                {t('chat.enviar')}
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                        {t('chat.select_contacto')}
                    </div>
                )}
            </div>
        </div>
    );
}