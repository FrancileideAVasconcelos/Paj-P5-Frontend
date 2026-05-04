/**
 * @file ListClientLeadAdmin.jsx
 * @description Componente reutilizável para exibir cartões de resumo e gráficos de Clientes ou Leads.
 * Utilizado no painel de detalhes do administrador para gerir dados de utilizadores específicos em lote.
 */

import '../../styles/Admin.css'
import React, { useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { STATUS_OPTIONS } from "../../utils/constants.js";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Componente funcional que renderiza um cartão de dados com métricas e ações em lote.
 *
 * @component
 * @param {Object} props - Propriedades passadas ao componente.
 * @param {string} props.title - Título do cartão (ex: "Clientes" ou "Leads").
 * @param {string} props.type - Tipo de dados a processar ('client' ou 'lead').
 * @param {Array} props.data - Lista de registos a apresentar/analisar.
 * @param {string} [props.cardClass] - Classe CSS opcional para personalização do cartão.
 * @param {JSX.Element} [props.filterElement] - Elemento JSX opcional para filtragem (ex: Select).
 * @param {Function} props.onReactivateAll - Função disparada ao clicar no botão de reativar tudo.
 * @param {Function} props.onInactivateAll - Função disparada ao clicar no botão de inativar tudo.
 * @param {Function} props.onDeleteAll - Função disparada ao clicar no botão de apagar tudo.
 * @returns {JSX.Element} Cartão contendo um resumo numérico (para clientes) ou gráfico circular (para leads).
 */
export default function ListClientLeadAdmin({
                                                title, type, data, cardClass, filterElement,
                                                onReactivateAll, onInactivateAll, onDeleteAll
                                            }) {

    const { t } = useTranslation();

    /**
     * @type {Array}
     * @description Lógica para agrupar as Leads por estado e preparar a estrutura de dados para o Recharts.
     * Só é executada se o tipo de cartão for 'lead' e se existirem dados.
     */
    const leadsAgrupadas = useMemo(() => {
        if (type !== 'lead' || !data || data.length === 0) return [];

        const contagem = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };

        data.forEach(l => {
            contagem[l.estado] = (contagem[l.estado] || 0) + 1;
        });

        return STATUS_OPTIONS.map(opt => ({
            name: t(opt.key),
            value: contagem[opt.id] || 0,
            color: opt.id === 0 ? '#3b82f6' : opt.id === 1 ? '#f59e0b' : opt.id === 2 ? '#8b5cf6' : opt.id === 3 ? '#10b981' : '#ef4444'
        })).filter(item => item.value > 0);
    }, [data, type, t]);

    return (
        <div className={`data-card ${cardClass || ''}`}>
            {/* CABEÇALHO DO CARTÃO: Título, filtro e ações em lote */}
            <div className="data-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3>{title} ({data?.length || 0})</h3>
                    {filterElement}
                </div>

                <div className="data-card-actions">
                    <button className="icon-btn green-btn" title={t('admin_user_details.lista.reativar_todos')} onClick={onReactivateAll} ><i className="fa-solid fa-folder-open"></i></button>
                    <button className="icon-btn orange-btn" title={t('admin_user_details.lista.inativar_todos')} onClick={onInactivateAll}><i className="fa-solid fa-ban"></i></button>
                    <button className="icon-btn red-btn" title={t('admin_user_details.lista.excluir_todos')} onClick={onDeleteAll}><i className="fa-solid fa-fire"></i></button>
                </div>
            </div>

            {/* CONTEÚDO DO CARTÃO: Gráficos e Resumos */}
            <div className="data-card-content">
                {(!data || data.length === 0) ? (
                    <p className="empty-text">{t('admin_user_details.lista.vazia', { tipo: title.toLowerCase() })}</p>
                ) : (
                    <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '250px' }}>

                        {/* SE FOR CLIENTE: Mostra um cartão resumo mais elegante e contido */}
                        {type === 'client' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '30px 20px', width: '100%', maxWidth: '220px', margin: '0 auto' }}>
                                <div style={{ backgroundColor: '#e0f2fe', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                                    <i className="fa-solid fa-users" style={{ fontSize: '22px', color: '#0ea5e9' }}></i>
                                </div>
                                <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', lineHeight: '1', marginBottom: '5px' }}>
                                    {data.length}
                                </span>
                                <span style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                                    Total de Clientes
                                </span>
                            </div>
                        ) : (
                            /* SE FOR LEAD: Mostra o Gráfico Circular */
                            <div style={{ width: '100%', minHeight: '250px', display: 'flex', justifyContent: 'center' }}>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={leadsAgrupadas}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {leadsAgrupadas.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip borderRadius={8} />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}