/**
 * @file ChatWindow.jsx
 * @description Componente de interface principal do Chat.
 * Renderiza o histórico de mensagens trocadas com o utilizador selecionado, trata da
 * formatação robusta de datas e exibe o formulário de envio de novas mensagens.
 */

import { useTranslation } from "react-i18next";

/**
 * Componente funcional que gere a vista de leitura e escrita do chat.
 *
 * @component
 * @param {Object} props - Propriedades passadas ao componente.
 * @param {Object|null} props.chatAtivo - Objeto representando o contacto do chat aberto atualmente.
 * @param {Array} props.mensagens - Lista de mensagens pertencentes ao chat em visualização.
 * @param {string} props.novaMensagem - Estado controlado do texto atualmente no input de mensagem.
 * @param {Function} props.setNovaMensagem - Função para atualizar o estado da novaMensagem.
 * @param {Function} props.onEnviar - Função invocada na submissão do formulário de chat.
 * @param {Function} props.onVoltar - Função invocada no botão "voltar" (exclusivo mobile).
 * @param {boolean} props.isMobileHidden - Booleano para ocultar a janela se nenhum chat estiver ativo no mobile.
 * @param {React.MutableRefObject} props.mensagensFimRef - Referência DOM usada para forçar o scroll automático para a última mensagem.
 * @returns {JSX.Element} A interface principal de chat ou o "empty state" de seleção.
 */
export default function ChatWindow({
                                       chatAtivo,
                                       mensagens,
                                       novaMensagem,
                                       setNovaMensagem,
                                       onEnviar,
                                       onVoltar,
                                       isMobileHidden,
                                       mensagensFimRef
                                   }) {
    const { t } = useTranslation();

    /**
     * Converte datas recebidas (arrays ISO ou Strings) num formato legível para o Chat (HH:MM).
     * @function getHoraFormatada
     * @param {Array|string} data - A estrutura da data proveniente do backend.
     * @returns {string} String com a hora formatada.
     */
    const getHoraFormatada = (data) => {
        if (!data) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        try {
            let d;
            if (Array.isArray(data)) {
                d = new Date(data[0], data[1] - 1, data[2], data[3] || 0, data[4] || 0, data[5] || 0);
            } else {
                d = new Date(data);
            }
            if (isNaN(d.getTime())) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    };

    return (
        <div className={`chat-main ${!isMobileHidden ? 'mobile-hide' : ''}`}>
            {chatAtivo ? (
                <>
                    <div className="chat-header">
                        <button className="chat-back-btn" onClick={onVoltar}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <span className="chat-header-title">
                            {t('chat.chat_msg')} <strong>{chatAtivo.username}</strong>
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
                                    <div className="chat-time" style={{ display: 'flex', alignItems: 'center', justifyContent: souEu ? 'flex-end' : 'flex-start', gap: '5px' }}>
                                        <span>{getHoraFormatada(msg.dataEnvio)}</span>
                                        {souEu && (
                                            <span className="message-ticks" style={{ fontSize: '13px' }}>
                                                {msg.lida ? (
                                                    <i className="fa-solid fa-check-double" style={{ color: '#3b82f6' }}></i>
                                                ) : (
                                                    <i className="fa-solid fa-check" style={{ color: '#94a3b8' }}></i>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={mensagensFimRef} />
                    </div>

                    <form onSubmit={onEnviar} className="chat-input">
                        <input
                            type="text"
                            value={novaMensagem}
                            onChange={(e) => setNovaMensagem(e.target.value)}
                            placeholder={t('chat.placeholder_msg')}
                            className="chat-input-field"
                        />
                        <button type="submit" className="chat-send-btn" disabled={!novaMensagem.trim()} title={t('chat.enviar')}>
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
    );
}