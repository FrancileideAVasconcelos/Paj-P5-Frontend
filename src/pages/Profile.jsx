/**
 * @file Profile.jsx
 * @description Componente de página para visualização e edição do perfil do utilizador.
 * Implementa uma lógica de segurança rigorosa que exige a password atual para qualquer alteração de dados.
 */

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore.js';
import tokenStore from '../store/tokenStore.js';
import {useTranslation} from "react-i18next";
import { api } from '../services/api.js';
import { STATUS_OPTIONS } from '../utils/constants.js';
import '../styles/Profile.css';

import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Componente funcional que gere o formulário de perfil.
 * * @component
 * @returns {JSX.Element} O painel de perfil com campos de dados pessoais e segurança.
 */
export default function Profile() {
    /** @type {Function} Hook para redirecionamento (ex: caso o token expire). */
    const navigate = useNavigate();
    /** @type {string|null} Token de sessão obtido da store de autenticação. */
    const token = tokenStore((state) => state.token);

    const { t, i18n } = useTranslation();

    // --- ESTADO GLOBAL (Zustand) ---
    const {
        currentUser,
        fetchCurrentUser,
        updateUserProfile,
        checkCurrentPassword,
        loading
    } = useUserStore();

    /**
     * Estado local para os campos de texto do formulário.
     * @type {Object}
     */
    const [formData, setFormData] = useState({
        primeiroNome: '',
        ultimoNome: '',
        email: '',
        telefone: '',
        fotoUrl: '',
        password: '',
        username: ''
    });

    /**
     * Estado para mensagens de feedback ao utilizador (sucesso ou erro).
     * @type {Object}
     * @property {string} texto - Conteúdo da mensagem.
     * @property {string} tipo - Categoria da mensagem ('sucesso', 'erro', 'info').
     */
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    /**
     * Estado específico para a lógica de alteração de passwords.
     * @type {Object}
     */
    const [passwords, setPasswords] = useState({
        atual: '', nova: '', confirmar: ''
    });

    const [stats, setStats] = useState(null);

    const [chartHeight, setChartHeight] = useState(320);


    /**
     * Efeito inicial: Verifica autenticação e carrega dados do utilizador se necessário.
     */
    useEffect(() => {
        if (!token) navigate('/login');
        if (!currentUser && token) fetchCurrentUser(token);
    }, [token, currentUser, fetchCurrentUser, navigate]);

    useEffect(() => {
        if (token) {
            api.get('/dashboard/stats').then(res => setStats(res)).catch(console.error);
        }
    }, [token]);

    /**
     * Efeito de Sincronização: Preenche o formulário local sempre que os dados do utilizador global mudarem.
     */
    useEffect(() => {
        if (currentUser) {
            setFormData({
                primeiroNome: currentUser.primeiroNome || '',
                ultimoNome: currentUser.ultimoNome || '',
                email: currentUser.email || '',
                telefone: currentUser.telefone || '',
                fotoUrl: currentUser.fotoUrl || '',
                username: currentUser.username || '',
                password: ''
            });
        }
    }, [currentUser]);

    /**
     * Manipulador genérico para mudanças nos campos de dados pessoais.
     * @param {React.ChangeEvent<HTMLInputElement>} e
     */
    const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    /**
     * Manipulador específico para mudanças nos campos de password.
     * @param {React.ChangeEvent<HTMLInputElement>} e
     */
    const handlePassChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    /**
     * Submete as alterações do perfil.
     * Realiza três níveis de validação:
     * 1. Presença da password atual.
     * 2. Verificação da password atual no backend.
     * 3. Coerência entre nova password e a sua confirmação.
     * * @async
     * @function handleSubmit
     * @param {React.FormEvent} e
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ texto: t('profile.a_validar'), tipo: 'info' });

        /** @type {Object} Dados preparados para envio, integrando passwords e informações pessoais. */
        const dadosParaEnviar = {
            username: formData.username,
            primeiroNome: formData.primeiroNome,
            ultimoNome: formData.ultimoNome,
            email: formData.email,
            telefone: formData.telefone,
            fotoUrl: formData.fotoUrl,
            password: passwords.nova.trim() !== '' ? passwords.nova : passwords.atual
        };

        // Validação 1: Obrigatoriedade da password atual
        if (!passwords.atual) {
            return setMensagem({ texto: t('profile.pass_atual_obrig'), tipo: 'erro' });
        }

        // Validação 2: Verificação de identidade no servidor
        const passValida = await checkCurrentPassword(passwords.atual);
        if (!passValida.sucesso) {
            return setMensagem({ texto: passValida.mensagem, tipo: 'erro' });
        }

        // Validação 3: Gestão de troca de password
        const querMudarPassword = passwords.nova.trim() !== '';

        if (querMudarPassword) {
            if (passwords.nova !== passwords.confirmar) {
                return setMensagem({ texto: t('profile.pass_nova_nao_confirmada'), tipo: 'erro' });
            }
            dadosParaEnviar.password = passwords.nova;
        } else {
            // Garante que o campo obrigatório do backend é preenchido com a password atual
            dadosParaEnviar.password = passwords.atual;
        }

        // Envio final para a base de dados
        setMensagem({ texto: t('profile.guardar'), tipo: 'info' });
        const response = await updateUserProfile(dadosParaEnviar);

        if (response.sucesso) {
            setMensagem({ texto: t('profile.perfil_atualizado'), tipo: 'sucesso' });
            setPasswords({ atual: '', nova: '', confirmar: '' });
        } else {
            setMensagem({ texto: `Erro: ${response.mensagem}`, tipo: 'erro' });
        }
    };

    const CORES_TARTE = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

    // A REGRA DE NEGÓCIO: Agrupar leads por estado para o Gráfico!
    // A REGRA DE NEGÓCIO: Agrupar leads por estado para o Gráfico!
    const dadosLeadsPorEstado = useMemo(() => {
        // CORREÇÃO: Verifica primeiro se o stats existe (!stats) antes de ir procurar o leads!
        if (!stats || !stats.leads || stats.leads.length === 0) return [];

        const contagem = {};

        // CORREÇÃO: usar stats em vez de estatisticas
        stats.leads.forEach(lead => {
            const estadoId = Number(lead.estado);
            if (!contagem[estadoId]) {
                const nomeEstado = STATUS_OPTIONS[estadoId]
                    ? t(STATUS_OPTIONS[estadoId].key)
                    : `${t('lead.detalhe.estado')} ${estadoId}`;

                contagem[estadoId] = { name: nomeEstado, value: 0 };
            }
            contagem[estadoId].value += 1;
        });
        return Object.values(contagem);
    }, [stats, t]);

    if (!currentUser) return <p className="loading-text">{t('profile.a_carregar')}</p>;

    /** @type {string} Imagem padrão caso o utilizador não tenha foto definida. */
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
        <div className="main-content">
            <div className="form-container profile-wrapper">

                <h2 className="form-title">{t('profile.title')}</h2>

                {mensagem.texto && (
                    <div className={`alert-message ${mensagem.tipo === 'erro' ? 'alert-error' : 'alert-success'}`}>
                        {mensagem.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="custom-form">

                    {/* --- LINHA SUPERIOR: Gráfico (Esquerda) e Avatar (Direita) --- */}
                    <div className="profile-top-row">

                        {/* COLUNA ESQUERDA: Avatar e Input do URL */}
                        <div className="profile-right-col">
                            <div className="profile-avatar-container">
                                <img
                                    src={formData.fotoUrl || defaultAvatar}
                                    alt="Foto de Perfil"
                                    className="profile-avatar"
                                    onError={(e) => { e.target.src = defaultAvatar; }}
                                />
                                <div className="form-group" style={{ width: '100%', marginTop: '15px' }}>
                                    <label>{t('geral.url')}</label>
                                    <input
                                        type="text"
                                        name="fotoUrl"
                                        value={formData.fotoUrl}
                                        onChange={handleFormChange}
                                        placeholder={t('profile.placeholder_url')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* COLUNA DIREITA: Gráfico de Leads */}
                        <div className="profile-left-col">
                            {stats && dadosLeadsPorEstado.length > 0 ? (
                                <div className="profile-chart-card">
                                    <h3 className="profile-chart-title">
                                        <i className="fa-solid fa-chart-pie" style={{marginRight: '8px'}}></i> {t('dashboard.distribuicao_leads')}
                                    </h3>
                                    <div className="profile-chart-container">
                                        {dadosLeadsPorEstado.length > 0 ? (
                                            /* A MAGIA AQUI: width e height fixos diretamente no PieChart */
                                            <PieChart width={200} height={160}>
                                                <Pie
                                                    data={dadosLeadsPorEstado}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={40}
                                                    outerRadius={60}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {dadosLeadsPorEstado.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={CORES_TARTE[index % CORES_TARTE.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip borderRadius={8} />
                                                <Legend verticalAlign="bottom" height={20} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                            </PieChart>
                                        ) : (<p style={{color: '#94a3b8', textAlign: 'center', marginTop: '100px'}}>{t('dashboard.sem_dados')}</p>)}
                                    </div>
                                </div>
                            ) : (
                                /* Placeholder caso não haja leads, para manter a estrutura simétrica */
                                <div className="profile-chart-card">
                                    <i className="fa-solid fa-chart-pie" style={{ fontSize: '30px', color: '#cbd5e1', marginBottom: '10px' }}></i>
                                    <p style={{ color: '#94a3b8', fontSize: '13px' }}>{t('dashboard.sem_dados')}</p>
                                </div>
                            )}
                        </div>

                    </div>

                    <hr className="profile-divider"/>

                    <h3 className="profile-section-title">{t('profile.dados_pessoais')}</h3>

                    <div className="form-group">
                        <label>{t('geral.username')}</label>
                        <input type="text" value={formData.username} disabled style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }} />
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>{t('geral.primeiro')}</label>
                            <input type="text" name="primeiroNome" value={formData.primeiroNome} onChange={handleFormChange} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>{t('geral.ultimo')}</label>
                            <input type="text" name="ultimoNome" value={formData.ultimoNome} onChange={handleFormChange} required />
                        </div>
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>{t('geral.email')}</label>
                            <input type="email" name="email" value={formData.email} onChange={handleFormChange} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>{t('geral.telefone')}</label>
                            <input type="text" name="telefone" value={formData.telefone} onChange={handleFormChange} />
                        </div>
                    </div>

                    <hr className="profile-divider"/>

                    <h3 className="profile-section-title">{t('profile.seguranca')}</h3>
                    <p className="profile-security-hint">{t('profile.confirmacao')}</p>

                    <div className="form-group">
                        <label>{t('profile.pass_atual')}</label>
                        <input type="password" name="atual" value={passwords.atual} onChange={handlePassChange} placeholder={t('profile.placeholder_passatual')} required />
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>{t('profile.pass_nova')}</label>
                            <input type="password" name="nova" value={passwords.nova} onChange={handlePassChange} placeholder={t('profile.placeholder_passnova')} />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>{t('profile.confirmar_passnova')}</label>
                            <input type="password" name="confirmar" value={passwords.confirmar} onChange={handlePassChange} placeholder={t('profile.placeholder_confirma_passnova')} />
                        </div>
                    </div>

                    <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? t('profile.guardar') : t('profile.guardar_perfil')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}