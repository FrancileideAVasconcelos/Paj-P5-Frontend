/**
 * @file tokenStore.js
 * @description Store do Zustand dedicada exclusivamente à persistência e gestão do token JWT.
 * Sincroniza o token com o LocalStorage do navegador para manter a sessão ativa.
 */

import { create } from 'zustand';
import useUserStore from './useUserStore.js';

/**
 * @typedef {Object} TokenStore
 * @property {string|null} token - O JWT atualmente ativo, ou null se não autenticado.
 * @property {Function} login - Guarda um novo token no estado e na memória local.
 * @property {Function} logout - Remove o token atual e limpa os dados da store de utilizador.
 */
const tokenStore = create((set) => ({
    token: localStorage.getItem('token') || null,

    login: (newToken) => {
        localStorage.setItem('token', newToken);
        set({ token: newToken });
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ token: null });

        useUserStore.getState().clearUser();
    }
}));

export default tokenStore;