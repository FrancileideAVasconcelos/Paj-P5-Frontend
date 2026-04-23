import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 1. Os nossos "Dicionários"
const resources = {
    pt: {
        translation: {
            "header": {
                "welcome": "Bem-vindo",
                "profile": "Meu Perfil",
                "logout": "Sair"
            },
            "profile": {
                "title": "Meu Perfil",
                "url": "URL da foto de perfil",
                "placeholder_url": "Ex: https://link-da-imagem.com/foto.jpg",
                "dados_pessoais": "Dados Pessoais",
                "username": "Username (Não editável)",
                "primeiro": "Primeiro Nome *",
                "ultimo": "Último Nome *",
                "email": "Email *",
                "telefone": "Telefone",
                "seguranca": "Segurança e Validação",
                "confirmacao": "Confirme a sua identidade para guardar as alterações.",
                "pass_atual": "Senha Atual (Obrigatório) *",
                "placeholder_passatual": "Digite a sua senha atual",
                "pass_nova": "Nova Senha (Opcional) ",
                "placeholder_passnova": "Deixe em branco para manter a atual",
                "confirmar_passnova": "Confirmar Nova Senha",
                "placeholder_confirma_passnova": "Repita a nova password",
                "guardar": "A Guardar...",
                "guardar_perfil": "Guardar Perfil"
            },
            "registo": {
                "aviso": "Acesso restrito",
                "info": "O registo nesta plataforma é feito exclusivamente por convite do Administrador.",
                "redirecionamento": "Voltar ao Login",
                "title": "Completar Registo",
                "saudacao": "Bem-vindo! Preencha os seus dados pessoais para ativar a sua nova conta.",
                "username": "Username",
                "pass": "Senha",
                "primeiro": "Primeiro Nome",
                "ultimo": "Último Nome",
                "telefone": "Telefone",
                "url": "URL da foto (Opcional)",
                "processar": "A processar...",
                "ativar": "Ativar a minha conta",
                "sucesso": "Conta ativada com sucesso! A redirecionar para o login...",
                "erro": "Erro: O link de convite é inválido ou já expirou."
            },
            "menu": {
                "dashboard": "Painel",
                "leads": "Oportunidades",
                "clients": "Clientes",
                "chat": "Mensagens",
                "admin": "Administração"
            },
            "dashboard": {
                "title": "Painel de Resumo",
                "total_leads": "Total de leads",
                "total_clients": "Total de clientes"
            },
            "leads": {
                "title": "Gestão de Oportunidades",
                "add": "Adicionar lead",
                "filtrar": "Filtrar por estado: ",
                "filtro_todos": "Todos os estados",
                "filtro_novo": "Novo",
                "filtro_analise": "Em Análise",
                "filtro_ganho": "Ganho",
                "filtro_perdido": "Perdido",
                "filtro_proposta": "Proposta",
                "carregar": "A carregar leads..."
            },
            "clients": {
                "title": "Gestão de Clientes",
                "add": "Adicionar cliente",
                "carregar": "A carregar clientes..."
            }
        }
    },
    en: {
        translation: {
            "header": {
                "welcome": "Welcome",
                "profile": "My Profile",
                "logout": "Logout"
            },
            "profile": {
                "title": "My Profile",
                "url": "Profile Picture URL",
                "dados_pessoais": "Personal Information",
                "username": "Username (Read-only)",
                "primeiro": "First Name *",
                "ultimo": "Last Name *",
                "email": "Email *",
                "telefone": "Phone Number",
                "seguranca": "Security and Validation",
                "confirmacao": "Confirm your identity to save changes.",
                "pass_atual": "Current Password (Required) *",
                "placeholder_passatual": "Enter your current password",
                "pass_nova": "New Password (Optional)",
                "placeholder_passnova": "Leave blank to keep current",
                "confirmar_passnova": "Confirm New Password",
                "placeholder_confirma_passnova": "Repeat new password",
                "guardar": "Saving...",
                "guardar_perfil": "Save Profile"
            },
            "registo": {
                "aviso": "Restricted Access",
                "info": "Registration on this platform is exclusively by Administrator invitation.",
                "redirecionamento": "Back to Login",
                "title": "Complete Registration",
                "saudacao": "Welcome! Fill in your personal details to activate your new account.",
                "username": "Username",
                "pass": "Password",
                "primeiro": "First Name",
                "ultimo": "Last Name",
                "telefone": "Phone Number",
                "url": "Photo URL (Optional)",
                "processar": "Processing...",
                "ativar": "Activate my account",
                "sucesso": "Account activated successfully! Redirecting to login...",
                "erro": "Error: The invitation link is invalid or has expired."
            },
            "login": {
                "username": "Username",
                "pass": "Password",
                "entrar": "Entrar",
                "esqueceu_pass": "Esqueceu a sua password?",
                "recup_pass": "Recuperar aqui",
                // reset password
                "sucesso": "Password redefinida com sucesso! Pode fazer login.",
                "token_expirado": "Erro: O token expirou ou é inválido.",
                "pass_erradas": "As passwords não coincidem.",
                "token_ausente": "Token ausente. Use o link enviado por email.",
                "pass_nova": "Nova Senha",
                "confirmar_passnova": "Confirmar Nova Senha",
                "guardar": "A Guardar Senha",
                "voltar": "Voltar ao Login",
                // forgot password
                "mensagem_link": "Se o email existir na nossa base de dados, receberá um link de recuperação.",
                "mensagem_erro": "Ocorreu um erro ao tentar processar o pedido.",
                "recup_title": "Recuperar Password",
                "inserir_email": "Insira o seu e-mail e enviar-lhe-emos instruções.",
                "email": "E-mail da sua conta",
                "enviar": "A enviar...",
                "link": "Enviar Link"
            },
            "menu": {
                "dashboard": "Dashboard",
                "leads": "Leads",
                "clients": "Clients",
                "chat": "Chat",
                "admin": "Administration"
            },
            "dashboard": {
                "title": "Summary Panel",
                "total_leads": "Total leads",
                "total_clients": "Total clients"
            },
            "leads": {
                "title": "Opportunities Management",
                "add": "Add lead",
                "filtrar": "Filter by status: ",
                "filtro_todos": "All statuses",
                "filtro_novo": "New",
                "filtro_analise": "Under Review",
                "filtro_ganho": "Won",
                "filtro_perdido": "Lost",
                "filtro_proposta": "Proposal",
                "carregar": "Loading leads..."

            },
            "clients": {
                "title": "Client Management",
                "add": "Add client",
                "carregar": "Loading clients..."

            }
        }
    }
};

// 2. Inicialização
i18n
    .use(initReactI18next) // Passa a instância do i18n para o react-i18next
    .init({
        resources,
        lng: "pt", // Idioma inicial por defeito
        fallbackLng: "en", // Se faltar alguma palavra em PT, ele mostra em EN
        interpolation: {
            escapeValue: false // O React já é seguro contra XSS, não precisamos disto
        }
    });

export default i18n;