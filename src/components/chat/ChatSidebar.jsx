import { useTranslation } from "react-i18next";

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