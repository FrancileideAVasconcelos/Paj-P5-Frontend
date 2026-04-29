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
    const modalProps = useFormModal(async () => {}, updateLead, token);

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
            const sucesso = await softDeleteLead(token, id);
            if (sucesso) {
                alert(t('leads.detalhes.alerta'));
                navigate('/leads');
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
                <i className="fa-solid fa-arrow-left"></i> {t('leads.detalhes.voltar')}
            </button>

            <div className="form-container">
                <h3 className="form-title">{t('leads.detalhes.titulo_pag')}</h3>
                <div className="custom-form">
                    {/* Exibição estática dos dados da Lead */}
                    <div className="form-group">
                        <label>{t('leads.detalhes.label_titulo')}</label>
                        <p className="static-data">{currentLead.titulo}</p>
                    </div>

                    <div className="form-group">
                        <label>{t('leads.detalhes.label_descricao')}</label>
                        <p className="static-data" style={{ whiteSpace: 'pre-wrap' }}>
                            {currentLead.descricao || "Sem notas adicionais."}
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
                            <i className="fa-solid fa-pen"></i> {t('leads.detalhes.btn_editar')}
                        </button>
                        <button onClick={handleRemover} className="btn-save-red">
                            <i className="fa-solid fa-trash-can"></i> {t('leads.detalhes.btn_remover')}
                        </button>
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