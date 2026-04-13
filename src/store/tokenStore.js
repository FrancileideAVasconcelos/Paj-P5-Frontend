

import { create } from 'zustand';
import useUserStore from './useUserStore.js';


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