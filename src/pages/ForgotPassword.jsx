/**
 * @file ForgotPassword.jsx
 * @description Componente de página que permite aos utilizadores iniciarem o processo de recuperação de palavra-passe, inserindo o seu endereço de email.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserService } from '../services/api';
import '../styles/loginRegister.css';
import {useTranslation} from "react-i18next";

/**
 * Componente funcional para renderizar o formulário de pedido de recuperação de password.
 *
 * @component
 * @returns {JSX.Element} O ecrã de recuperação de palavra-passe.
 */
export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    /**
     * Submete o pedido de recuperação de password ao backend usando o email fornecido.
     * @async
     * @param {React.FormEvent} e - Evento de formulário intercetado.
     */
    const handleSubmeter = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem('');

        try {
            await UserService.forgotPassword(email);
            setMensagem(t('login.mensagem_link'));
        } catch (error) {
            setMensagem(t('login.mensagem_erro'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-container">
                <h2>{t('login.recup_title')}</h2>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', textAlign: 'center' }}>
                    {t('login.inserir_email')}
                </p>

                {mensagem && <p style={{ color: '#27ae60', textAlign: 'center', fontWeight: 'bold' }}>{mensagem}</p>}

                <form onSubmit={handleSubmeter} className="custom-form">
                    <div className="form-group">
                        <label>{t('login.email')}</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-auth" disabled={loading}>
                            {loading ? t('login.enviar') : t('login.link')}
                        </button>
                    </div>
                    <div className="auth-links">
                        <Link to="/login">{t('login.voltar')}</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}