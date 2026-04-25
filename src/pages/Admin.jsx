/**
 * @file Admin.jsx
 * @description Componente de página principal para a área de administração.
 * Responsável por listar todos os utilizadores do sistema, permitindo visualizar o seu estado (ativo/inativo),
 * cargos (admin) e navegar para a gestão detalhada de cada conta.
 */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import useAdminStore from '../store/useAdminStore.js';
import tokenStore from '../store/tokenStore.js';
import { AdminService } from '../services/api';

import '../styles/ClientLead.css';
import '../styles/Admin.css';
import {useTranslation} from "react-i18next";

/**
 * Componente funcional que renderiza o painel de gestão de utilizadores.
 * @component
 * @returns {JSX.Element} Lista de cartões de utilizadores com informações de perfil e estado.
 */
export default function Admin() {
    /** @type {Function} Hook para navegação programática para as rotas de detalhes de utilizador. */
    const navigate = useNavigate();

    /** @type {string|null} Token de autenticação para autorizar o acesso aos dados administrativos. */
    const token = tokenStore((state) => state.token);

    // --- ESTADOS DA STORE DE ADMINISTRAÇÃO ---
    /** @type {Object} Dados e funções de ação provenientes da useAdminStore. */
    const { users, loading, error, fetchUsers } = useAdminStore();

    // NOVOS ESTADOS PARA O CONVITE:
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteMsg, setInviteMsg] = useState({ texto: '', tipo: '' });
    const [loadingInvite, setLoadingInvite] = useState(false);

    const { t, i18n } = useTranslation();

    /**
     * Efeito de carregamento: Procura a lista de utilizadores no servidor assim que o componente é montado.
     * Caso o token não exista, redireciona o utilizador para a página de login.
     */
    useEffect(() => {
        if (token) fetchUsers(token);
        else navigate('/login');
    }, [token, fetchUsers, navigate]);

    /**
     * Ordena a lista de utilizadores alfabeticamente pelo nome completo.
     * Utiliza useMemo para evitar reordenações desnecessárias durante re-renderizações que não alterem a lista base.
     * @type {Array<Object>} Lista de utilizadores ordenada.
     */
    const sortedUsers = useMemo(() => {
        if (!users || !Array.isArray(users)) return [];
        return [...users].sort((a, b) => {
            const nomeA = `${a.primeiroNome} ${a.ultimoNome}`.toLowerCase();
            const nomeB = `${b.primeiroNome} ${b.ultimoNome}`.toLowerCase();
            return nomeA.localeCompare(nomeB);
        });
    }, [users]);

    const handleConvidar = async (e) => {
        e.preventDefault();
        setLoadingInvite(true);
        setInviteMsg({ texto: '', tipo: '' });

        try {
            await AdminService.inviteUser(inviteEmail);
            setInviteMsg({ texto: t('admin.inviteMsg'), tipo: 'sucesso' });
            setInviteEmail(''); // Limpa o campo
        } catch (error) {
            setInviteMsg({ texto: error.message || t('admin.erroMsg'), tipo: 'erro' });
        } finally {
            setLoadingInvite(false);
        }
    };

    /** @type {string} URL da imagem de avatar padrão para utilizadores sem foto. */
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
        <div className="admin-container">
            <h2 className="admin-title">{t('admin.title')}</h2>

            {/* --- NOVA SECÇÃO DE CONVITE --- */}
            <div className="invite-section" style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h3>{t('admin.convidar')}</h3>
                <form onSubmit={handleConvidar} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
                    <input
                        type="email"
                        placeholder={t('admin.placeholder_email')}
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                        style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" className="btn-auth" disabled={loadingInvite} style={{ margin: 0 }}>
                        {loadingInvite ? t('admin.enviando') : t('admin.enviar_convite')}
                    </button>
                </form>
                {inviteMsg.texto && (
                    <p style={{ marginTop: '10px', fontWeight: 'bold', color: inviteMsg.tipo === 'sucesso' ? '#27ae60' : '#e74c3c' }}>
                        {inviteMsg.texto}
                    </p>
                )}
            </div>
            {/* ------------------------------- */}

            {/* Exibição de mensagens de erro globais da store */}
            {error && <div className="alert-message alert-error">{error}</div>}

            {/* Renderização condicional: Feedback de carregamento ou lista de cartões */}
            {loading ? (
                <p className="loading-text">{t('admin.carregar_utilizadores')}</p>
            ) : (
                <div className="users-list">
                    {/* Mapeia os utilizadores ordenados para criar a interface de cartões */}
                    {sortedUsers.map((user) => (
                        <div
                            key={user.username}
                            className={`user-card ${user.ativo ? 'card-active' : 'card-inactive'}`}
                            onClick={() => navigate(`/admin/user/${user.username}`)}
                        >
                            <div className="user-info">
                                <img
                                    src={user.fotoUrl || defaultAvatar}
                                    alt={`Foto de ${user.primeiroNome}`}
                                    className="user-avatar"
                                    onError={(e) => { e.target.src = defaultAvatar; }}
                                />
                                <div className="user-details">
                                    <h3>
                                        {user.primeiroNome} {user.ultimoNome}
                                        {/* Exibição condicional do badge de administrador */}
                                        {user.admin && <span className="admin-badge"><i className="fa-solid fa-crown"></i> {t('admin.detalhes.admin_tag')}</span>}
                                    </h3>
                                    <p>@{user.username} | {user.email}</p>
                                </div>
                            </div>

                            {/* Indicador visual de conta ativa ou inativa */}
                            <div className="user-actions">
                                <span className={`status-badge ${user.ativo ? 'badge-active' : 'badge-inactive'}`}>
                                    {user.ativo ? t('admin.ativo') : t('admin.inativo')}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Mensagem de fallback para listas vazias */}
                    {sortedUsers.length === 0 && !loading && (
                        <p className="empty-list-text">{t('admin.lista_vazia')}</p>
                    )}
                </div>
            )}
        </div>
    );
}