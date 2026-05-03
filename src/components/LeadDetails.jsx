/**
 * @file LeadDetails.jsx
 * @description Componente de página para visualização detalhada de uma Lead específica.
 * Permite consultar informações completas, editar dados através de um modal e
 * realizar a remoção lógica (inativação) do registo.
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLeadStore from '../store/useLeadStore.js';
import tokenStore from '../store/tokenStore.js';
import { STATUS_OPTIONS } from '../utils/constants.js';
import useFormModal from "../hooks/useFormModal.js";
import FormModal from "./formModal.jsx";
import '../styles/ClientLead.css';
import {useTranslation} from "react-i18next";
import useUserStore from '../store/useUserStore.js'; // PARA SABER SE É ADMIN
import { AdminService } from '../services/api.js'; // PARA FAZER CHAMADAS DE ADMIN

/**
 * Componente funcional que exibe os detalhes de uma Lead.
 * @component
 * @returns {JSX.Element} Interface de detalhes com ações de edição e remoção.
 */
export default function LeadDetails() {
    /** @type {string} ID da lead extraído dos parâmetros da URL. */
    const { id } = useParams();

    const { t, i18n } = useTranslation();

    /** @type {Function} Hook para navegação entre rotas. */
    const navigate = useNavigate();

    /** @type {string|null} Token de autenticação para autorizar pedidos à API. */
    const token = tokenStore((state) => state.token);

    // --- ESTADO DA STORE DE LEADS ---
    /** @type {Object} Dados da lead atual e funções de manipulação provenientes da store. */
    const { currentLead, fetchLeadById, updateLead, softDeleteLead, loading } = useLeadStore();

    /** * Hook personalizado para gerir o modal de edição.
     * @type {Object}
     * @property {Function} abrirParaEditar - Prepara o modal com os dados da lead atual.
     */

    const currentUser = useUserStore((state) => state.currentUser);
    const isAdmin = currentUser?.admin;

    /**
     * Efeito de carregamento: Procura os detalhes da lead no servidor
     * sempre que o ID ou o token de autenticação mudarem.
     */
    useEffect(() => {
        if (token && id) fetchLeadById(token, id);
    }, [token, id, fetchLeadById]);

    /**
     * Gere o processo de remoção da lead.
     * Exibe uma confirmação nativa e, em caso de sucesso, redireciona o utilizador para a listagem global.
     * @async
     * @function handleRemover
     * @returns {Promise<void>}
     */
    const handleRemover = async () => {
        if (window.confirm(t('leads.detalhes.confirm_remover'))) {
            if (isAdmin) {
                try {
                    // O Admin usa a rota de toggleItemStatus que já faz o soft delete (permanente=false)
                    await AdminService.toggleItemStatus('lead', id, true);
                    alert(t('leads.detalhes.alerta'));
                    navigate('/leads');
                } catch (error) {
                    alert(t('lead.detalhes.erro'));
                }
            } else {
                // Utilizadores normais usam o método da store
                const sucesso = await softDeleteLead(token, id);
                if (sucesso) {
                    alert(t('leads.detalhes.alerta'));
                    navigate('/leads');
                }
            }
        }
    };

    // --- HOOK DO MODAL (Inteligente) ---
    // Se for Admin, chama a API de Admin (que aceita editar leads dos outros)
    // Se for User Normal, usa a função normal da Store
    const modalProps = useFormModal(
        async () => {},
        async (t, id, data) => {
            if (isAdmin) {
                try {
                    await AdminService.editLead(id, data);
                    // Atualiza a lead no ecrã após o admin a editar
                    fetchLeadById(token, id);
                    return true;
                } catch (e) {
                    console.error(e);
                    return false;
                }
            } else {
                return await updateLead(t, id, data);
            }
        },
        token
    );

    // --- FUNÇÃO PARA APAGAR PERMANENTEMENTE (SÓ ADMIN) ---
    const handleDeletePermanent = async () => {
        if (window.confirm(t('admin_users_details.aviso_apagar_lead'))) {
            try {
                await AdminService.deleteItemPermanent('lead', id);
                alert(t('admin_users_details.alerta_lead_apagada'));
                navigate(-1); // Volta para trás
            } catch (e) {
                alert(t('admin_user_details.erro_apagar_lead_permanente'));
            }
        }
    };

    const handleReativar = async () => {
        if (window.confirm(t('admin_user_details.aviso_reativar_lead'))) {
            try {
                await AdminService.toggleItemStatus('lead', id, false);
                alert(t('admin_user_details.alerta_lead_reativada'));
                fetchLeadById(token, id);
            } catch (error) {
                alert(t('admin_user_details.errp_reativar_lead'));
            }
        }
    };

    // --- RENDERIZAÇÃO CONDICIONAL DE ESTADOS DE CARREGAMENTO E ERRO ---
    if (loading) return <div className="loading-state"><p>{t('leads.detalhes.carregar')}</p></div>;
    if (!currentLead) return <div className="no-data"><p>{t('leads.detalhes.lead_n_encontrada')}</p></div>;

    return (
        <div className="admin-container">
            {/* Botão de navegação para retornar à listagem de leads */}
            <button className="btn-back" onClick={() => navigate('/leads')}>
                <i className="fa-solid fa-arrow-left"></i> {t('geral.voltar')}
            </button>

            <div className="form-container">
                <h3 className="form-title">{t('leads.detalhes.titulo_pag')}</h3>
                <div className="custom-form">
                    {isAdmin && (
                        <div className="form-group" style={{ borderBottom: '2px dashed #e2e8f0', paddingBottom: '15px', marginBottom: '15px' }}>
                            <label style={{ color: '#3498db' }}><i className="fa-solid fa-crown"></i> {t('geral.dono')}</label>
                            <p className="static-data" style={{ fontWeight: 'bold' }}>@{currentLead.user?.username || '---'}</p>
                        </div>
                    )}

                    <div className="form-group">
                        <label>{t('leads.detalhes.titulo')}</label>
                        <p className="static-data" style={{ whiteSpace: 'pre-wrap' }}>
                            {currentLead.titulo}
                        </p>
                    </div>

                    <div className="form-group">
                        <label>{t('leads.detalhes.descricao')}</label>
                        <p className="static-data" style={{ whiteSpace: 'pre-wrap' }}>
                            {currentLead.descricao || t('leads.detalhes.sem_notas')}
                        </p>
                    </div>

                    <div className="form-group">
                        <label>{t('leads.detalhes.estado')}</label>
                        <div className="static-data-badge">
                            {/* Usamos o .find() para encontrar o objeto correto pelo ID numérico */}
                            <span className={`badge status-${currentLead.estado}`}>
                            {t(STATUS_OPTIONS.find(opt => opt.id === currentLead.estado)?.key || '---')}
                        </span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{t('leads.detalhes.label_data')}</label>
                        <p className="static-data">
                            {new Date(currentLead.dataCriacao).toLocaleDateString('pt-PT')}
                        </p>
                    </div>

                    {/* Ações de Gestão da Lead */}
                    <div className="form-actions">
                        <button onClick={(e) => modalProps.abrirParaEditar(e, currentLead)} className="btn-save">
                            <i className="fa-solid fa-pen"></i> {t('geral.editar')}
                        </button>

                        {isAdmin ? (
                            <>
                                {currentLead.ativo ? (
                                    <button onClick={handleRemover} className="btn-save-red" style={{ backgroundColor: '#f39c12' }}>
                                        <i className="fa-solid fa-ban"></i> {t('admin_user_details.lista.inativar')}
                                    </button>
                                ) : (
                                    <button onClick={handleReativar} className="btn-save" style={{ backgroundColor: '#27ae60' }}>
                                        <i className="fa-solid fa-folder-open"></i> {t('admin_user_details.lista.reativar')}
                                    </button>
                                )}
                                <button onClick={handleDeletePermanent} className="btn-save-red">
                                    <i className="fa-solid fa-fire"></i> {t('admin_user_details.lista.excluir')}
                                </button>
                            </>
                        ) : (
                            /* Se for User Normal, mostra só o botão normal de remover (soft delete) */
                            <button onClick={handleRemover} className="btn-save-red">
                                <i className="fa-solid fa-trash-can"></i> {t('geral.remover')}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de formulário para edição de leads */}
            <FormModal
                isOpen={modalProps.modalAberto}
                type="lead"
                initialData={modalProps.itemEmEdicao}
                onClose={modalProps.fecharModal}
                onSave={modalProps.handleSalvar}
            />
        </div>
    );
}