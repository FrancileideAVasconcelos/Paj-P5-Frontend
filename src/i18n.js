import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 1. Os nossos "Dicionários"
const resources = {
    pt: {
        translation: {
            "geral": {
                "username": "Username",
                "pass": "Senha",
                "primeiro": "Primeiro Nome",
                "ultimo": "Último Nome",
                "telefone": "Telefone",
                "url": "URL da foto",
                "sessao_expirada": "A sua sessão expirou por inatividade. Faça login novamente.",
            },
            "header": {
                "welcome": "Bem-vindo",
                "profile": "Meu Perfil",
                "logout": "Sair"
            },
            "login": {
                "entrar": "Entrar",
                "esqueceu_pass": "Esqueceu a sua password?",
                "recup_pass": "Recuperar aqui",
                "erro_servidor": "Resposta do servidor inválida.",
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
            "profile": {
                "title": "Meu Perfil",
                "placeholder_url": "Ex: https://link-da-imagem.com/foto.jpg",
                "dados_pessoais": "Dados Pessoais",
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
                "aviso": "Aviso",
                "total_leads": "Total de leads",
                "total_clients": "Total de clientes",
                "total_utilizadores": "Total Utilizadores",
                "contas_ativas": "Contas Ativas",
                "distribuicao_leads": "Distribuição de Leads",
                "sem_dados": "Sem dados suficientes.",
                "evolucao_leads": "Evolução de Leads (Tempo)",
                "sem_historico": "Sem histórico registado",
                "leads_user": "Leads por Utilizador",
                "sem_lead": "Nenhuma lead associada",
                "evolucao_user": "Evolução de Utilizadores Registados",

            },
            "form_modal": {
                "editar_client": "Editar Cliente",
                "adicionar_client": "Adicionar Cliente",
                "editar_lead": "Editar Lead",
                "adicionar_lead": "Adicionar Lead",
                "nome": "Nome",
                "email": "Email",
                "telefone": "Telefone",
                "empresa": "Empresa",
                "titulo_lead": "Título da Oportunidade *",
                "descricao": "Descrição",
                "estado": "Estado",
                "cancelar": "Cancelar",
                "salvar": "Salvar Alterações",
                "adicionar": "Adicionar",
                "use_form_modal": {
                    "sucesso": "Operação realizada com sucesso!",
                    "erro": "Ocorreu um erro ao guardar os dados."
                }
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
                "carregar": "A carregar leads...",
                "detalhes": {
                    "titulo_pag": "Detalhes da Oportunidade",
                    "voltar": "Voltar à Lista",
                    "carregar": "A carregar detalhes...",
                    "lead_n_encontrada": "Oportunidade não encontrada.",
                    "label_titulo": "Título",
                    "label_descricao": "Descrição",
                    "label_estado": "Estado",
                    "label_data": "Data de Registo",
                    "btn_editar": "Editar Detalhes",
                    "btn_remover": "Remover Lead",
                    "alerta": "Lead removida",
                    "confirm_remover": "Tem a certeza que deseja inativar este registo?"
                }
            },
            "clients": {
                "title": "Gestão de Clientes",
                "add": "Adicionar cliente",
                "carregar": "A carregar clientes...",
                "detalhes": {
                    "titulo": "Detalhes do Cliente",
                    "voltar": "Voltar à Lista",
                    "carregar_detalhes": "A carregar detalhes...",
                    "cliente_n_encontrado": "Cliente não encontrado.",
                    "nome": "Nome",
                    "email_contacto": "Email Contacto",
                    "telefone": "Telefone",
                    "empresa": "Empresa",
                    "editar": "Editar Detalhes",
                    "remover": "Remover Cliente",
                    "confirm_remover": "Tem a certeza que deseja inativar este cliente?",
                    "alerta": "Cliente removid  o!"
                }
            },
            "chat": {
                "title": "Contactos",
                "empty": "Nenhum contacto disponível.",
                "chatMsg": "A falar com:",
                "placeholder_msg": "Escreve uma mensagem...",
                "enviar": "Enviar",
                "select_contacto": "Selecione um contacto para iniciar conversa.",

            },
            "admin": {
                "title": "Gestão de Utilizadores",
                "convidar": "Convidar Novo Utilizador",
                "placeholder_email": "E-mail do novo utilizador",
                "enviando": "A enviar...",
                "enviar_convite": "Enviar Convite",
                "carregar_utilizadores": "A carregar utilizadores...",
                "ativo": "Ativo",
                "inativo": "Inativo",
                "lista_vazia": "Nenhum utilizador encontrado.",
                "inviteMsg": "Convite enviado com sucesso para o Email!",
                "erroMsg": "Erro ao enviar convite.",

                "detalhes": {
                        "titulo": "Painel do Utilizador",
                        "voltar": "Voltar à Lista",
                        "admin_tag": "Admin",
                        "sem_email": "Sem email",
                        "sem_telefone": "Sem telefone",
                        "inativar_conta": "Inativar Conta",
                        "reativar_conta": "Reativar Conta",
                        "excluir_conta": "Excluir Conta",
                        "aviso_meu_perfil": "Este é o seu perfil. Use a página de Perfil para edições pessoais.",
                        "carregar_dados": "A carregar dados...",
                        "confirm_inativar_item": "Tem a certeza que deseja inativar este registo?",
                        "confirm_reativar_item": "Tem a certeza que deseja reativar este registo?",
                        "confirm_excluir_item": "ATENÇÃO: Vai apagar permanentemente este registo e perder os dados. Continuar?",
                        "confirm_inativar_user": "Tem a certeza que deseja inativar a conta de @{{username}}?",
                        "confirm_reativar_user": "Tem a certeza que deseja reativar a conta de @{{username}}?",
                        "confirm_excluir_user": "ATENÇÃO EXPLOSIVA 💣: Vai apagar @{{username}} e TODOS os seus dados permanentemente. Continuar?",
                        "sucesso_excluir_user": "Utilizador apagado permanentemente!",
                        "label_clientes": "todos os clientes",
                        "label_leads": "todas as leads",
                        "confirm_lote_inativar": "Tem a certeza que deseja inativar {{tipo}} do utilizador @{{username}}?",
                        "confirm_lote_reativar": "Tem a certeza que deseja reativar {{tipo}} do utilizador @{{username}}?",
                        "confirm_lote_excluir": "ATENÇÃO EXPLOSIVA 💣: Vai apagar permanentemente {{tipo}}. Continuar?"
                },
                "lista": {
                    "reativar_todos": "Reativar todos",
                    "inativar_todos": "Inativar todos",
                    "excluir_todos": "Excluir todos",
                    "inativo": "Inativo",
                    "editar": "Editar",
                    "inativar": "Inativar",
                    "reativar": "Reativar",
                    "excluir": "Excluir",
                    "vazia": "Nenhum registo de {{tipo}} encontrado."
                }
            },
            "footer": {
                "title": "Programação Avançada em Java"
            }
        }
    },
    en: {
        translation: {
            "geral": {
                "username": "Username",
                "pass": "Password",
                "primeiro": "First Name",
                "ultimo": "Last Name",
                "telefone": "Phone Number",
                "url": "Photo URL",
                "sessao_expirada": "Your session has expired due to inactivity. Please log in again."
            },
            "login": {
                "entrar": "Sign In",
                "esqueceu_pass": "Forgot your password?",
                "recup_pass": "Recover here",
                "sucesso": "Password reset successfully! You can now login.",
                "token_expirado": "Error: The token has expired or is invalid.",
                "pass_erradas": "Passwords do not match.",
                "token_ausente": "Token missing. Use the link sent via email.",
                "pass_nova": "New Password",
                "confirmar_passnova": "Confirm New Password",
                "guardar": "Saving Password...",
                "voltar": "Back to Login",
                "mensagem_link": "If the email exists in our database, you will receive a recovery link.",
                "mensagem_erro": "An error occurred while trying to process the request.",
                "recup_title": "Recover Password",
                "inserir_email": "Enter your email and we will send you instructions.",
                "email": "Your account email",
                "enviar": "Sending...",
                "link": "Send Link"
            },
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
            "form_modal": {
                "editar_client": "Edit Client",
                "adicionar_client": "Add Client",
                "editar_lead": "Edit Lead",
                "adicionar_lead": "Add Lead",
                "nome": "Name",
                "email": "Email",
                "telefone": "Phone Number",
                "empresa": "Company",
                "titulo_lead": "Opportunity Title *",
                "descricao": "Description",
                "estado": "Status",
                "cancelar": "Cancel",
                "salvar": "Save Changes",
                "adicionar": "Add",
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
                "carregar": "Loading leads...",
                "detalhes": {
                    "titulo_pag": "Opportunity Details",
                    "voltar": "Back to List",
                    "carregar": "Loading details...",
                    "label_titulo": "Title",
                    "label_descricao": "Description",
                    "label_estado": "Status",
                    "label_data": "Registration Date",
                    "btn_editar": "Edit Details",
                    "btn_remover": "Remove Lead",
                    "confirm_remover": "Are you sure you want to deactivate this record?"
                }
            },
            "clients": {
                "title": "Client Management",
                "add": "Add client",
                "carregar": "Loading clients...",
                "detalhes": {
                    "titulo": "Client Details",
                    "voltar": "Back to List",
                    "carregar_detalhes": "Loading details...",
                    "nome": "Name",
                    "email_contacto": "Contact Email",
                    "telefone": "Phone Number",
                    "empresa": "Company",
                    "editar": "Edit Details",
                    "remover": "Remove Client",
                    "confirm_remover": "Are you sure you want to deactivate this client?",
                    "alerta": "Client removed!",
                }
            },
            "chat": {
                "title": "Contacts",
                "empty": "No contacts available.",
                "chatMsg": "Chatting with:",
                "placeholderMsg": "Type a message...",
                "enviar": "Send",
                "select_contacto": "Select a contact to start chatting."
            },
            "admin": {
                "title": "User Management",
                "convidar": "Invite New User",
                "placeholder_email": "New user's email",
                "enviando": "Sending...",
                "enviar_convite": "Send Invitation",
                "carregar_utilizadores": "Loading users...",
                "ativo": "Active",
                "inativo": "Inactive",
                "lista_vazia": "No users found.",
                "inviteMsg": "Invitation successfully sent to Email!",
                "erroMsg": "Error sending invitation.",

                "detalhes": {
                    "titulo": "User Control Panel",
                    "voltar": "Back to List",
                    "admin_tag": "Admin",
                    "sem_email": "No email",
                    "sem_telefone": "No phone",
                    "inativar_conta": "Deactivate Account",
                    "reativar_conta": "Reactivate Account",
                    "excluir_conta": "Delete Account",
                    "aviso_meu_perfil": "This is your profile. Use the Profile page for personal edits.",
                    "carregar_dados": "Loading data...",
                    "confirm_inativar_item": "Are you sure you want to deactivate this record?",
                    "confirm_reativar_item": "Are you sure you want to reactivate this record?",
                    "confirm_excluir_item": "WARNING: You will permanently delete this record and lose data. Continue?",
                    "confirm_inativar_user": "Are you sure you want to deactivate the account of @{{username}}?",
                    "confirm_reativar_user": "Are you sure you want to reactivate the account of @{{username}}?",
                    "confirm_excluir_user": "EXPLOSIVE WARNING 💣: You will permanently delete @{{username}} and ALL their data. Continue?",
                    "sucesso_excluir_user": "User permanently deleted!",
                    "label_clientes": "all clients",
                    "label_leads": "all leads",
                    "confirm_lote_inativar": "Are you sure you want to deactivate {{tipo}} for user @{{username}}?",
                    "confirm_lote_reativar": "Are you sure you want to reactivate {{tipo}} for user @{{username}}?",
                    "confirm_lote_excluir": "EXPLOSIVE WARNING 💣: You will permanently delete {{tipo}}. Continue?"
                },
                "lista": {
                    "reativar_todos": "Reactivate all",
                    "inativar_todos": "Deactivate all",
                    "excluir_todos": "Delete all",
                    "inativo": "Inactive",
                    "editar": "Edit",
                    "inativar": "Deactivate",
                    "reativar": "Reactivate",
                    "excluir": "Delete",
                    "vazia": "No {{tipo}} found."
                }
            },
            "footer": {
                "title": "Advanced Java Programming"
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