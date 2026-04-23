import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserService } from '../services/api';
import '../styles/loginRegister.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false);

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
                    {t('login.inserir_email ')}
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