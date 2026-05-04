/**
 * @file AdminUserDetails.jsx
 * @description Componente de painel administrativo detalhado para a gestão de um utilizador específico.
 * Permite ao administrador visualizar e manipular Clientes e Leads de outros utilizadores,
 * gerir o estado da conta (ativar/inativar) e realizar exclusões permanentes.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAdminStore from '../../store/useAdminStore.js';
import useUserStore from '../../store/useUserStore.js';
import tokenStore from '../../store/tokenStore.js';
import { STATUS_OPTIONS } from "../../utils/constants.js";
import ListClientLeadAdmin from './ListClientLeadAdmin.jsx';
import FormModal from "../formModal.jsx";
import useFormModal from "../../hooks/useFormModal.js";

import '../../styles/ClientLead.css';
import '../../styles/Admin.css';
import {useTranslation} from "react-i18next";

/**
 * Componente funcional que renderiza o painel de controlo total sobre um utilizador.
 * @component
 * @returns {JSX.Element} Interface administrativa com cartões de perfil, listas de dados e ações de gestão.
 */
export default function AdminUserDetails() {

    const { t, i18n } = useTranslation();

    /** @type {string} Username extraído dos parâmetros da URL para identificar o utilizador a gerir. */
    const { username } = useParams();
    /** @type {Function} Hook de navegação para redirecionamentos (ex: após apagar conta). */
    const navigate = useNavigate();
    /** @type {string|null} Token de autenticação para autorizar operações administrativas. */
    const token = tokenStore((state) => state.token);
    /** @type {string} Estado local para o filtro de estado aplicado à lista de Leads. */
    const [filtro, setFiltro] = useState("");

    /** @type {Object|null} Dados do administrador atualmente logado para validação de segurança. */
    const currentUser = useUserStore((state) => state.currentUser);
    /** @type {boolean} Verifica se o perfil em visualização pertence ao próprio administrador logado. */
    const isMe = currentUser?.username === username;

    const {
        users, userClients, userLeads, loadingDetails, fetchUserDetails, clearUserDetails, error,
        editClientAdmin, editLeadAdmin, editUserAdmin, deleteUser, reactivateUser, fetchUsers, // <--- ADICIONA O editUserAdmin AQUI
        toggleItemStatus, deleteItemPermanent, toggleAllItemsStatus, deleteAllItemsPermanent
    } = useAdminStore();

    /** @type {Object} Encontra o objeto do utilizador selecionado dentro da lista global de utilizadores. */
    const selectedUser = users.find(u => u.username === username) || {};

    /** * Hook de modal configurado especificamente para a edição de CLIENTES de terceiros.
     * @type {Object}
     */
    const clientModal = useFormModal(
        async () => {}, // Criação não é permitida diretamente pelo admin neste painel
        (t, id, data) => editClientAdmin(t, username, id, data),
        token
    );

    /** * Hook de modal configurado especificamente para a edição de LEADS de terceiros.
     * @type {Object}
     */
    const leadModal = useFormModal(
        async () => {},
        (t, id, data) => editLeadAdmin(t, username, id, data),
        token
    );

    // --- NOVO: Modal para editar o Utilizador ---
    const [editUserData, setEditUserData] = useState({});
    const userModal = useFormModal(
        async () => {}, // Admin não cria utilizadores por aqui
        (t, _, data) => editUserAdmin(token, username, data), // Usa a store!
        token
    );

    const handleEditUser = () => {
        setEditUserData({
            id: selectedUser.id,
            primeiroNome: selectedUser.primeiroNome || '',
            ultimoNome: selectedUser.ultimoNome || '',
            email: selectedUser.email || '',
            telefone: selectedUser.telefone || '',
            fotoUrl: selectedUser.fotoUrl || '',
            username: selectedUser.username || '',
            password: 'admin-bypass' // <--- A MAGIA: Engana a validação do Java, mas o Bean ignora-a!
        });
        userModal.abrirParaEditar(null, selectedUser);
    };

    /**
     * Efeito de Ciclo de Vida: Carrega os dados detalhados (Leads e Clientes) do utilizador.
     * Se a lista global de utilizadores estiver vazia (ex: refresh da página), recarrega-a primeiro.
     */
    useEffect(() => {
        if (token && username) {
            if (users.length === 0) fetchUsers(token);
            fetchUserDetails(token, username);
        } else if (!token) {
            navigate('/login');
        }
        // Limpa os dados de detalhes da store ao sair do componente para evitar "leaks" de UI
        return () => clearUserDetails();
    }, [token, username, fetchUserDetails, clearUserDetails, fetchUsers, navigate, users.length]);

    /** @type {string} Avatar padrão caso o utilizador não possua fotoUrl. */
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    /** * Elemento JSX de filtro (Select) para ser injetado no componente de lista de Leads.
     * @type {JSX.Element}
     */
    const filtroLeads = (
        <select className="filtro" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="">{t('leads.filtro_todos')}</option>
            {STATUS_OPTIONS && STATUS_OPTIONS.map((opcao) => (
                <option key={opcao.id} value={opcao.id}>
                    {t(opcao.key)}
                </option>
            ))}
        </select>
    );

    /** @type {Array} Lista de leads filtrada com base na escolha do administrador. */
    const leadsFiltradas = filtro === ""
        ? userLeads
        : userLeads.filter(lead => String(lead.estado) === String(filtro));

    /**
     * Altera o estado 'ativo' de um Cliente ou Lead individual.
     * @async
     * @param {Object} item - O objeto do item a alterar.
     * @param {string} type - 'client' ou 'lead'.
     */
    const handleToggleActive = async (item, type) => {
        const acao =
            item.ativo ? t('admin.detalhes.confirm_inativar_item')
            : t('admin.detalhes.confirm_reativar_item');

        if (window.confirm(acao)) {
            await toggleItemStatus(token, username, type, item.id, item.ativo);
        }
    };

    /**
     * Remove permanentemente um registo (Cliente ou Lead) do sistema.
     * @async
     * @param {Object} item - O objeto do item a apagar.
     * @param {string} type - 'client' ou 'lead'.
     */
    const handleDelete = async (item, type) => {
        if (window.confirm(t('admin.detalhes.confirm_excluir_item'))) {
            await deleteItemPermanent(token, username, type, item.id);
        }
    };

    /**
     * Altera o estado de TODOS os itens de um tipo (Clientes ou Leads) em lote.
     * @async
     * @param {string} type - 'client' ou 'lead'.
     * @param {boolean} inativar - Se deve inativar (true) ou reativar (false).
     */
    const handleToggleAll = async (type, inativar) => {

        const tipoTraduzido = type === 'client' ? t('admin_user_details.botoes_lote.label_clientes')
            : t('admin_user_details.botoes_lote.label_leads');
        const chave = inativar ? 'admin_user_details.botoes_lote.confirm_lote_inativar' : 'admin_user_details.botoes_lote.confirm_lote_reativar';

        if (window.confirm(t(chave, { tipo: tipoTraduzido, username }))) {
            await toggleAllItemsStatus(token, username, type, inativar);
        }
    };

    /**
     * Remove PERMANENTEMENTE todos os itens de um tipo pertencentes ao utilizador.
     * @async
     * @param {string} type - 'client' ou 'lead'.
     */
    const handleDeleteAll = async (type) => {
        const tipoTraduzido = type === 'client' ?
            t('admin_user_details.botoes_lote.label_clientes') : t('admin_user_details.botoes_lote.label_leads');

        if (window.confirm(t('admin_user_details.botoes_lote.confirm_lote_excluir', { tipo: tipoTraduzido }))) {
            await deleteAllItemsPermanent(token, username, type);
        }
    };

    /**
     * Inativa ou Reativa a conta do utilizador (Soft Delete/Reactivate).
     * @async
     */
    const handleToggleUserStatus = async () => {
        const chave = selectedUser.ativo ? 'admin_user_details.aviso_inativar' :
            'admin_user_details.aviso_reativar';

        if (window.confirm(t(chave, { username }))){
            if (selectedUser.ativo) await deleteUser(token, username, false);
            else await reactivateUser(token, username);
        }
    };

    /**
     * Remove o utilizador e TODOS os seus dados permanentemente da base de dados.
     * Após o sucesso, redireciona para a lista geral de utilizadores.
     * @async
     */
    const handleDeleteUserPermanent = async () => {
        if (window.confirm(t('admin_user_details.aviso_apagar'))) {
            const sucesso = await deleteUser(token, username, true);
            if (sucesso) {
                alert(t('admin.detalhes.alerta_apagar'));
                navigate('/admin');
            }
        }
    };

    return (
        <div className="admin-container" style={{ maxWidth: '1100px' }}>
            <div className="details-header">
                <h2>{t('admin_user_details.titulo')}</h2>
                <button className="btn-back" onClick={() => navigate('/admin')} style={{ marginBottom: 0 }}>
                    <i className="fa-solid fa-arrow-left"></i> {t('admin_user_details.btn_voltar')}
                </button>
            </div>

            {/* Alerta de erro caso ocorra falha na API */}
            {error && <div className="alert-message alert-error">{error}</div>}

            {/* CARTÃO DE PERFIL DO UTILIZADOR */}
            <div className="profile-detail-card">
                <div className="profile-detail-left">
                    <img src={selectedUser.fotoUrl || defaultAvatar} alt="Avatar" className="profile-detail-avatar" onError={(e) => { e.target.src = defaultAvatar; }} />
                    <div className="profile-detail-info">
                        <h3>{selectedUser.primeiroNome} {selectedUser.ultimoNome} {selectedUser.admin && <span style={{fontSize:'12px', color: '#3498db'}}><i className="fa-solid fa-crown"></i>{t('admin.detalhes.admin_tag')}</span>}</h3>
                        <div className="profile-detail-contacts">
                            <span><strong>@</strong> {username}</span>
                            <span><strong>✉️</strong> {selectedUser.email || t('admin.detalhes.sem_email')}</span>
                            <span><strong>📞</strong> {selectedUser.telefone || t('admin.detalhes.sem_telefone')}</span>
                            {/* Botão de Edição */}
                            <div style={{ marginTop: '15px' }}>
                                <button className="btn-edit-small" onClick={handleEditUser}>
                                    {t('admin_user_details.editar_dados')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACÇÕES DE CONTA: Proteção para não permitir que o admin se auto-inative */}
                <div className="profile-detail-actions">
                    {!isMe ? (
                        <>
                            <button
                                className="btn-save"
                                style={{ backgroundColor: selectedUser.ativo ? '#f39c12' : '#27ae60', justifyContent: 'center' }}
                                onClick={handleToggleUserStatus}
                            >
                                <i className={`fa-solid ${selectedUser.ativo ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                                {selectedUser.ativo ? t('admin_user_details.inativar_conta') : t('admin_user_details.reativar_conta')}
                            </button>
                            <button
                                className="btn-save-red"
                                style={{ justifyContent: 'center' }}
                                onClick={handleDeleteUserPermanent}
                            >
                                <i className="fa-solid fa-trash"></i> {t('admin_user_details.excluir_conta')}
                            </button>
                        </>
                    ) : (
                        <p style={{ color: '#666', fontSize: '14px', fontStyle: 'italic' }}>
                            {t('admin_user_details.aviso_meu_perfil')}
                        </p>
                    )}
                </div>
            </div>

            {/* LISTAGENS DE DADOS (CLIENTES E LEADS) */}
            {loadingDetails ? (
                <p className="loading-text">{t('admin_user_details.carregar_dados')}</p>
            ) : (
                <div className="data-cards-container">
                    {/* Lista de Clientes com ações administrativas unificadas */}
                    <ListClientLeadAdmin
                        title={t('menu.clients')}
                        type="client"
                        data={userClients}
                        cardClass="clients-card"
                        onEdit={(item) => clientModal.abrirParaEditar(null, item)}
                        onToggleActive={(item) => handleToggleActive(item, 'client')}
                        onDelete={(item) => handleDelete(item, 'client')}
                        onReactivateAll={() => handleToggleAll('client', false)}
                        onInactivateAll={() => handleToggleAll('client', true)}
                        onDeleteAll={() => handleDeleteAll('client')}
                    />

                    {/* Lista de Leads com suporte para filtro de estado */}
                    <ListClientLeadAdmin
                        title={t('menu.leads')}
                        type="lead"
                        data={leadsFiltradas}
                        cardClass="leads-card"
                        filterElement={filtroLeads}
                        onEdit={(item) => leadModal.abrirParaEditar(null, item)}
                        onToggleActive={(item) => handleToggleActive(item, 'lead')}
                        onDelete={(item) => handleDelete(item, 'lead')}
                        onReactivateAll={() => handleToggleAll('lead', false)}
                        onInactivateAll={() => handleToggleAll('lead', true)}
                        onDeleteAll={() => handleDeleteAll('lead')}
                    />
                </div>
            )}

            {/* MODAIS DE EDIÇÃO */}
            <FormModal isOpen={clientModal.modalAberto} type="client" initialData={clientModal.itemEmEdicao} onClose={clientModal.fecharModal} onSave={clientModal.handleSalvar} />
            <FormModal isOpen={leadModal.modalAberto} type="lead" initialData={leadModal.itemEmEdicao} onClose={leadModal.fecharModal} onSave={leadModal.handleSalvar} />
            {/* Modal de Edição de Utilizador */}
            {userModal.modalAberto && (
                <div className="modal-overlay" onClick={userModal.fecharModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{t('geral.editar')}: @{username}</h3>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            await userModal.handleSalvar(editUserData);
                            fetchUsers(token); // Recarrega a lista para mostrar a alteração
                        }} className="custom-form">
                            <div className="form-group">
                                <label>{t('geral.primeiro')}</label>
                                <input type="text" value={editUserData.primeiroNome} onChange={(e) => setEditUserData({...editUserData, primeiroNome: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>{t('geral.ultimo')}</label>
                                <input type="text" value={editUserData.ultimoNome} onChange={(e) => setEditUserData({...editUserData, ultimoNome: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>{t('geral.email')}</label>
                                <input type="email" value={editUserData.email} onChange={(e) => setEditUserData({...editUserData, email: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>{t('geral.telefone')}</label>
                                <input type="text" value={editUserData.telefone} onChange={(e) => setEditUserData({...editUserData, telefone: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>{t('geral.url')}</label>
                                <input type="text" value={editUserData.fotoUrl} onChange={(e) => setEditUserData({...editUserData, fotoUrl: e.target.value})} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={userModal.fecharModal}>{t('geral.cancelar')}</button>
                                <button type="submit" className="btn-save">{t('geral.guardar')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}