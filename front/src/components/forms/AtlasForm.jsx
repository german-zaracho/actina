import React, { useState, useEffect } from 'react';
import { createAtlasGroup, updateAtlasGroup } from '../../services/adminService';
import AtlasFormContent from './content/AtlasFormContent';
import '../../css/atlas-form.css';

const AtlasForm = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        type: '',
        subject: '',
        pages: [{ topic: '', image: '', items: [''], flashcardId: '' }]
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (item) {
            setFormData({
                type: item.type || '',
                subject: item.subject || '',
                pages: item.pages || [{ topic: '', image: '', items: [''], flashcardId: '' }]
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
            if (item) {
                await updateAtlasGroup(item._id, formData);
            } else {
                await createAtlasGroup(formData);
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
        <div className="form-container atlas-form">
            <h2>{item ? 'Editar' : 'Crear'} Atlas</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <AtlasFormContent
                    formData={formData}
                    setFormData={setFormData}
                    validationErrors={validationErrors}
                    setValidationErrors={setValidationErrors}
                />
                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
                    <button type="submit" className="btn-save" disabled={saving || Object.keys(validationErrors).length > 0}>
                        {saving ? 'Guardando...' : 'Guardar Atlas'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AtlasForm;