/**
 * @file ChatSidebar.jsx
 * @description Componente da barra lateral do módulo de Chat.
 * Exibe a lista de contactos ativos (utilizadores com conversas) e alertas visuais de mensagens não lidas.
 */

import { useTranslation } from "react-i18next";

/**
 * Componente funcional responsável por listar e selecionar os contactos do chat.
 *
 * @component
 * @param {Object} props - Propriedades passadas ao componente.
 * @param {Array} props.utilizadores - Lista de objetos de utilizadores para exibir na barra lateral.
 * @param {Object|null} props.chatAtivo - Objeto do contacto com o qual a conversa está atualmente aberta.
 * @param {Function} props.onSelectChat - Função invocada quando um contacto é clicado.
 * @param {boolean} props.isMobileHidden - Booleano para controlo de CSS responsável por ocultar a barra no mobile quando o chat está aberto.
 * @returns {JSX.Element} Lista interativa de contactos de chat.
 */
export default function ChatSidebar({ utilizadores, chatAtivo, onSelectChat, isMobileHidden }) {
    const { t } = useTranslation();

    return (
        <div className={`chat-sidebar ${isMobileHidden ? 'mobile-hide' : ''}`}>
            <h3>{t('chat.title')}</h3>

            {utilizadores.length === 0 && <p className="chat-empty-text">{t('chat.empty')}</p>}

            {utilizadores.map((user) => (
                <div
                    key={user.username}
                    onClick={() => onSelectChat(user)}
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
    );
}