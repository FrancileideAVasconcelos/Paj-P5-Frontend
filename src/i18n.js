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
                "a_carregar": "A Carregar dados...",
                "total_leads": "Total Leads",
                "total_clients": "Total Clientes",
                "total_utilizadores": "Total Utilizadores",
                "contas_ativas": "Contas Ativas",
                "distribuicao_leads": "Leads por Estado",
                "sem_dados": "Sem dados para apresentar",
                "leads_user": "Leads por Utilizador",
                "sem_lead": "Nenhum utilizador com leads.",
                "evolucao_temporal": "Evolução de Temporal",
                "sem_historico": "Sem histórico para apresentar.",
                "tooltip_leads": "Leads",
                "tooltip_users": "Utilizadores",
                "tooltip_qtd": "Quantidade"
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
                "titulo_lead": "Título da Oportunidade ",
                "descricao": "Descrição",
                "estado": "Estado",
                "cancelar": "Cancelar",
                "salvar": "Salvar Alterações",
                "adicionar": "Adicionar",
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
                "vazio": "Nenhuma lead encontrada.",
                "estado": {
                    "novo": "Novo",
                    "analise": "Em Análise",
                    "proposta": "Proposta",
                    "ganho": "Ganho",
                    "perdido": "Perdido"
                },
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
                    "alerta": "Lead inativada",
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
            "admin": {
                "title": "Gestão de Utilizadores",
                "convidar": "Convidar User",
                "placeholder_email": "Email do novo utilizador",
                "enviando": "A Enviar...",
                "enviar_convite": "Enviar Convite",
                "inviteMsg": "Convite enviado com sucesso!",
                "erroMsg": "Erro ao enviar convite.",
                "carregar_utilizadores": "A carregar utilizadores...",
                "placeholder_pesquisa": "Digite um username ou email",
                "ativo": "Ativo",
                "inativo": "Inativo",
                "lista_vazia": "Nenhum utilizador encontrado.",
                "detalhes": {
                    "admin_tag": "Admin",
                    "sem_email": "Sem Email",
                    "sem_telefone": "Sem Telefone",
                }
            },
            "chat": {
                "title": "Mensagens",
                "select_contacto": "Selecione um contato",
                "placeholder": "Escreva a sua mensagem...",
                "enviar": "Enviar",
                "empty": "A carregar contactos",
                "chat_msg": "A falar com: ",
                "placeholder_msg": "Digite a mensagem",
                "erro_ws": "Desconectado do chat. A tentar reconectar..."
            },
            "admin_user_details": {
                "titulo": "Detalhes de Conta",
                "btn_voltar": "Voltar",
                "dados_pessoais": "Dados Pessoais",
                "email": "Email",
                "telefone": "Telefone",
                "membro_desde": "Membro desde",
                "permissoes": "Permissões e Estado",
                "conta_ativa": "Conta Ativa",
                "aviso_meu_perfil": "Vá ao meu profile para edição de perfil",
                "carregar_dados": "A carregar dados...",
                "desativar_conta": "Desativar Conta",
                "ativar_conta": "Ativar Conta",
                "excluir_conta": "Removerr Conta",
                "aviso_apagar": "Tem a certeza que deseja apagar esta conta permanentemente?",
                "aviso_desativar": "Tem a certeza que deseja desativar esta conta?",
                "tabs": {
                    "clientes": "Clientes ({{total}})",
                    "leads": "Leads ({{total}})"
                },
                "botoes_lote": {
                    "label_clientes": "todos os clientes",
                    "label_leads": "todas as leads",
                    "confirm_lote_inativar": "Tem a certeza que deseja inativar {{tipo}} do utilizador @{{username}}?",
                    "confirm_lote_reativar": "Tem a certeza que deseja reativar {{tipo}} do utilizador @{{username}}?",
                    "confirm_lote_excluir": "AVISO EXPLOSIVO 💣: Vai apagar permanentemente {{tipo}}. Continuar?"
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
                    "vazia": "Nenhum {{tipo}} encontrado."
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
                "telefone": "Phone",
                "url": "Photo URL",
                "sessao_expirada": "Your session has expired due to inactivity. Please log in again."
            },
            "header": {
                "welcome": "Welcome",
                "profile": "My Profile",
                "logout": "Logout"
            },
            "login": {
                "entrar": "Sign In",
                "esqueceu_pass": "Forgot your password?",
                "recup_pass": "Recover here",
                "erro_servidor": "Invalid server response.",
                "sucesso": "Password successfully reset! You can now log in.",
                "token_expirado": "Error: The token has expired or is invalid.",
                "pass_erradas": "Passwords do not match.",
                "token_ausente": "Missing token. Please use the link sent to your email.",
                "pass_nova": "New Password",
                "confirmar_passnova": "Confirm New Password",
                "guardar": "Saving Password",
                "voltar": "Back to Login",
                // forgot password
                "mensagem_link": "If the email exists in our database, you will receive a recovery link.",
                "mensagem_erro": "An error occurred while trying to process the request.",
                "recup_title": "Recover Password",
                "inserir_email": "Enter your email and we will send you instructions.",
                "email": "Your account email",
                "enviar": "Sending...",
                "link": "Send Link"
            },
            "profile": {
                "title": "My Profile",
                "placeholder_url": "Ex: https://image-link.com/photo.jpg",
                "dados_pessoais": "Personal Data",
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
                "processar": "Processing...",
                "ativar": "Activate my account",
                "sucesso": "Account successfully activated! Redirecting to login...",
                "erro": "Error: The invitation link is invalid or has expired."
            },
            "menu": {
                "dashboard": "Dashboard",
                "leads": "Opportunities",
                "clients": "Clients",
                "chat": "Messages",
                "admin": "Administration"
            },
            "dashboard": {
                "title": "Summary Dashboard",
                "aviso": "Warning",
                "total_leads": "Total Leads",
                "total_clients": "Total Clients",
                "total_utilizadores": "Total Users",
                "contas_ativas": "Active Accounts",
                "distribuicao_leads": "Leads by Status",
                "sem_dados": "No data to display",
                "leads_user": "Leads by User",
                "sem_lead": "No users with leads.",
                "evolucao_temporal": "Temporal Evolution",
                "sem_historico": "No history to display.",
                "tooltip_leads": "Leads",
                "tooltip_users": "Users",
                "tooltip_qtd": "Quantity"
            },
            "form_modal": {
                "editar_client": "Edit Client",
                "adicionar_client": "Add Client",
                "editar_lead": "Edit Lead",
                "adicionar_lead": "Add Lead",
                "nome": "Name",
                "email": "Email",
                "telefone": "Phone",
                "empresa": "Company",
                "titulo_lead": "Opportunity Title",
                "descricao": "Description",
                "estado": "Status",
                "cancelar": "Cancel",
                "salvar": "Save Changes",
                "adicionar": "Add"
            },
            "leads": {
                "title": "Opportunity Management",
                "add": "Add lead",
                "filtrar": "Filter by status: ",
                "filtro_todos": "All statuses",
                "filtro_novo": "New",
                "filtro_analise": "Under Review",
                "filtro_ganho": "Won",
                "filtro_perdido": "Lost",
                "filtro_proposta": "Proposal",
                "carregar": "Loading leads...",
                "vazio": "No leads found.",
                "estado": {
                    "novo": "New",
                    "analise": "Under Review",
                    "proposta": "Proposal",
                    "ganho": "Won",
                    "perdido": "Lost"
                },
                "detalhes": {
                    "titulo_pag": "Opportunity Details",
                    "voltar": "Back to List",
                    "carregar": "Loading details...",
                    "lead_n_encontrada": "Opportunity not found.",
                    "label_titulo": "Title",
                    "label_descricao": "Description",
                    "label_estado": "Status",
                    "label_data": "Registration Date",
                    "btn_editar": "Edit Details",
                    "btn_remover": "Remove Lead",
                    "alerta": "Lead removed",
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
                    "cliente_n_encontrado": "Client not found.",
                    "nome": "Name",
                    "email_contacto": "Contact Email",
                    "telefone": "Phone",
                    "empresa": "Company",
                    "editar": "Edit Details",
                    "remover": "Remove Client",
                    "confirm_remover": "Are you sure you want to deactivate this client?",
                    "alerta": "Client removed!"
                }
            },
            "admin": {
                "title": "User Management",
                "convidar": "Invite User",
                "placeholder_email": "New user's email",
                "enviando": "Sending...",
                "enviar_convite": "Send Invite",
                "inviteMsg": "Invitation sent successfully!",
                "erroMsg": "Error sending invitation.",
                "carregar_utilizadores": "Loading users...",
                "placeholder_pesquisa": "Type a username or email",
                "ativo": "Active",
                "inativo": "Inactive",
                "lista_vazia": "No users found.",
                "detalhes": {
                    "admin_tag": "Admin",
                    "sem_email": "No Email",
                    "sem_telefone": "No Phone"
                }
            },
            "chat": {
                "titulo": "Quick Messages",
                "placeholder": "Type your message...",
                "enviar": "Send",
                "sem_mensagens": "No messages yet.",
                "erro_ws": "Disconnected from chat. Attempting to reconnect..."
            },
            "admin_user_details": {
                "titulo": "Account Details",
                "btn_voltar": "Back",
                "dados_pessoais": "Personal Data",
                "email": "Email",
                "telefone": "Phone",
                "membro_desde": "Member since",
                "permissoes": "Permissions and Status",
                "conta_ativa": "Active Account",
                "aviso_meu_perfil": "Go to My Profile to edit details",
                "carregar_dados": "Loading data...",
                "desativar_conta": "Deactivate Account",
                "ativar_conta": "Activate Account",
                "excluir_conta": "Remove Account",
                "aviso_apagar": "Are you sure you want to permanently delete this account?",
                "aviso_desativar": "Are you sure you want to deactivate this account?",
                "tabs": {
                    "clientes": "Clients ({{total}})",
                    "leads": "Leads ({{total}})"
                },
                "botoes_lote": {
                    "label_clientes": "all clients",
                    "label_leads": "all leads",
                    "confirm_lote_inativar": "Are you sure you want to deactivate {{tipo}} for user @{{username}}?",
                    "confirm_lote_reativar": "Are you sure you want to reactivate {{tipo}} for user @{{username}}?",
                    "confirm_lote_excluir": "EXPLOSIVE WARNING 💣: You are about to permanently delete {{tipo}}. Continue?"
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
            escapeValue: false // O React já previne XSS por defeito
        }
    });

export default i18n;