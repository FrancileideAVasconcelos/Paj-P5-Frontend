/**
 * @file Client.jsx
 * @description Componente de página para a gestão de Clientes do utilizador.
 * Permite listar todos os clientes associados, pesquisar, adicionar através de um modal
 * e navegar para a visualização detalhada de cada registo.
 */

import {useEffect, useState} from 'react';
import useUserStore from '../store/useUserStore.js';
import { useNavigate } from "react-router-dom";
import tokenStore from "../store/tokenStore.js";
import useClientStore from "../store/useClientStore.js";
import FormModal from '../components/formModal.jsx';
import useFormModal from "../hooks/useFormModal.js";
import '../styles/ClientLead.css';
import {useTranslation} from "react-i18next";
import Pagination from "../components/Pagination.jsx";

/**
 * Componente funcional que renderiza a interface principal de gestão de clientes.
 *
 * @component
 * @returns {JSX.Element} Painel administrativo de clientes com listagem, paginação e ações.
 */
export default function Client(){
    const navigate = useNavigate();
    const token = tokenStore((state) => state.token);

    const { clients, addClient, fetchClient, updateClient, loading, totalPages } = useClientStore();

    const modalProps = useFormModal(addClient, updateClient, token);
    const { t, i18n } = useTranslation();

    const currentUser = useUserStore((state) => state.currentUser);
    const isAdmin = currentUser?.admin;
    const [searchTerm, setSearchTerm] = useState("");

    const [showHistory, setShowHistory] = useState(false);
    const [searchHistory, setSearchHistory] = useState(() => {
        const saved = localStorage.getItem('clientSearchHistory');
        return saved ? JSON.parse(saved) : [];
    });

    const [page, setPage] = useState(1);

    // Pesquisa automática à medida que escreve (com Debounce de 500ms)
    useEffect(() => {
        if (!token) return;

        const delayDebounceFn = setTimeout(() => {
            fetchClient(token, searchTerm, page);
        }, 500);

        return () => clearTimeout(delayDebounceFn);

    }, [searchTerm, page, token, fetchClient]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    /**
     * Guarda o termo de pesquisa no histórico local do navegador para futuras sugestões.
     * @param {string} term - Termo pesquisado.
     */
    const handleSaveSearch = (term) => {
        if (!term.trim()) return;
        const newHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('clientSearchHistory', JSON.stringify(newHistory));
    };

    /**
     * Limpa o histórico de pesquisa de clientes do LocalStorage.
     */
    const clearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem('clientSearchHistory');
    };

    return (
        <div className="admin-container">
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
            <div className="filtros" style={{ marginBottom: '25px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                    <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
                    <input
                        type="text"
                        placeholder={t('clients.pesquisa')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setShowHistory(true)}
                        onBlur={() => setShowHistory(false)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSaveSearch(searchTerm);
                                setShowHistory(false);
                            }
                        }}
                        style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }}
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
                                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Histórico</span>
                                <span onMouseDown={(e) => { e.preventDefault(); clearHistory(); }} style={{ fontSize: '12px', color: '#ef4444', cursor: 'pointer' }}>Limpar</span>
                            </div>
                            {searchHistory.map((item, idx) => (
                                <div key={idx}
                                     onMouseDown={(e) => {
                                         e.preventDefault();
                                         setSearchTerm(item);
                                         handleSaveSearch(item);
                                         setShowHistory(false);
                                         fetchClient(token, item);
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

            {loading ? (
                <div className="loading-state"><p>{t('clients.carregar')}</p></div>
            ) : (
                <div className="data-list">
                    {clients.map((client) => (
                        <div key={client.id} className="data-item" onClick={() => navigate(`/clients/${client.id}`)}>
                            <div className="data-info">
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <h4 className="data-title">
                                        {client.nome}
                                        {!client.ativo && <span style={{ backgroundColor: '#e74c3c', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', marginLeft: '10px', verticalAlign: 'middle' }}>{t('admin_user_details.lista.inativo')}</span>}
                                    </h4>
                                    {isAdmin && (
                                        <span style={{ fontSize: '12px', color: '#3498db', fontWeight: 'bold' }}>
                                            {t('geral.dono')} @{client.dono}
                                        </span>
                                    )}
                                </div>
                                <p>{client.empresa}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <FormModal
                isOpen={modalProps.modalAberto}
                type="client"
                initialData={modalProps.itemEmEdicao}
                onClose={modalProps.fecharModal}
                onSave={modalProps.handleSalvar}
            />

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                loading={loading}
            />
        </div>
    );
}