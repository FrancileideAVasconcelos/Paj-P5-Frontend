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
import useUserStore from '../store/useUserStore.js';
import { AdminService } from '../services/api.js';

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

    const currentUser = useUserStore((state) => state.currentUser);
    const isAdmin = currentUser?.admin;

    const modalProps = useFormModal(
        async () => {},
        async (t, id, data) => {
            if (isAdmin) {
                try {
                    await AdminService.editClient(id, data);
                    fetchClientById(token, id);
                    return true;
                } catch (e) {
                    console.error(e);
                    return false;
                }
            } else {
                return await updateClient(t, id, data);
            }
        },
        token
    );
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
            if (isAdmin) {
                try {
                    // O Admin usa a rota de toggleItemStatus que já faz o soft delete (permanente=false)
                    await AdminService.toggleItemStatus('client', id, true);
                    alert(t('clients.detalhes.alerta'));
                    navigate('/client');
                } catch (error) {
                    alert("Erro ao inativar cliente.");
                }
            } else {
                // Utilizadores normais usam o método da store
                const sucesso = await softDeleteClient(token, id);
                if (sucesso) {
                    alert(t('clients.detalhes.alerta'));
                    navigate('/client');
                }
            }
        }
    };

    const handleDeletePermanent = async () => {
        if (window.confirm("Tem a certeza absoluta que deseja apagar este Cliente PERMANENTEMENTE?")) {
            try {
                await AdminService.deleteItemPermanent('client', id);
                alert("Cliente apagado permanentemente!");
                navigate(-1);
            } catch (e) {
                alert("Erro ao apagar cliente.");
            }
        }
    };

    const handleReativar = async () => {
        if (window.confirm("Deseja reativar este Cliente?")) {
            try {
                // Passa 'false' porque a API toggleItemStatus recebe 'isAtivo' (que é falso atualmente)
                await AdminService.toggleItemStatus('client', id, false);
                alert("Cliente reativado com sucesso!");
                fetchClientById(token, id); // Atualiza os dados no ecrã sem mudar de página
            } catch (error) {
                alert("Erro ao reativar cliente.");
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
                    {isAdmin && (
                        <div className="form-group" style={{ borderBottom: '2px dashed #e2e8f0', paddingBottom: '15px', marginBottom: '15px' }}>
                            <label style={{ color: '#3498db' }}><i className="fa-solid fa-crown"></i> Dono do Registo (Utilizador)</label>
                            <p className="static-data" style={{ fontWeight: 'bold' }}>@{currentClient.dono}</p>
                        </div>
                    )}

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

                    <div className="form-actions">
                        <button onClick={(e) => modalProps.abrirParaEditar(e, currentClient)} className="btn-save">
                            <i className="fa-solid fa-pen"></i> {t('clients.detalhes.editar')}
                        </button>

                        {isAdmin ? (
                            <>
                                {currentClient.ativo ? (
                                    <button onClick={handleRemover} className="btn-save-red" style={{ backgroundColor: '#f39c12' }}>
                                        <i className="fa-solid fa-ban"></i> Inativar Cliente
                                    </button>
                                ) : (
                                    <button onClick={handleReativar} className="btn-save" style={{ backgroundColor: '#27ae60' }}>
                                        <i className="fa-solid fa-folder-open"></i> Reativar Cliente
                                    </button>
                                )}
                                <button onClick={handleDeletePermanent} className="btn-save-red">
                                    <i className="fa-solid fa-fire"></i> Apagar Permanente
                                </button>
                            </>
                        ) : (
                            <button onClick={handleRemover} className="btn-save-red">
                                <i className="fa-solid fa-trash-can"></i> {t('clients.detalhes.remover')}
                            </button>
                        )}
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