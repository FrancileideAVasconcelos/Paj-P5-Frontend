/**
 * @file ClientDetails.jsx
 * @description Componente de página para a visualização detalhada de um Cliente específico.
 * Permite consultar as informações de contacto e empresa, editar os dados através de um modal
 * e realizar a remoção lógica (inativação) do cliente.
 */

import { useNavigate, useParams } from "react-router-dom";
import useClientStore from "../store/useClientStore.js";
import tokenStore from "../store/tokenStore.js";
import { useEffect } from "react";
import FormModal from "./formModal.jsx";
import useFormModal from "../hooks/useFormModal.js";
import '../styles/ClientLead.css';
import {useTranslation} from "react-i18next";

/**
 * Componente funcional que exibe os detalhes de um Cliente.
 * @component
 * @returns {JSX.Element} Interface de detalhes com visualização estática e ações de gestão.
 */
export default function ClientDetails() {
    /** @type {string} ID do cliente extraído dos parâmetros da URL. */
    const { id } = useParams();

    /** @type {Function} Hook para navegação entre rotas do sistema. */
    const navigate = useNavigate();

    /** @type {string|null} Token de autenticação para autorizar pedidos à API. */
    const token = tokenStore((state) => state.token);

    const { t, i18n } = useTranslation();

    // --- ESTADO DA STORE DE CLIENTES ---
    /** @type {Object} Dados do cliente atual e funções de manipulação provenientes da store. */
    const { currentClient, fetchClientById, softDeleteClient, updateClient, loading } = useClientStore();

    /** * Hook personalizado para gerir o modal de edição de clientes.
     * @type {Object}
     * @property {Function} abrirParaEditar - Prepara o modal com os dados do cliente carregado.
     */
    const modalProps = useFormModal(async () => {}, updateClient, token);

    /**
     * Efeito de carregamento: Procura os detalhes do cliente no servidor
     * sempre que o ID ou o token de autenticação mudarem.
     */
    useEffect(() => {
        if (token && id) fetchClientById(token, id);
    }, [token, id, fetchClientById]);

    /**
     * Gere a remoção do cliente do sistema.
     * Exibe uma confirmação ao utilizador e, em caso de sucesso, redireciona para a listagem de clientes.
     * @async
     * @function handleRemover
     * @returns {Promise<void>}
     */
    const handleRemover = async () => {
        if (window.confirm(t('clients.detalhes.confirm_remover'))){
            const sucesso = await softDeleteClient(token, id);
            if (sucesso) {
                alert(t('clients.detalhes.alerta'));
                navigate('/client');
            }
        }
    };

    // --- RENDERIZAÇÃO CONDICIONAL DE ESTADOS DE CARREGAMENTO E ERRO ---
    if (loading) return <div className="loading-state"><p>{t('clients.detalhes.carregar_detalhes')}</p></div>;
    if (!currentClient) return <div className="no-data"><p>{t('cliente.detalhes.cliente_n_encontrado')}</p></div>;

    return (
        <div className="admin-container">
            {/* Botão para retroceder no histórico de navegação */}
            <button onClick={() => navigate(-1)} className="btn-back">
                <i className="fa-solid fa-arrow-left"></i>{t('clients.detalhes.voltar')}
            </button>

            <div className="form-container">
                <h3 className="form-title">{t('clients.detalhes.titulo')}</h3>
                <div className="custom-form">
                    {/* Exibição dos dados do Cliente em formato estático */}
                    <div className="form-group">
                        <label>{t('clients.detalhes.nome')}</label>
                        <p className="static-data">{currentClient.nome}</p>
                    </div>

                    <div className="form-group">
                        <label>{t('clients.detalhes.email_contacto')}</label>
                        <p className="static-data">{currentClient.email}</p>
                    </div>

                    <div className="form-group">
                        <label>{t('clients.detalhes.telefone')}</label>
                        <p className="static-data">{currentClient.telefone}</p>
                    </div>

                    <div className="form-group">
                        <label>{t('clients.detalhes.empresa')}</label>
                        <p className="static-data">{currentClient.empresa}</p>
                    </div>

                    {/* Ações de Gestão do Cliente */}
                    <div className="form-actions">
                        <button onClick={(e) => modalProps.abrirParaEditar(e, currentClient)} className="btn-save">
                            <i className="fa-solid fa-pen"></i> {t('clients.detalhes.editar')}
                        </button>
                        <button onClick={handleRemover} className="btn-save-red">
                            <i className="fa-solid fa-trash-can"></i> {t('clients.detalhes.remover')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de formulário configurado para o tipo 'client' */}
            <FormModal
                isOpen={modalProps.modalAberto}
                type="client"
                initialData={modalProps.itemEmEdicao}
                onClose={modalProps.fecharModal}
                onSave={modalProps.handleSalvar}
            />
        </div>
    );
}