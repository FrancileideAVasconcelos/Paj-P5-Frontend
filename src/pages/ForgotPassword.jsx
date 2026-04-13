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
            setMensagem("Se o email existir na nossa base de dados, receberá um link de recuperação.");
        } catch (error) {
            setMensagem("Ocorreu um erro ao tentar processar o pedido.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-container">
                <h2>Recuperar Password</h2>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', textAlign: 'center' }}>
                    Insira o seu e-mail e enviar-lhe-emos instruções.
                </p>

                {mensagem && <p style={{ color: '#27ae60', textAlign: 'center', fontWeight: 'bold' }}>{mensagem}</p>}

                <form onSubmit={handleSubmeter} className="custom-form">
                    <div className="form-group">
                        <label>E-mail da sua conta</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-auth" disabled={loading}>
                            {loading ? 'A enviar...' : 'Enviar Link'}
                        </button>
                    </div>
                    <div className="auth-links">
                        <Link to="/login">Voltar ao Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}