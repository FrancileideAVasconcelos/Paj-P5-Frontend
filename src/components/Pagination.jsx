/**
 * @file Pagination.jsx
 * @description Componente de interface reutilizável para a navegação por páginas em listas (Clientes, Leads, Utilizadores).
 * Gere controlos "Anterior" e "Próxima", ajustando o seu estado consoante a página atual.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Componente funcional que desenha os botões de paginação.
 *
 * @component
 * @param {Object} props - Propriedades passadas ao componente.
 * @param {number} props.currentPage - O número da página atual.
 * @param {number} props.totalPages - O total de páginas disponíveis.
 * @param {Function} props.onPageChange - Função disparada quando se clica para mudar de página.
 * @param {boolean} props.loading - Indica se os dados estão a carregar para ocultar/desativar a paginação.
 * @returns {JSX.Element|null} Controlos de paginação ou 'null' se houver 1 ou menos páginas.
 */
export default function Pagination({ currentPage, totalPages, onPageChange, loading }) {
    const { t } = useTranslation();

    // Esconde a paginação se só houver uma página ou se estiver a carregar
    if (totalPages <= 1 || loading) return null;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            marginTop: '30px',
            paddingBottom: '20px'
        }}>
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="btn-save"
                style={{
                    backgroundColor: currentPage === 1 ? '#cbd5e1' : '#3b82f6',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <i className="fa-solid fa-chevron-left"></i>
                {t('geral.anterior')}
            </button>

            <span style={{ fontWeight: 'bold', color: '#64748b' }}>
                {t('geral.pagina')} {currentPage} {t('geral.de')} {totalPages}
            </span>

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="btn-save"
                style={{
                    backgroundColor: currentPage === totalPages ? '#cbd5e1' : '#3b82f6',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                {t('geral.proxima')}
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    );
}