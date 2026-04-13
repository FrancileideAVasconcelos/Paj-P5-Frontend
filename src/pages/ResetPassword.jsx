import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { UserService } from '../services/api';
import '../styles/loginRegister.css';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const handleSubmeter = async (e) => {
        e.preventDefault();
        setErro('');

        if (!token) {
            return setErro("Token ausente. Use o link enviado por email.");
        }
        if (password !== confirmarPassword) {
            return setErro("As passwords não coincidem.");
        }

        try {
            await UserService.resetPassword(token, password);
            setSucesso("Password redefinida com sucesso! Pode fazer login.");
            setTimeout(() => navigate('/login'), 3000); // Redireciona após 3s
        } catch (error) {
            setErro("Erro: O token expirou ou é inválido.");
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-container">
                <h2>Nova Password</h2>
                {erro && <p style={{ color: '#e74c3c', textAlign: 'center', fontWeight: 'bold' }}>{erro}</p>}
                {sucesso && <p style={{ color: '#27ae60', textAlign: 'center', fontWeight: 'bold' }}>{sucesso}</p>}

                <form onSubmit={handleSubmeter} className="custom-form">
                    <div className="form-group">
                        <label>Nova Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Confirmar Password</label>
                        <input type="password" value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} required />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-auth">Guardar Password</button>
                    </div>
                    <div className="auth-links">
                        <Link to="/login">Voltar ao Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}