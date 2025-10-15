import React, { useState, useEffect } from 'react';
import { createMultiplechoiceGroup, updateMultiplechoiceGroup } from './services/adminService';
import './css/multiplechoice-form.css';

const MultiplechoiceForm = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        subject: '',
        classification: '',
        questions: [
            {
                question: '',
                options: ['', '', '', ''],
                answer: 0,
                justification: ''
            }
        ]
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // useEffect(() => {
    //     if (item) {
    //         setFormData({
    //             subject: item.subject || '',
    //             classification: item.classification || '',
    //             questions: item.questions || [{
    //                 question: '',
    //                 options: ['', '', '', ''],
    //                 answer: 0,
    //                 justification: ''
    //             }]
    //         });
    //     }
    // }, [item]);

    useEffect(() => {
    if (item) {
        setFormData({
            subject: item.subject || '',
            classification: item.classification || '',
            questions: item.questions?.map(q => ({
                question: q.question || '',
                options: q.options || ['', '', '', ''],
                answer: (q.answer),
                justification: q.justification || ''
            })) || [{
                question: '',
                options: ['', '', '', ''],
                answer: 0,
                justification: ''
            }]
        });
    }
}, [item]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleQuestionChange = (qIndex, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex][field] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].options[optIndex] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [
                ...formData.questions,
                {
                    question: '',
                    options: ['', '', '', ''],
                    answer: 0,
                    justification: ''
                }
            ]
        });
    };

    const removeQuestion = (qIndex) => {
        if (formData.questions.length === 1) {
            alert('Debe haber al menos una pregunta');
            return;
        }
        const newQuestions = formData.questions.filter((_, i) => i !== qIndex);
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        console.log("itetemtmemte", item);

        try {
            const dataToSave = {
            ...formData,
            questions: formData.questions.map(q => ({
                ...q,
                answer: item ? q.answer : q.answer + 1  // ← Sumar 1 al guardar
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
                <div className="form-row">
                    <div className="form-group">
                        <label>Materia *</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            placeholder="ej: Bioquímica"
                        />
                    </div>

                    <div className="form-group">
                        <label>Clasificación *</label>
                        <input
                            type="text"
                            name="classification"
                            value={formData.classification}
                            onChange={handleChange}
                            required
                            placeholder="ej: Proteínas específicas [3]"
                        />
                    </div>
                </div>

                <div className="questions-section">
                    <div className="questions-header">
                        <h3>Preguntas ({formData.questions.length})</h3>
                        <button type="button" className="btn-add" onClick={addQuestion}>
                            + Agregar Pregunta
                        </button>
                    </div>

                    {formData.questions.map((q, qIndex) => (
                        <div key={qIndex} className="question-card">
                            <div className="question-header">
                                <h4>Pregunta {qIndex + 1}</h4>
                                {formData.questions.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn-remove"
                                        onClick={() => removeQuestion(qIndex)}
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Pregunta *</label>
                                <textarea
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                    required
                                    rows="3"
                                    placeholder="Escribe la pregunta aquí"
                                />
                            </div>

                            <div className="form-group">
                                <label>Opciones *</label>
                                {q.options.map((option, optIndex) => (
                                    <div key={optIndex} className="option-row">
                                        <input
                                            type="radio"
                                            name={`answer-${qIndex}`}
                                            checked={q.answer === optIndex}
                                            onChange={() => handleQuestionChange(qIndex, 'answer', optIndex)}
                                        />
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                            placeholder={`Opción ${optIndex + 1}`}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="form-group">
                                <label>Justificación</label>
                                <textarea
                                    value={q.justification}
                                    onChange={(e) => handleQuestionChange(qIndex, 'justification', e.target.value)}
                                    rows="2"
                                    placeholder="Explicación de la respuesta correcta"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-save" disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar Grupo'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MultiplechoiceForm;