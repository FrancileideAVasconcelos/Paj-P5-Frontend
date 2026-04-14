import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { UserService } from '../services/api';
import '../styles/loginRegister.css';

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

    // SE NÃO HOUVER TOKEN: Bloqueia a página de registo!
    if (!token) {
        return (
            <div className="login-page-container">
                <div className="login-container" style={{ textAlign: 'center' }}>
                    <h2>Acesso Restrito</h2>
                    <p style={{ color: '#e74c3c', fontWeight: 'bold', margin: '20px 0' }}>
                        O registo nesta plataforma é feito exclusivamente por convite do Administrador.
                    </p>
                    <Link to="/login" className="btn-auth">Voltar ao Login</Link>
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
            setSucesso("Conta ativada com sucesso! A redirecionar para o login...");
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setErro(error.message || "Erro: O link de convite é inválido ou já expirou.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-container">
                <h2>Completar Registo</h2>
                <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '14px', color: '#666' }}>
                    Bem-vindo! Preencha os seus dados pessoais para ativar a sua nova conta.
                </p>

                {erro && <p style={{ color: '#e74c3c', textAlign: 'center', fontWeight: 'bold' }}>{erro}</p>}
                {sucesso && <p style={{ color: '#27ae60', textAlign: 'center', fontWeight: 'bold' }}>{sucesso}</p>}

                <form onSubmit={handleSubmeter} className="custom-form">
                    {/* Reparaste? Não há campo "E-mail" aqui! O Java já o guardou através do token. */}

                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Primeiro Nome</label>
                        <input type="text" name="primeiroNome" value={formData.primeiroNome} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Último Nome</label>
                        <input type="text" name="ultimoNome" value={formData.ultimoNome} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Telefone</label>
                        <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>URL da Foto (Opcional)</label>
                        <input type="text" name="fotoUrl" value={formData.fotoUrl} onChange={handleChange} />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-auth" disabled={loading}>
                            {loading ? 'A processar...' : 'Ativar a minha conta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}