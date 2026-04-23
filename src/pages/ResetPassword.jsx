import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { UserService } from '../services/api';
import '../styles/loginRegister.css';
import {useTranslation} from "react-i18next";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const { t, i18n } = useTranslation();

    const handleSubmeter = async (e) => {
        e.preventDefault();
        setErro('');

        if (!token) {
            return setErro(t('login.token_ausente'));
        }
        if (password !== confirmarPassword) {
            return setErro(t('login.pass_erradas'));
        }

        try {
            await UserService.resetPassword(token, password);
            setSucesso(t('login.sucesso'));
            setTimeout(() => navigate('/login'), 3000); // Redireciona após 3s
        } catch (error) {
            setErro(t('login.token_expirado'));
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-container">
                <h2>{t('login.pass')}</h2>
                {erro && <p style={{ color: '#e74c3c', textAlign: 'center', fontWeight: 'bold' }}>{erro}</p>}
                {sucesso && <p style={{ color: '#27ae60', textAlign: 'center', fontWeight: 'bold' }}>{sucesso}</p>}

                <form onSubmit={handleSubmeter} className="custom-form">
                    <div className="form-group">
                        <label>{t('login.pass')}</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>{t('login.confirmar_passnova')}</label>
                        <input type="password" value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} required />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-auth">{t('login.guardar')}</button>
                    </div>
                    <div className="auth-links">
                        <Link to="/login">{t('login.voltar')}</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}