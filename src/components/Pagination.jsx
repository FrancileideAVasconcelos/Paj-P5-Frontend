import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Pagination({ currentPage, totalPages, onPageChange, loading }) {
    const { t } = useTranslation();

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
                {t('geral.proxima') || 'Próxima'}
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    );
}