import React, { useState, useEffect } from 'react';
import { createActivity, updateActivity } from '../../services/userActivitiesService';
import MultiplechoiceFormContent from './content/MultiplechoiceFormContent';
import FlashcardFormContent from './content/FlashcardFormContent';
import AtlasFormContent from './content/AtlasFormContent';
import '../../css/multiplechoice-form.css';
import '../../css/flashcard-form.css';
import '../../css/atlas-form.css';
import '../../css/validation-styles.css';

const UserActivityForm = ({ activityType, item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(getInitialFormData(activityType));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (item) {
            setFormData(item);
        } else {
            setFormData(getInitialFormData(activityType));
        }
    }, [item, activityType]);

    function getInitialFormData(type) {
        const baseData = { activityType: type };
        switch (type) {
            case 'multiplechoice':
                return {
                    ...baseData,
                    subject: '',
                    classification: '',
                    questions: [{ question: '', options: ['', '', '', ''], answer: 0, justification: '' }]
                };
            case 'flashcard':
                return {
                    ...baseData,
                    subject: '',
                    topic: '',
                    tabs: [{ concepts: [''], features: [['']], atlasId: '', atlasPage: '' }]
                };
            case 'atlas':
                return {
                    ...baseData,
                    type: '',
                    subject: '',
                    pages: [{ topic: '', image: '', items: [''], flashcardId: '' }]
                };
            default:
                return baseData;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(validationErrors).length > 0) {
            setError('Por favor corrige los errores en el formulario antes de guardar');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const dataToSave = { ...formData };
            if (activityType === 'multiplechoice') {
                dataToSave.questions = dataToSave.questions.map(q => ({
                    ...q,
                    answer: item ? q.answer : q.answer + 1
                }));
            }
            if (item) {
                await updateActivity(item._id, dataToSave);
            } else {
                await createActivity(dataToSave);
            }
            onSave();
        } catch (err) {
            setError(err.error?.message || 'Error al guardar');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const getTitle = () => {
        const types = { multiplechoice: 'Multiple Choice', flashcard: 'Flashcard', atlas: 'Atlas' };
        return `${item ? 'Editar' : 'Crear'} ${types[activityType]}`;
    };

    const hasValidationErrors = Object.keys(validationErrors).length > 0;

    return (
        <div className="form-container">
            <h2>{getTitle()}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                {activityType === 'multiplechoice' && (
                    <MultiplechoiceFormContent
                        formData={formData}
                        setFormData={setFormData}
                        item={item}
                        validationErrors={validationErrors}
                        setValidationErrors={setValidationErrors}
                    />
                )}
                {activityType === 'flashcard' && (
                    <FlashcardFormContent formData={formData} setFormData={setFormData} />
                )}
                {activityType === 'atlas' && (
                    <AtlasFormContent
                        formData={formData}
                        setFormData={setFormData}
                        validationErrors={validationErrors}
                        setValidationErrors={setValidationErrors}
                    />
                )}
                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
                    <button
                        type="submit"
                        className="btn-save"
                        disabled={saving || hasValidationErrors}
                        title={hasValidationErrors ? 'Corrige los errores antes de guardar' : ''}
                    >
                        {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserActivityForm;