const en = {
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
            "title": "Quick Messages",
            "select_contacto": "Select a contact",
            "placeholder": "Type your message...",
            "enviar": "Send",
            "empty": "Loading contacts",
            "chat_msg": "Talking with: ",
            "placeholder_msg": "Type your message",
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
};

export default en;