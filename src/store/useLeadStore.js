/**
 * @file useLeadStore.js
 * @description Store do Zustand para a gestão de Leads (potenciais clientes).
 * Controla a listagem, criação, atualização e remoção lógica de leads do utilizador.
 */

import { create } from 'zustand';
import { LeadService } from "../services/api.js";
import i18n from "i18next";

/**
 * Store global para a gestão de leads.
 * * @typedef {Object} LeadStore
 * @property {Array} leads - Lista de leads carregadas do servidor.
 * @property {Object|null} currentLead - Dados da lead selecionada para visualização detalhada ou edição.
 * @property {boolean} loading - Indica se uma operação assíncrona está em curso.
 * @property {Function} fetchLeads - Procura a lista de leads, com filtragem opcional.
 * @property {Function} fetchLeadById - Procura os detalhes de uma única lead.
 * @property {Function} addLead - Envia uma nova lead para o servidor.
 * @property {Function} updateLead - Atualiza os dados de uma lead existente.
 * @property {Function} softDeleteLead - Realiza a inativação (remoção lógica) de uma lead.
 */

const useLeadStore = create((set, get) => ({
    /** Lista de leads do utilizador. */
    leads: [],
    /** Lead atualmente selecionada. */
    currentLead: null,
    /** Estado de carregamento. */
    loading: false,
    currentPage: 1,
    totalPages: 1,

    fetchLeads: async (token, estado = "", search = "", page = 1) => {
        set({ loading: true });
        try {
            // Passa a página para o serviço de API
            const response = await LeadService.getAll(estado, search, page);
            set({
                leads: response.data || [],           // Extrai a lista do envelope[cite: 2, 3]
                totalPages: response.totalPages || 1, // Guarda o total de páginas[cite: 3]
                currentPage: response.currentPage || 1,
                loading: false
            });
        } catch (error) {
            set({ loading: false });
        }
    },

    /**
     * Obtém os detalhes completos de uma lead específica através do seu ID.
     * * @async
     * @function fetchLeadById
     * @param {string} token - Token de autenticação.
     * @param {number|string} id - O identificador único da lead.
     * @returns {Promise<void>}
     */
    fetchLeadById: async (token, id) => {
        set({ loading: true });
        try {
            const data = await LeadService.getById(id);
            set({ currentLead: data, loading: false });
        } catch (error) {
            console.error(i18n.t('console_logs.erro_detalhes'), error);
            set({ loading: false });
        }
    },

    /**
     * Cria uma nova lead no sistema.
     * Após a criação, atualiza automaticamente a lista local de leads.
     * * @async
     * @function addLead
     * @param {string} token - Token de autenticação.
     * @param {Object} novaLead - Objeto contendo os dados da nova lead.
     * @returns {Promise<boolean>} Retorna true se a operação for bem-sucedida.
     */
    addLead: async (token, novaLead) => {
        set({ loading: true });
        try {
            await LeadService.create(novaLead);
            // Recarrega a lista para refletir a nova lead na UI
            await get().fetchLeads(token);
            set({ loading: false });
            return true;
        } catch (error) {
            console.error(i18n.t('console_logs.erro_criar_lead'), error);
            set({ loading: false });
            return false;
        }
    },

    /**
     * Atualiza os dados de uma lead existente no servidor e sincroniza o estado local.
     * * @async
     * @function updateLead
     * @param {string} token - Token de autenticação.
     * @param {number|string} id - ID da lead a ser editada.
     * @param {Object} leadAtualizada - Novos dados para a lead.
     * @returns {Promise<boolean>} Retorna true se a atualização for concluída com sucesso.
     */
    updateLead: async (token, id, leadAtualizada) => {
        set({ loading: true });
        try {
            await LeadService.update(id, leadAtualizada);

            set((state) => ({
                // Atualiza a lead dentro da lista de leads
                leads: state.leads.map(l => l.id === id ? { ...l, ...leadAtualizada } : l),
                // Se a lead atualizada for a que está a ser visualizada, atualiza o detalhe
                currentLead: state.currentLead?.id === id ? { ...state.currentLead, ...leadAtualizada } : state.currentLead,
                loading: false
            }));

            return true;
        } catch (error) {
            console.error(i18n.t('console_logs.erro_editar_lead'), error);
            set({ loading: false });
            return false;
        }
    },

    /**
     * Realiza a eliminação lógica (inativação) de uma lead.
     * Altera a flag 'ativo' para false no servidor e no estado local.
     * * @async
     * @function softDeleteLead
     * @param {string} token - Token de autenticação.
     * @param {number|string} id - ID da lead a ser inativada.
     * @returns {Promise<boolean>} Retorna true se a inativação for concluída.
     */
    softDeleteLead: async (token, id) => {
        set({ loading: true });
        try {
            await LeadService.delete(id);

            set((state) => ({
                leads: state.leads.map(l => l.id === id ? { ...l, ativo: false } : l),
                currentLead: state.currentLead?.id === id ? { ...state.currentLead, ativo: false } : state.currentLead,
                loading: false
            }));

            return true;
        } catch (error) {
            console.error(i18n.t('console_logs.erro_eliminar_lead'), error);
            set({ loading: false });
            return false;
        }
    }

}));

export default useLeadStore;