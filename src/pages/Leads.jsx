/**
 * @file Leads.jsx
 * @description Componente de página principal para a gestão e listagem de Oportunidades (Leads) do utilizador.
 * Permite listar dados com paginação, filtrar por estado, pesquisar e abrir o formulário de criação.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import tokenStore from '../store/tokenStore.js';
import useLeadStore from '../store/useLeadStore.js';
import { STATUS_OPTIONS } from "../utils/constants.js";
import FormModal from "../components/formModal.jsx";
import useFormModal from "../hooks/useFormModal.js";
import '../styles/ClientLead.css';
import {useTranslation} from "react-i18next";
import useUserStore from "../store/useUserStore.js";
import Pagination from "../components/Pagination.jsx";

/**
 * Componente funcional que renderiza a interface central da gestão de Leads.
 *
 * @component
 * @returns {JSX.Element} Painel com barra de ferramentas e listagem iterativa de leads.
 */
export default function Leads() {
    const navigate = useNavigate();
    const token = tokenStore((state) => state.token);
    const location = useLocation();

    const { leads, fetchLeads, addLead, updateLead, loading, totalPages } = useLeadStore();

    const modalProps = useFormModal(addLead, updateLead, token);
    const { t } = useTranslation();

    const [filtro, setFiltro] = useState(
        location.state?.filtroInicial !== undefined ? String(location.state.filtroInicial) : ""
    );

    const currentUser = useUserStore((state) => state.currentUser);
    const isAdmin = currentUser?.admin;
    const [searchTerm, setSearchTerm] = useState("");

    const [showHistory, setShowHistory] = useState(false);
    const [searchHistory, setSearchHistory] = useState(() => {
        const saved = localStorage.getItem('leadSearchHistory');
        return saved ? JSON.parse(saved) : [];
    });

    const [page, setPage] = useState(1);

    // Pesquisa automática à medida que escreve (com Debounce de 500ms)
    useEffect(() => {
        if (!token) return;

        const delayDebounceFn = setTimeout(() => {
            fetchLeads(token, filtro, searchTerm, page);
        }, 500);

        return () => clearTimeout(delayDebounceFn);

    }, [searchTerm, filtro, page, token, fetchLeads]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm, filtro]);

    /**
     * @function formatarData
     * @description Formata dados temporais provenientes do backend (array numérico ou ISO) para o padrão visual DD/MM/AAAA.
     * @param {Array|string|Date} data - O valor de data a processar.
     * @returns {string} String formatada da data.
     */
    const formatarData = (data) => {
        if (!data) return "---";
        if (Array.isArray(data)) {
            const [ano, mes, dia] = data;
            return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
        }
        return new Date(data).toLocaleDateString('pt-PT');
    };

    /**
     * Adiciona uma nova entrada de pesquisa ao histórico local e atualiza o estado, limitando a 5 entradas.
     * @param {string} term - O termo escrito pelo utilizador na caixa de pesquisa.
     */
    const handleSaveSearch = (term) => {
        if (!term.trim()) return;
        const newHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('leadSearchHistory', JSON.stringify(newHistory));
    };

    /**
     * Esvazia o histórico recente de pesquisas do utilizador nesta secção.
     */
    const clearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem('leadSearchHistory');
    };

    return (
        <div className="admin-container">
            <div className="barra-container">
                <h2>{t('leads.title')}</h2>
                <button type="button" className="btn-save" onClick={() => modalProps.abrirParaCriar({ titulo: '', descricao: '', estado: 0 })}>
                    <i className="fa-solid fa-plus"></i> {t('leads.add')}
                </button>
            </div>

            <div className="filtros" style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px', maxWidth: '400px' }}>
                    <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
                    <input
                        type="text"
                        placeholder={t('leads.pesquisa')}
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
                                         fetchLeads(token, filtro, item);
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
                <div>
                    <label>{t('leads.filtrar')}</label>
                    <select
                        value={filtro}
                        onChange={(e) => {
                            setFiltro(e.target.value);
                            fetchLeads(token, e.target.value, searchTerm);
                        }}
                        style={{ padding: '8px', marginLeft: '10px', borderRadius: '5px' }}
                    >
                        <option value="">{t('leads.filtro_todos')}</option>
                        {STATUS_OPTIONS.map((opcao) => (
                            <option key={opcao.id} value={opcao.id}>{t(opcao.key)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-state"><p>{t('leads.carregar')}</p></div>
            ) : (
                <div className="data-list">
                    {leads.map((lead) => {
                        const opcaoEstado = STATUS_OPTIONS.find(opt => String(opt.id) === String(lead.estado));

                        return (
                            <div key={lead.id} className="data-item" onClick={() => navigate(`/leads/${lead.id}`)}>
                                <div className="data-info">
                                    <div className="data-header-row" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4 className="data-title">
                                                {lead.titulo}
                                                {!lead.ativo && <span style={{ backgroundColor: '#e74c3c', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', marginLeft: '10px', verticalAlign: 'middle' }}>INATIVA</span>}
                                            </h4>
                                            <span className="data-date">{formatarData(lead.dataCriacao)}</span>
                                        </div>
                                        {isAdmin && (
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '12px', color: '#3498db', fontWeight: 'bold' }}>
                                                    {t('geral.dono')} @{lead.user?.username || '---'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <span className={`badge status-${lead.estado}`}>
                                        {opcaoEstado ? t(opcaoEstado.key) : "---"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <FormModal
                isOpen={modalProps.modalAberto}
                type="lead"
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