/**
 * @file api.js
 * @description Módulo central de comunicação HTTP e WebSocket com o Backend (Java/WildFly).
 * Configura os interceptores de pedido, injeção de tokens JWT e exporta os serviços modulares.
 */

import tokenStore from '../store/tokenStore';

const BASE_URL = 'http://localhost:8080/projeto5/rest';
const WS_BASE_URL = 'ws://localhost:8080/projeto5/ws';

/**
 * Função utilitária global para realizar pedidos HTTP, injetar o token de autenticação e tratar respostas genéricas.
 * @async
 * @param {string} endpoint - Rota final da API.
 * @param {Object} [options={}] - Configurações extra para o `fetch` (ex: method, body, headers).
 * @returns {Promise<any>} A resposta parseada em JSON ou Texto.
 * @throws {Error} Lança um erro se o status não for OK ou se o token estiver expirado.
 */
const apiRequest = async (endpoint, options = {}) => {
    const { token } = tokenStore.getState();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) headers['token'] = token;

    const config = { ...options, headers };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        const text = await response.text();

        // Tratamento global de tokens expirados (HTTP 401 ou 409 contendo '401')
        if (response.status === 401 || (response.status === 409 && text.includes('401'))) {
            if (!endpoint.includes('/login')) {
                tokenStore.getState().logout();
                throw new Error('geral.sessao_expirada');
            }
        }

        if (!response.ok) {
            throw new Error(text || `Erro: ${response.status}`);
        }

        try {
            return text ? JSON.parse(text) : null;
        } catch (e) {
            return text;
        }
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

/** @namespace api - Atalhos para os métodos HTTP principais. */
export const api = {
    get: (url, options = {}) => apiRequest(url, { method: 'GET', ...options }),
    post: (url, body, options = {}) => apiRequest(url, { method: 'POST', body: JSON.stringify(body), ...options }),
    put: (url, body, options = {}) => apiRequest(url, { method: 'PUT', body: JSON.stringify(body), ...options }),
    delete: (url, options = {}) => apiRequest(url, { method: 'DELETE', ...options }),
    patch: (endpoint, body, options = {}) => apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options }),
};

// ==========================================
// CAMADAS DE SERVIÇO
// ==========================================

/** @namespace UserService - Endpoints relacionados com a gestão do utilizador atual e autenticação. */
export const UserService = {
    getprofile: () => api.get('/users/profile'),
    checkPassword: (passAtual) => api.get('/users/checkPass', { headers: { passatual: passAtual } }),
    updateProfile: (data) => api.patch('/users/perfil', data),
    updateIdioma: (idioma) => api.patch('/users/idioma', { idioma }),
    completeRegistration: (token, data) => api.post('/users/complete-registration?token=' + encodeURIComponent(token), data),
    forgotPassword: (email) => api.post('/users/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/users/reset-password?token=' + token, { password }),
}

/** @namespace AdminService - Endpoints de privilégio administrativo. */
export const AdminService = {
    inviteUser: (email) => api.post('/admin/users/invite', { email }),
    getAllUsers: (search = "", page = 1, limit = 10) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("page", page);
        params.append("limit", limit);
        return api.get(`/admin/users?${params.toString()}`);
    },
    editUser: (username, data) => api.patch(`/admin/users/${username}`, data),
    getUserClients: (username) => api.get(`/admin/users/${username}/clients`),
    getUserLeads: (username) => api.get(`/admin/users/${username}/leads`),
    deleteUser: (username, permanente) => api.delete(`/admin/users/${username}?permanente=${permanente}`),
    reactivateUser: (username) => api.patch(`/admin/users/${username}/reactivate`, {}),
    toggleItemStatus: (type, id, isAtivo) =>
        isAtivo ? api.delete(`/admin/${type}s/${id}?permanente=false`)
            : api.patch(`/admin/${type}s/${id}/reactivate`, {}),
    deleteItemPermanent: (type, id) => api.delete(`/admin/${type}s/${id}?permanente=true`),
    toggleAllItemsStatus: (username, type, inativar) =>
        inativar ? api.delete(`/admin/users/${username}/${type}s?permanente=false`)
            : api.patch(`/admin/users/${username}/${type}s/reactivate`, {}),
    deleteAllItemsPermanent: (username, type) => api.delete(`/admin/users/${username}/${type}s?permanente=true`),
    editClient: (id, data) => api.patch(`/admin/clients/${id}`, data),
    editLead: (id, data) => api.patch(`/admin/leads/${id}`, data),
};

/** @namespace ClientService - Endpoints para a gestão de Clientes. */
export const ClientService = {
    getAll: (search = "", page = 1, limit = 10) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("page", page);
        params.append("limit", limit);
        return api.get(`/clients?${params.toString()}`);
    },
    getById: (id) => api.get(`/clients/${id}`),
    create: (data) => api.post('/clients', data),
    update: (id, data) => api.patch(`/clients/${id}`, data),
    delete: (id) => api.delete(`/clients/${id}`),
};

/** @namespace LeadService - Endpoints para a gestão de Leads (Oportunidades). */
export const LeadService = {
    getAll: (filtro = "", search = "", page = 1, limit = 10) => {
        const params = new URLSearchParams();
        if (filtro) params.append("estado", filtro);
        if (search) params.append("search", search);
        params.append("page", page);
        params.append("limit", limit);
        return api.get(`/leads?${params.toString()}`);
    },
    getById: (id) => api.get(`/leads/${id}`),
    create: (data) => api.post('/leads', data),
    update: (id, data) => api.patch(`/leads/${id}`, data),
    delete: (id) => api.delete(`/leads/${id}`),
};

/** @namespace ChatService - Endpoints e URLs de WebSockets para o Chat. */
export const ChatService = {
    getHistorico: (username) => api.get(`/chat/historico/${username}`),
    enviarMensagem: (destinatarioUsername, conteudo) => api.post('/chat/send', { destinatarioUsername, conteudo }),
    marcarComoLidas: (username) => api.patch(`/chat/lidas/${username}`),
    getContactos: () => api.get('/chat/contactos'),
    getWebSocketUrl: (token) => `${WS_BASE_URL}/chat/${token}`,
}

/** @namespace NotificationService - URL de WebSockets para Notificações globais. */
export const NotificationService = {
    getWebSocketUrl: (token) => `${WS_BASE_URL}/notifications/${token}`,
};