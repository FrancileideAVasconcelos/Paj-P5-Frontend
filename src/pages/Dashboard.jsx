import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import tokenStore from "../store/tokenStore.js";
import useUserStore from "../store/useUserStore.js";
import { api } from "../services/api.js";
import { useTranslation } from "react-i18next";
import { STATUS_OPTIONS} from "../utils/constants.js";
import '../styles/Dashboard.css';

import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell,
    PieChart, Pie, Legend, ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const mensagemErro = location.state?.erro;

    const token = tokenStore((state) => state.token);
    const { t } = useTranslation();
    const { currentUser, fetchCurrentUser } = useUserStore();

    const [stats, setStats] = useState(null);

    const [chartHeight, setChartHeight] = useState(320);

    useEffect(() => {
        const updateHeight = () => {
            if (window.innerWidth <= 480) setChartHeight(180);
            else if (window.innerWidth <= 768) setChartHeight(220);
            else setChartHeight(320);
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    useEffect(() => {
        if (token && !currentUser) fetchCurrentUser(token);
    }, [token, currentUser, fetchCurrentUser]);

    useEffect(() => {
        if (token) {
            api.get('/dashboard/stats')
                .then(res => setStats(res))
                .catch(console.error);
        }
    }, [token]);

    const isAdmin = currentUser?.admin === true;

    // --- FORMATAÇÃO DOS DADOS PARA OS GRÁFICOS --- //
    const CORES_TARTE = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

    // 1. Leads por Estado (Tarte)
    // 1. Leads por Estado (Tarte)
    const dadosLeadsPorEstado = useMemo(() => {
        if (!stats || !stats.leadsPorEstado) return [];

        const resultado = [];
        // O Java manda um mapa { "0": 10, "1": 5 }, vamos convertê-lo para o que o Recharts precisa
        Object.entries(stats.leadsPorEstado).forEach(([estadoIdStr, quantidade]) => {
            const estadoId = Number(estadoIdStr);
            const nomeEstado = STATUS_OPTIONS[estadoId]
                ? t(STATUS_OPTIONS[estadoId].key)
                : `${t('leads.detalhes.estado')} ${estadoId}`;

            resultado.push({ id: estadoId, name: nomeEstado, value: quantidade });
        });

        return resultado;
    }, [stats, t]);

    // 2. Evolução Combinada (Leads + Utilizadores no mesmo gráfico!)
    const evolucaoCombinadaData = useMemo(() => {
        if (!stats) return [];
        const mapaDatas = {};

        if (stats.evolucaoLeads) {
            Object.entries(stats.evolucaoLeads).forEach(([data, qtd]) => {
                mapaDatas[data] = { data, leads: qtd, users: 0 };
            });
        }

        if (stats.evolucaoUtilizadores) {
            Object.entries(stats.evolucaoUtilizadores).forEach(([data, qtd]) => {
                if (!mapaDatas[data]) {
                    mapaDatas[data] = { data, leads: 0, users: 0 };
                }
                mapaDatas[data].users = qtd;
            });
        }

        return Object.values(mapaDatas).sort((a, b) => a.data.localeCompare(b.data));
    }, [stats]);

    // 3. Leads por Utilizador (Top 5 gerado no Backend)
    const leadsPorUserData = useMemo(() => {
        if (!stats?.leadsPorUtilizador) return [];
        return Object.entries(stats.leadsPorUtilizador).map(([name, quantidade]) => ({ name, quantidade }));
    }, [stats]);


    if (!stats) return <p style={{padding: '20px', textAlign: 'center'}}>{t('dashboard.a_carregar')}</p>;

    return (
        <div>
            {mensagemErro && (
                <div className="alert-error" style={{ color: 'red', padding: '15px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', marginBottom: '20px' }}>
                    <strong><i className="fa-solid fa-triangle-exclamation"></i> {t('dashboard.aviso')} :</strong> {mensagemErro}
                </div>
            )}

            <div className="dashboard-container">
                <h2 className="dashboard-title">
                    {t('dashboard.title')}
                </h2>

                {/* --- CARTÕES SUPERIORES --- */}
                <div className={`stats-grid ${isAdmin ? 'admin-grid' : 'user-grid'}`}>
                    <div className="stat-card clickable" onClick={() => navigate('/leads')}>
                        <div className="stat-icon"><i className="fa-solid fa-bullseye" style={{color: '#0ea5e9'}}></i></div>
                        <div><h3>{t('dashboard.total_leads')}</h3><p className="stat-number">{stats.totalLeads}</p></div>
                    </div>

                    <div className="stat-card clickable" onClick={() => navigate('/client')}>
                        <div className="stat-icon"><i className="fa-solid fa-users" style={{color: '#10b981'}}></i></div>
                        <div><h3>{t('dashboard.total_clients')}</h3><p className="stat-number">{stats.totalClients}</p></div>
                    </div>

                    {isAdmin && (
                        <>
                            <div className="stat-card clickable" onClick={() => navigate('/admin')}>
                                <div className="stat-icon"><i className="fa-solid fa-users-gear" style={{color: '#8b5cf6'}}></i></div>
                                <div><h3>{t('dashboard.total_utilizadores')}</h3><p className="stat-number">{stats.totalUsers}</p></div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon"><i className="fa-solid fa-user-check" style={{color: '#f59e0b'}}></i></div>
                                <div><h3>{t('dashboard.contas_ativas')}</h3><p className="stat-number">{stats.contasConfirmadas}</p></div>
                            </div>
                        </>
                    )}
                </div>

                {/* --- GRELHA SUPERIOR DE GRÁFICOS (Tarte e Bolinhas ficam lado a lado) --- */}
                <div className="charts-grid">

                    {/* GRÁFICO 1: Leads por Estado (Tarte) */}
                    <div className="chart-card">
                        <h3><i className="fa-solid fa-chart-pie"></i> {t('dashboard.distribuicao_leads')}</h3>
                        <div className="chart-wrapper" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {dadosLeadsPorEstado.length > 0 ? (
                                <>
                                    <PieChart width={300} height={220}>
                                        <Pie
                                            data={dadosLeadsPorEstado}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={95}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                            style={{ cursor: 'pointer' }}
                                            onClick={(entry) => {
                                                // entry contém os dados da fatia clicada (incluindo o nosso 'id')
                                                navigate('/leads', { state: { filtroInicial: entry.id } });
                                            }}
                                        >
                                            {dadosLeadsPorEstado.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CORES_TARTE[index % CORES_TARTE.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip borderRadius={8} />
                                    </PieChart>

                                    {/* Legenda manual fora do PieChart */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 16px', paddingTop: '8px' }}>
                                        {dadosLeadsPorEstado.map((entry, index) => (
                                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                            <span style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: CORES_TARTE[index % CORES_TARTE.length],
                                flexShrink: 0
                            }} />
                                                {entry.name}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '100px' }}>
                                    {t('dashboard.sem_dados')}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* GRÁFICO 2: Leads por Utilizador (BARRAS) - Fica na grelha ao lado da Tarte para Admins */}
                    {isAdmin && (
                        <div className="chart-card">
                            <h3><i className="fa-solid fa-chart-column"></i> {t('dashboard.leads_user')}</h3>
                            <div className="chart-wrapper" style={{ width: '100%', height: '300px', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
                                {leadsPorUserData.length > 0 ? (
                                    <BarChart width={450} height={280} data={leadsPorUserData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                                        <YAxis allowDecimals={false} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                                        <RechartsTooltip cursor={{fill: '#f1f5f9'}} borderRadius={8} />

                                        <Bar dataKey="quantidade" name={t('dashboard.tooltip_qtd')} fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />                                    </BarChart>
                                ) : (<p style={{color: '#94a3b8', textAlign: 'center', marginTop: '100px'}}>{t('dashboard.sem_lead')}</p>)}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- GRÁFICO INFERIOR DE LARGURA TOTAL (Evolução Temporal) --- */}
                <div className="chart-card" style={{ marginTop: '20px' }}>
                    <h3><i className="fa-solid fa-chart-line"></i>{t('dashboard.evolucao_temporal')}</h3>
                    {/* A altura é definida aqui, e o ResponsiveContainer preenche 100% */}
                    <div className="chart-wrapper" style={{ width: '100%', height: '350px' }}>
                        {evolucaoCombinadaData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={chartHeight}>
                                <LineChart data={evolucaoCombinadaData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="data" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                                    <YAxis allowDecimals={false} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                                    <RechartsTooltip borderRadius={8} />
                                    <Legend verticalAlign="bottom" height={36} iconType="plainline" />

                                    <Line type="monotone" name={t('dashboard.tooltip_leads')} dataKey="leads" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 6 }} />

                                    {isAdmin && (
                                        <Line type="monotone" name={t('dashboard.tooltip_users')} dataKey="users" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (<p style={{color: '#94a3b8', textAlign: 'center', marginTop: '120px'}}>{t('dashboard.sem_historico')}</p>)}
                    </div>
                </div>

            </div>
        </div>
    );
}