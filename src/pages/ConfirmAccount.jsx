import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { UserService } from '../services/api';
import '../styles/loginRegister.css';

export default function ConfirmAccount() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [mensagem, setMensagem] = useState("A validar a sua conta...");
    const [sucesso, setSucesso] = useState(false);

    // Variável para blindar o componente contra o duplo disparo do React StrictMode
    const chamadoRef = useRef(false);

    useEffect(() => {
        if (!token) {
            setMensagem("Token não fornecido ou inválido.");
            return;
        }

        // Se já fizemos a chamada, aborta para não duplicar!
        if (chamadoRef.current) return;
        chamadoRef.current = true;

        const confirmar = async () => {
            try {
                await UserService.confirmAccount(token);
                setMensagem("Conta ativada com sucesso! Já pode fazer login.");
                setSucesso(true);
            } catch (error) {
                setMensagem("Erro: O token é inválido ou expirou.");
            }
        };

        confirmar();
    }, [token]);

    return (
        <div className="login-page-container">
            <div className="login-container" style={{ textAlign: 'center' }}>
                <h2>Confirmação de Conta</h2>
                <p style={{ color: sucesso ? '#27ae60' : '#e74c3c', fontWeight: 'bold', margin: '20px 0' }}>
                    {mensagem}
                </p>
                <Link to="/login" className="btn-auth">Ir para o Login</Link>
            </div>
        </div>
    );
}