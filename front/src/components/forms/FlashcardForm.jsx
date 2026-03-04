import React, { useState, useEffect } from 'react';
import { createFlashcardGroup, updateFlashcardGroup } from '../../services/adminService';
import FlashcardFormContent from './content/FlashcardFormContent';
import '../../css/flashcard-form.css';

const FlashcardForm = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        subject: '',
        topic: '',
        tabs: [{ concepts: [''], features: [['']], atlasId: '', atlasPage: '' }]
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (item) {
            setFormData({
                subject: item.subject || '',
                topic: item.topic || '',
                tabs: item.tabs || [{ concepts: [''], features: [['']], atlasId: '', atlasPage: '' }]
            });
        }
    }, [item]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            if (item) {
                await updateFlashcardGroup(item._id, formData);
            } else {
                await createFlashcardGroup(formData);
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
        <div className="form-container flashcard-form">
            <h2>{item ? 'Editar' : 'Crear'} Grupo de Flashcards</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <FlashcardFormContent formData={formData} setFormData={setFormData} />
                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
                    <button type="submit" className="btn-save" disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar Grupo'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FlashcardForm;