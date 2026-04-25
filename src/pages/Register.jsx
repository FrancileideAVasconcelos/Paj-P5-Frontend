import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { UserService } from '../services/api';
import '../styles/loginRegister.css';
import {useTranslation} from "react-i18next";

export default function Register() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); // Lê o token do URL enviado por email
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        primeiroNome: '',
        ultimoNome: '',
        telefone: '',
        fotoUrl: ''
    });
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [loading, setLoading] = useState(false);

    const { t, i18n } = useTranslation();

    // SE NÃO HOUVER TOKEN: Bloqueia a página de registo!
    if (!token) {
        return (
            <div className="login-page-container">
                <div className="login-container" style={{ textAlign: 'center' }}>
                    <h2>{t('registo.aviso')}</h2>
                    <p style={{ color: '#e74c3c', fontWeight: 'bold', margin: '20px 0' }}>
                        {t('registo.info')}                    </p>
                    <Link to="/login" className="btn-auth">{t('registo.redirecionamento')}</Link>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmeter = async (e) => {
        e.preventDefault();
        setErro('');
        setSucesso('');
        setLoading(true);

        try {
            await UserService.completeRegistration(token, formData);
            setSucesso(t('registo.sucesso'));
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setErro(error.message || t('registo.erro'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-container">
                <h2>{t('registo.title')}</h2>
                <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '14px', color: '#666' }}>
                    {t('registo.saudacao')}
                </p>

                {erro && <p style={{ color: '#e74c3c', textAlign: 'center', fontWeight: 'bold' }}>{erro}</p>}
                {sucesso && <p style={{ color: '#27ae60', textAlign: 'center', fontWeight: 'bold' }}>{sucesso}</p>}

                <form onSubmit={handleSubmeter} className="custom-form">

                    <div className="form-group">
                        <label>{t('geral.username')}</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>{t('geral.pass')}</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>{t('geral.primeiro')}</label>
                        <input type="text" name="primeiroNome" value={formData.primeiroNome} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>{t('geral.ultimo')}</label>
                        <input type="text" name="ultimoNome" value={formData.ultimoNome} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>{t('geral.telefone')}</label>
                        <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>{t('geral.url')}</label>
                        <input type="text" name="fotoUrl" value={formData.fotoUrl} onChange={handleChange} />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-auth" disabled={loading}>
                            {loading ? t('registo.processar') : t('registo.ativar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}