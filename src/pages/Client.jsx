/**
 * @file Client.jsx
 * @description Componente de página para a gestão de Clientes do utilizador.
 * Permite listar todos os clientes associados, iniciar o fluxo de criação de novos clientes
 * através de um modal e navegar para a visualização detalhada de cada registo.
 */

import { useEffect } from 'react';
import useUserStore from '../store/useUserStore.js'; // Adiciona isto
import { useNavigate } from "react-router-dom";
import tokenStore from "../store/tokenStore.js";
import useClientStore from "../store/useClientStore.js";
import FormModal from '../components/formModal.jsx';
import useFormModal from "../hooks/useFormModal.js";
import '../styles/ClientLead.css';
import {useTranslation} from "react-i18next";

/**
 * Componente funcional que renderiza a interface de gestão de clientes.
 * @component
 * @returns {JSX.Element} Painel administrativo de clientes com lista e ações.
 */
export default function Client(){
    /** @type {Function} Hook para navegação programática (ex: aceder a /clients/:id). */
    const navigate = useNavigate();

    /** @type {string|null} Token de autenticação para autorizar as chamadas à API. */
    const token = tokenStore((state) => state.token);

    // --- ESTADOS DA STORE DE CLIENTES ---
    /** @type {Object} Dados e funções de ação da store de clientes. */
    const { clients, addClient, fetchClient, updateClient, loading } = useClientStore();

    /** * Hook personalizado para gerir o estado e as funções do modal de formulário.
     * Facilita a reutilização da lógica de abertura, fecho e salvamento.
     * @type {Object}
     */
    const modalProps = useFormModal(addClient, updateClient, token);

    const { t, i18n } = useTranslation();

    const currentUser = useUserStore((state) => state.currentUser);
    const isAdmin = currentUser?.admin;

    /**
     * Efeito de carregamento inicial: Procura a lista de clientes no servidor
     * sempre que o componente é montado ou o token/função de fetch mudam.
     */
    useEffect(() => {
        if (token) fetchClient(token);
    }, [token, fetchClient]);

    return (
        <div className="admin-container">
            {/* Cabeçalho da página com título e ação de criação */}
            <div className="barra-container">
                <h2>{t('clients.title')}</h2>
                <button
                    type="button"
                    className="btn-save"
                    onClick={() => modalProps.abrirParaCriar({ nome: '', email: '', telefone: '', empresa: '' })}
                >
                    <i className="fa-solid fa-plus"></i>{t('clients.add')}
                </button>
            </div>

            {/* Renderização condicional: Exibe feedback de carregamento ou a lista de clientes */}
            {loading ? (
                <div className="loading-state"><p>{t('clients.carregar')}</p></div>
            ) : (
                <div className="data-list">
                    {/* Mapeia o array de clientes para gerar os itens clicáveis da lista */}
                    {clients.map((client) => (
                        <div key={client.id} className="data-item" onClick={() => navigate(`/clients/${client.id}`)}>
                            <div className="data-info">
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <h4 className="data-title">
                                        {client.nome}
                                        {!client.ativo && <span style={{ backgroundColor: '#e74c3c', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', marginLeft: '10px', verticalAlign: 'middle' }}>INATIVO</span>}
                                    </h4>
                                    {/* SE FOR ADMIN, MOSTRA O DONO */}
                                    {isAdmin && (
                                        <span style={{ fontSize: '12px', color: '#3498db', fontWeight: 'bold' }}>
                                            Dono: @{client.dono}
                                        </span>
                                    )}
                                </div>
                                <p>{client.empresa}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de formulário unificado para criação e edição de clientes */}
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