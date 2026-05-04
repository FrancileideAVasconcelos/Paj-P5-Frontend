/**
 * @file Admin.jsx
 * @description Página principal de administração do sistema.
 * Permite visualizar, pesquisar e gerir todos os utilizadores da plataforma,
 * bem como enviar convites de registo para novos administradores ou utilizadores.
 */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import useAdminStore from '../store/useAdminStore.js';
import tokenStore from '../store/tokenStore.js';
import { AdminService } from '../services/api';

import '../styles/ClientLead.css';
import '../styles/Admin.css';
import {useTranslation} from "react-i18next";
import Pagination from "../components/Pagination.jsx";

/**
 * Componente funcional que renderiza o painel geral de Administração.
 *
 * @component
 * @returns {JSX.Element} A interface de gestão de utilizadores e envio de convites.
 */
export default function Admin() {
    const navigate = useNavigate();
    const token = tokenStore((state) => state.token);

    const { users, loading, error, fetchUsers, totalPages } = useAdminStore();

    const [page, setPage] = useState(1);

    // --- ESTADOS PARA O CONVITE ---
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteMsg, setInviteMsg] = useState({ texto: '', tipo: '' });
    const [loadingInvite, setLoadingInvite] = useState(false);

    // --- ESTADOS DA PESQUISA E HISTÓRICO ---
    const [searchTerm, setSearchTerm] = useState("");
    const [showHistory, setShowHistory] = useState(false);
    const [searchHistory, setSearchHistory] = useState(() => {
        const saved = localStorage.getItem('adminSearchHistory');
        return saved ? JSON.parse(saved) : [];
    });

    const { t } = useTranslation();

    useEffect(() => {
        if (searchTerm === "") {
            fetchUsers(token, "");
        }
    }, [searchTerm, token, fetchUsers]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    // O famoso "Debounce" que reage à pesquisa e à mudança de página!
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            fetchUsers(token, searchTerm, page);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, page, token, fetchUsers, navigate]);

    /**
     * Guarda um termo de pesquisa no histórico local (LocalStorage), mantendo um máximo de 5 itens.
     * @param {string} term - O termo pesquisado a guardar.
     */
    const handleSaveSearch = (term) => {
        if (!term.trim()) return;
        const newHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('adminSearchHistory', JSON.stringify(newHistory));
    };

    /**
     * Interceta a tecla Enter no input de pesquisa para forçar a filtragem imediata.
     * @param {React.KeyboardEvent} e - Evento de teclado.
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSaveSearch(searchTerm);
            setShowHistory(false);
            fetchUsers(token, searchTerm);
        }
    };

    /**
     * Limpa o histórico de pesquisa atual guardado no LocalStorage.
     */
    const clearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem('adminSearchHistory');
    };

    /**
     * Processa a submissão do formulário de convite de novos utilizadores.
     * @async
     * @param {React.FormEvent} e - Evento de submissão do formulário.
     */
    const handleConvidar = async (e) => {
        e.preventDefault();
        setLoadingInvite(true);
        setInviteMsg({ texto: '', tipo: '' });

        try {
            await AdminService.inviteUser(inviteEmail);
            setInviteMsg({ texto: t('admin.inviteMsg'), tipo: 'sucesso' });
            setInviteEmail('');
            setTimeout(() => {
                setIsInviteModalOpen(false);
                setInviteMsg({ texto: '', tipo: '' });
            }, 2000);
        } catch (error) {
            setInviteMsg({ texto: error.message || t('admin.erroMsg'), tipo: 'erro' });
        } finally {
            setLoadingInvite(false);
        }
    };

    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
        <div className="admin-container">
            <div className="admin-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 className="admin-title" style={{ margin: 0 }}>{t('admin.title')}</h2>

                <button
                    className="btn-save"
                    onClick={() => setIsInviteModalOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <i className="fa-solid fa-user-plus"></i>
                    {t('admin.convidar')}
                </button>
            </div>

            {/* --- BARRA DE PESQUISA COM HISTÓRICO --- */}
            <div style={{ marginBottom: '25px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                    <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
                    <input
                        type="text"
                        placeholder={t('admin.placeholder_pesquisa')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setShowHistory(true)}
                        onBlur={() => setShowHistory(false)}
                        onKeyDown={handleKeyDown}
                        style={{
                            width: '100%',
                            padding: '10px 10px 10px 35px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '15px',
                            outline: 'none'
                        }}
                    />

                    {/* CAIXA SUSPENSA (DROPDOWN) DO HISTÓRICO */}
                    {showHistory && searchHistory.length > 0 && (
                        <div style={{
                            position: 'absolute', top: '100%', left: 0, right: 0,
                            backgroundColor: 'white', border: '1px solid #e2e8f0',
                            borderRadius: '8px', marginTop: '5px', zIndex: 10,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>{t('admin.historico')}</span>
                                <span
                                    onMouseDown={(e) => { e.preventDefault(); clearHistory(); }}
                                    style={{ fontSize: '12px', color: '#ef4444', cursor: 'pointer' }}
                                >
                                    {t('admin.limpar')}
                                </span>
                            </div>
                            {searchHistory.map((item, idx) => (
                                <div
                                    key={idx}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        setSearchTerm(item);
                                        handleSaveSearch(item);
                                        setShowHistory(false);
                                        fetchUsers(token, item);
                                    }}
                                    style={{ padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <i className="fa-solid fa-clock-rotate-left" style={{ color: '#cbd5e1' }}></i>
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {error && <div className="alert-message alert-error">{error}</div>}

            {loading ? (
                <p className="loading-text">{t('admin.carregar_utilizadores')}</p>
            ) : (
                <div className="users-list">
                    {users.length > 0 ? (
                        users.map((user) => (
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
                                            {user.admin && <span className="admin-badge"><i className="fa-solid fa-crown"></i> {t('admin.detalhes.admin_tag')}</span>}
                                        </h3>
                                        <p>@{user.username} | {user.email}</p>
                                    </div>
                                </div>
                                <div className="user-actions">
                                    <span className={`status-badge ${user.ativo ? 'badge-active' : 'badge-inactive'}`}>
                                        {user.ativo ? t('admin.ativo') : t('admin.inativo')}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="empty-list-text">{t('admin.lista_vazia')}</p>
                    )}
                </div>
            )}

            {/* --- MODAL DE CONVITE --- */}
            {isInviteModalOpen && (
                <div className="modal-overlay" onClick={() => setIsInviteModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h3>{t('admin.convidar')}</h3>
                        </div>

                        <form onSubmit={handleConvidar} style={{ marginTop: '20px' }}>
                            <div className="form-group">
                                <label>{t('admin.placeholder_email')}</label>
                                <input
                                    type="email"
                                    placeholder="ex@email.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>

                            {inviteMsg.texto && (
                                <p style={{
                                    marginTop: '15px',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    backgroundColor: inviteMsg.tipo === 'sucesso' ? '#e6f4ea' : '#fce8e6',
                                    color: inviteMsg.tipo === 'sucesso' ? '#1e7e34' : '#c62828',
                                    border: `1px solid ${inviteMsg.tipo === 'sucesso' ? '#b7e1cd' : '#f5c6cb'}`
                                }}>
                                    {inviteMsg.texto}
                                </p>
                            )}

                            <div className="modal-actions" style={{ marginTop: '25px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn-cancel" onClick={() => setIsInviteModalOpen(false)}>
                                    {t('geral.cancelar')}
                                </button>
                                <button type="submit" className="btn-save" disabled={loadingInvite}>
                                    {loadingInvite ? t('admin.enviando') : t('admin.enviar_convite')}
                                </button>
                            </div>
                        </form>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            loading={loading}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}