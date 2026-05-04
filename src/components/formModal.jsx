/**
 * @file formModal.jsx
 * @description Componente de interface (Modal) reutilizável para a criação e edição de entidades.
 * Adapta dinamicamente o formulário apresentado consoante o tipo de dados ('client' ou 'lead').
 */

import {useState, useEffect} from 'react';
import {STATUS_OPTIONS} from "../utils/constants.js";
import '../styles/ClientLead.css';
import {useTranslation} from "react-i18next";

/**
 * Componente funcional que apresenta um modal sobreposto com um formulário contextual.
 *
 * @component
 * @param {Object} props - Propriedades passadas ao componente.
 * @param {boolean} props.isOpen - Define se o modal está atualmente visível no ecrã.
 * @param {string} props.type - Tipo de entidade a gerir ('client' ou 'lead'). Determina os campos renderizados.
 * @param {Object} props.initialData - Dados pré-existentes para preencher o formulário (em modo de edição).
 * @param {Function} props.onClose - Função callback invocada para fechar o modal sem submeter dados.
 * @param {Function} props.onSave - Função callback invocada na submissão do formulário com os novos dados.
 * @returns {JSX.Element|null} O modal renderizado, ou null caso isOpen seja falso.
 */
export default function FormModal({isOpen, type, initialData, onClose, onSave}) {
    const [formData, setFormData] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({...initialData});
        }
    }, [isOpen, initialData]);

    if (!isOpen || !formData) return null;

    // Removemos a função isFormValid. Verificamos APENAS se houve alguma alteração nos dados
    const teveAlteracao = JSON.stringify(initialData) !== JSON.stringify(formData);
    const isEdit = !!initialData.id;

    const titleKey = type === 'client'
        ? (isEdit ? 'form_modal.editar_client' : 'form_modal.adicionar_client')
        : (isEdit ? 'form_modal.editar_lead' : 'form_modal.adicionar_lead');

    /**
     * Interceta a submissão nativa do formulário e passa os dados para a função onSave.
     * @param {React.FormEvent} e - Evento de submissão.
     */
    const handleSubmit = (e) => {
        e.preventDefault(); // O navegador só chega aqui se os balõezinhos todos passarem na validação!
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{t(titleKey)}</h3>
                <form onSubmit={handleSubmit} className="custom-form">

                    {type === 'client' ? (
                        <>
                            <div className="form-group">
                                <label>{t('form_modal.nome')} *</label>
                                <input
                                    type="text"
                                    value={formData.nome || ''}
                                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                                    required
                                    minLength={3}
                                    maxLength={100}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('geral.email')}</label>
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                                    title="Insira um formato de email válido (ex: ze@oficina.com)."
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('geral.telefone')}</label>
                                {/* Aqui aplicamos a mesma regra Regex do teu backend Java para evitar o Erro 400! */}
                                <input
                                    type="text"
                                    value={formData.telefone || ''}
                                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                                    pattern="^(\+)?\d{9,13}$"
                                    title="O telefone deve ter entre 9 a 13 dígitos."
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('clients.detalhes.empresa')} *</label>
                                <input
                                    type="text"
                                    value={formData.empresa || ''}
                                    onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-group">
                                <label>{t('leads.detalhes.titulo')} *</label>
                                <input
                                    type="text"
                                    value={formData.titulo || formData.nome || ''}
                                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                                    required
                                    minLength={3}
                                    maxLength={100}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('leads.detalhes.descricao')} *</label>
                                <textarea
                                    value={formData.descricao || ''}
                                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                                    required
                                    minLength={3}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        minHeight: '80px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc'
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('Leads.detalhes.estado')}</label>
                                <select
                                    value={formData.estado || 0}
                                    onChange={(e) => setFormData({...formData, estado: parseInt(e.target.value)})}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc'
                                    }}
                                >
                                    {STATUS_OPTIONS.map((opcao) => (
                                        <option key={opcao.id} value={opcao.id}>
                                            {t(opcao.key)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            {t('geral.cancelar')}
                        </button>
                        <button
                            type="submit"
                            className="btn-save"
                            disabled={!teveAlteracao} // Bloqueia o clique APENAS se não houver mudanças reais
                        >
                            {isEdit ? t('form_modal.salvar') : t('form_modal.adicionar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}