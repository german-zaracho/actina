import React, { useState, useEffect } from 'react';
import { createMultiplechoiceGroup, updateMultiplechoiceGroup } from '../../services/adminService';
import MultiplechoiceFormContent from './content/MultiplechoiceFormContent';
import '../../css/multiplechoice-form.css';

const MultiplechoiceForm = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        subject: '',
        classification: '',
        questions: [{ question: '', options: ['', '', '', ''], answer: 0, justification: '' }]
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (item) {
            setFormData({
                subject: item.subject || '',
                classification: item.classification || '',
                questions: item.questions?.map(q => ({
                    question: q.question || '',
                    options: q.options || ['', '', '', ''],
                    answer: q.answer,
                    justification: q.justification || ''
                })) || [{ question: '', options: ['', '', '', ''], answer: 0, justification: '' }]
            });
        }
    }, [item]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(validationErrors).length > 0) {
            setError('Por favor corrige los errores en el formulario antes de guardar');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const dataToSave = {
                ...formData,
                questions: formData.questions.map(q => ({
                    ...q,
                    answer: item ? q.answer : q.answer + 1
                }))
            };
            if (item) {
                await updateMultiplechoiceGroup(item._id, dataToSave);
            } else {
                await createMultiplechoiceGroup(dataToSave);
            }
            onSave();
        } catch (err) {
            setError(err.error?.message || 'Error al guardar');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="form-container">
            <h2>{item ? 'Editar' : 'Crear'} Grupo de Multiple Choice</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <MultiplechoiceFormContent
                    formData={formData}
                    setFormData={setFormData}
                    item={item}
                    validationErrors={validationErrors}
                    setValidationErrors={setValidationErrors}
                />
                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
                    <button type="submit" className="btn-save" disabled={saving || Object.keys(validationErrors).length > 0}>
                        {saving ? 'Guardando...' : 'Guardar Grupo'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MultiplechoiceForm;