import React, { useState, useEffect } from 'react';
import { createActivity, updateActivity } from '../../services/userActivitiesService';
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
                    questions: [{
                        question: '',
                        options: ['', '', '', ''],
                        answer: 0,
                        justification: ''
                    }]
                };
            case 'flashcard':
                return {
                    ...baseData,
                    subject: '',
                    topic: '',
                    tabs: [{
                        concepts: [''],
                        features: [['']],
                        atlasId: '',
                        atlasPage: ''
                    }]
                };
            case 'atlas':
                return {
                    ...baseData,
                    type: '',
                    subject: '',
                    pages: [{
                        topic: '',
                        image: '',
                        items: [''],
                        flashcardId: ''
                    }]
                };
            default:
                return baseData;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar si hay errores de validación
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

    const renderForm = () => {
        switch (activityType) {
            case 'multiplechoice':
                return <MultiplechoiceFormContent
                    formData={formData}
                    setFormData={setFormData}
                    item={item}
                    validationErrors={validationErrors}
                    setValidationErrors={setValidationErrors}
                />;
            case 'flashcard':
                return <FlashcardFormContent
                    formData={formData}
                    setFormData={setFormData}
                />;
            case 'atlas':
                return <AtlasFormContent
                    formData={formData}
                    setFormData={setFormData}
                    validationErrors={validationErrors}
                    setValidationErrors={setValidationErrors}
                />;
            default:
                return null;
        }
    };

    const getTitle = () => {
        const types = {
            'multiplechoice': 'Multiple Choice',
            'flashcard': 'Flashcard',
            'atlas': 'Atlas'
        };
        return `${item ? 'Editar' : 'Crear'} ${types[activityType]}`;
    };

    const hasValidationErrors = Object.keys(validationErrors).length > 0;

    return (
        <div className="form-container">
            <h2>{getTitle()}</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                {renderForm()}

                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={onCancel}>
                        Cancelar
                    </button>
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

// ===== MULTIPLECHOICE FORM CONTENT =====
const MultiplechoiceFormContent = ({ formData, setFormData, item, validationErrors, setValidationErrors }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (qIndex, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex][field] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    // Función para verificar duplicados en las opciones de una pregunta
    const checkDuplicateOptions = (qIndex, options) => {
        const duplicates = {};
        const seen = new Map();

        options.forEach((option, index) => {
            const trimmedOption = option.trim().toLowerCase();

            // Ignorar opciones vacías
            if (trimmedOption === '') return;

            if (seen.has(trimmedOption)) {
                // Marcar tanto la original como la duplicada
                duplicates[seen.get(trimmedOption)] = true;
                duplicates[index] = true;
            } else {
                seen.set(trimmedOption, index);
            }
        });

        return duplicates;
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].options[optIndex] = value;
        setFormData({ ...formData, questions: newQuestions });

        // Verificar duplicados después de cambiar
        const duplicates = checkDuplicateOptions(qIndex, newQuestions[qIndex].options);

        setValidationErrors(prev => {
            const newErrors = { ...prev };
            if (Object.keys(duplicates).length > 0) {
                newErrors[`question_${qIndex}_duplicates`] = duplicates;
            } else {
                delete newErrors[`question_${qIndex}_duplicates`];
            }
            return newErrors;
        });
    };

    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [...formData.questions, {
                question: '',
                options: ['', '', '', ''],
                answer: 0,
                justification: ''
            }]
        });
    };

    const removeQuestion = (qIndex) => {
        if (formData.questions.length === 1) {
            alert('Debe haber al menos una pregunta');
            return;
        }
        const newQuestions = formData.questions.filter((_, i) => i !== qIndex);
        setFormData({ ...formData, questions: newQuestions });

        // Limpiar errores de la pregunta eliminada
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[`question_${qIndex}_duplicates`];
            return newErrors;
        });
    };

    return (
        <>
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

                {formData.questions.map((q, qIndex) => {
                    const questionDuplicates = validationErrors[`question_${qIndex}_duplicates`] || {};
                    const hasDuplicates = Object.keys(questionDuplicates).length > 0;

                    return (
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
                                {hasDuplicates && (
                                    <div className="error-message-inline">
                                         Las opciones no pueden repetirse
                                    </div>
                                )}
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
                                            className={questionDuplicates[optIndex] ? 'input-error' : ''}
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
                    );
                })}
            </div>
        </>
    );
};

// ===== FLASHCARD FORM CONTENT =====
const FlashcardFormContent = ({ formData, setFormData }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTabChange = (tabIndex, field, value) => {
        const newTabs = [...formData.tabs];
        newTabs[tabIndex][field] = value;
        setFormData({ ...formData, tabs: newTabs });
    };

    const handleConceptChange = (tabIndex, conceptIndex, value) => {
        const newTabs = [...formData.tabs];
        newTabs[tabIndex].concepts[conceptIndex] = value;
        setFormData({ ...formData, tabs: newTabs });
    };

    const handleFeatureChange = (tabIndex, conceptIndex, featureIndex, value) => {
        const newTabs = [...formData.tabs];
        newTabs[tabIndex].features[conceptIndex][featureIndex] = value;
        setFormData({ ...formData, tabs: newTabs });
    };

    const addTab = () => {
        setFormData({
            ...formData,
            tabs: [...formData.tabs, {
                concepts: [''],
                features: [['']],
                atlasId: '',
                atlasPage: ''
            }]
        });
    };

    const removeTab = (tabIndex) => {
        if (formData.tabs.length === 1) {
            alert('Debe haber al menos una tab');
            return;
        }
        const newTabs = formData.tabs.filter((_, i) => i !== tabIndex);
        setFormData({ ...formData, tabs: newTabs });
    };

    const addConcept = (tabIndex) => {
        const newTabs = [...formData.tabs];
        newTabs[tabIndex].concepts.push('');
        newTabs[tabIndex].features.push(['']);
        setFormData({ ...formData, tabs: newTabs });
    };

    const removeConcept = (tabIndex, conceptIndex) => {
        const newTabs = [...formData.tabs];
        if (newTabs[tabIndex].concepts.length === 1) {
            alert('Debe haber al menos un concepto por tab');
            return;
        }
        newTabs[tabIndex].concepts.splice(conceptIndex, 1);
        newTabs[tabIndex].features.splice(conceptIndex, 1);
        setFormData({ ...formData, tabs: newTabs });
    };

    const addFeature = (tabIndex, conceptIndex) => {
        const newTabs = [...formData.tabs];
        newTabs[tabIndex].features[conceptIndex].push('');
        setFormData({ ...formData, tabs: newTabs });
    };

    const removeFeature = (tabIndex, conceptIndex, featureIndex) => {
        const newTabs = [...formData.tabs];
        if (newTabs[tabIndex].features[conceptIndex].length === 1) {
            alert('Debe haber al menos una característica por concepto');
            return;
        }
        newTabs[tabIndex].features[conceptIndex].splice(featureIndex, 1);
        setFormData({ ...formData, tabs: newTabs });
    };

    return (
        <>
            <div className="form-row">
                <div className="form-group">
                    <label>Materia *</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="ej: Anatomía"
                    />
                </div>

                <div className="form-group">
                    <label>Tema *</label>
                    <input
                        type="text"
                        name="topic"
                        value={formData.topic}
                        onChange={handleChange}
                        required
                        placeholder="ej: Nervio peroneo común"
                    />
                </div>
            </div>

            <div className="tabs-section">
                <div className="tabs-header">
                    <h3>Tabs ({formData.tabs.length})</h3>
                    <button type="button" className="btn-add" onClick={addTab}>
                        + Agregar Tab
                    </button>
                </div>

                {formData.tabs.map((tab, tabIndex) => (
                    <div key={tabIndex} className="tab-card">
                        <div className="tab-header">
                            <h4>Tab {tabIndex + 1}</h4>
                            {formData.tabs.length > 1 && (
                                <button
                                    type="button"
                                    className="btn-remove"
                                    onClick={() => removeTab(tabIndex)}
                                >
                                    Eliminar Tab
                                </button>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Atlas ID</label>
                                <input
                                    type="text"
                                    value={tab.atlasId}
                                    onChange={(e) => handleTabChange(tabIndex, 'atlasId', e.target.value)}
                                    placeholder="ID del atlas relacionado"
                                />
                            </div>
                            <div className="form-group">
                                <label>Página del Atlas</label>
                                <input
                                    type="text"
                                    value={tab.atlasPage}
                                    onChange={(e) => handleTabChange(tabIndex, 'atlasPage', e.target.value)}
                                    placeholder="Número de página"
                                />
                            </div>
                        </div>

                        <div className="concepts-section">
                            <div className="concepts-header">
                                <h5>Conceptos ({tab.concepts.length})</h5>

                            </div>

                            {tab.concepts.map((concept, conceptIndex) => (
                                <div key={conceptIndex} className="concept-card">
                                    <div className="concept-header">
                                        <span>Concepto {conceptIndex + 1}</span>
                                        {tab.concepts.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn-remove-small"
                                                onClick={() => removeConcept(tabIndex, conceptIndex)}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>

                                    <input
                                        type="text"
                                        value={concept}
                                        onChange={(e) => handleConceptChange(tabIndex, conceptIndex, e.target.value)}
                                        placeholder="Nombre del concepto"
                                        required
                                        className="concept-input"
                                    />

                                    <div className="features-section">
                                        <label>Características:</label>
                                        {tab.features[conceptIndex]?.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="feature-row">
                                                <textarea
                                                    value={feature}
                                                    onChange={(e) => handleFeatureChange(tabIndex, conceptIndex, featureIndex, e.target.value)}
                                                    placeholder={`Característica ${featureIndex + 1}`}
                                                    required
                                                    rows="2"
                                                />
                                                {tab.features[conceptIndex].length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn-remove-inline"
                                                        onClick={() => removeFeature(tabIndex, conceptIndex, featureIndex)}
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="btn-add-feature"
                                            onClick={() => addFeature(tabIndex, conceptIndex)}
                                        >
                                            + Agregar Característica
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="btn-add-small"
                                onClick={() => addConcept(tabIndex)}
                            >
                                + Concepto
                            </button>

                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

// ===== ATLAS FORM CONTENT =====
const AtlasFormContent = ({ formData, setFormData, validationErrors, setValidationErrors }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePageChange = (pageIndex, field, value) => {
        const newPages = [...formData.pages];
        newPages[pageIndex][field] = value;
        setFormData({ ...formData, pages: newPages });
    };

    // Función para verificar duplicados en los items de una página
    const checkDuplicateItems = (pageIndex, items) => {
        const duplicates = {};
        const seen = new Map();

        items.forEach((item, index) => {
            const trimmedItem = item.trim().toLowerCase();

            // Ignorar items vacíos
            if (trimmedItem === '') return;

            if (seen.has(trimmedItem)) {
                // Marcar tanto el original como el duplicado
                duplicates[seen.get(trimmedItem)] = true;
                duplicates[index] = true;
            } else {
                seen.set(trimmedItem, index);
            }
        });

        return duplicates;
    };

    const handleItemChange = (pageIndex, itemIndex, value) => {
        const newPages = [...formData.pages];
        newPages[pageIndex].items[itemIndex] = value;
        setFormData({ ...formData, pages: newPages });

        // Verificar duplicados después de cambiar
        const duplicates = checkDuplicateItems(pageIndex, newPages[pageIndex].items);

        setValidationErrors(prev => {
            const newErrors = { ...prev };
            if (Object.keys(duplicates).length > 0) {
                newErrors[`page_${pageIndex}_duplicates`] = duplicates;
            } else {
                delete newErrors[`page_${pageIndex}_duplicates`];
            }
            return newErrors;
        });
    };

    const addPage = () => {
        setFormData({
            ...formData,
            pages: [...formData.pages, {
                topic: '',
                image: '',
                items: [''],
                flashcardId: ''
            }]
        });
    };

    const removePage = (pageIndex) => {
        if (formData.pages.length === 1) {
            alert('Debe haber al menos una página');
            return;
        }
        const newPages = formData.pages.filter((_, i) => i !== pageIndex);
        setFormData({ ...formData, pages: newPages });

        // Limpiar errores de la página eliminada
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[`page_${pageIndex}_duplicates`];
            return newErrors;
        });
    };

    const addItem = (pageIndex) => {
        const newPages = [...formData.pages];
        newPages[pageIndex].items.push('');
        setFormData({ ...formData, pages: newPages });
    };

    const removeItem = (pageIndex, itemIndex) => {
        const newPages = [...formData.pages];
        if (newPages[pageIndex].items.length === 1) {
            alert('Debe haber al menos un item por página');
            return;
        }
        newPages[pageIndex].items.splice(itemIndex, 1);
        setFormData({ ...formData, pages: newPages });

        // Recalcular duplicados después de eliminar
        const duplicates = checkDuplicateItems(pageIndex, newPages[pageIndex].items);
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            if (Object.keys(duplicates).length > 0) {
                newErrors[`page_${pageIndex}_duplicates`] = duplicates;
            } else {
                delete newErrors[`page_${pageIndex}_duplicates`];
            }
            return newErrors;
        });
    };

    return (
        <>
            <div className="form-row">
                <div className="form-group">
                    <label>Tipo *</label>
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        placeholder="ej: Básico"
                    />
                </div>

                <div className="form-group">
                    <label>Materia *</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="ej: Anatomía"
                    />
                </div>
            </div>

            <div className="pages-section">
                <div className="pages-header">
                    <h3>Páginas ({formData.pages.length})</h3>
                    <button type="button" className="btn-add" onClick={addPage}>
                        + Agregar Página
                    </button>
                </div>

                {formData.pages.map((page, pageIndex) => {
                    const pageDuplicates = validationErrors[`page_${pageIndex}_duplicates`] || {};
                    const hasDuplicates = Object.keys(pageDuplicates).length > 0;

                    return (
                        <div key={pageIndex} className="page-card">
                            <div className="page-header">
                                <h4>Página {pageIndex + 1}</h4>
                                {formData.pages.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn-remove"
                                        onClick={() => removePage(pageIndex)}
                                    >
                                        Eliminar Página
                                    </button>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Tema *</label>
                                <input
                                    type="text"
                                    value={page.topic}
                                    onChange={(e) => handlePageChange(pageIndex, 'topic', e.target.value)}
                                    required
                                    placeholder="ej: Cráneo: visión anterior"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nombre de imagen *</label>
                                    <input
                                        type="text"
                                        value={page.image}
                                        onChange={(e) => handlePageChange(pageIndex, 'image', e.target.value)}
                                        required
                                        placeholder="ej: craneoVisionAnterior.png"
                                    />
                                    <small className="helper-text">
                                        La imagen debe estar en: back/api/public/assets/images/atlas/
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label>Flashcard ID</label>
                                    <input
                                        type="text"
                                        value={page.flashcardId}
                                        onChange={(e) => handlePageChange(pageIndex, 'flashcardId', e.target.value)}
                                        placeholder="ID del flashcard relacionado (opcional)"
                                    />
                                </div>
                            </div>

                            <div className="items-section">
                                <div className="items-header">
                                    <label>Items ({page.items.length})</label>
                                    <button
                                        type="button"
                                        className="btn-add-small"
                                        onClick={() => addItem(pageIndex)}
                                    >
                                        + Item
                                    </button>
                                </div>

                                {hasDuplicates && (
                                    <div className="error-message-inline">
                                        Los items no pueden repetirse
                                    </div>
                                )}

                                {page.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="item-row">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleItemChange(pageIndex, itemIndex, e.target.value)}
                                            placeholder={`Item ${itemIndex + 1}`}
                                            required
                                            className={pageDuplicates[itemIndex] ? 'input-error' : ''}
                                        />
                                        {page.items.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn-remove-inline"
                                                onClick={() => removeItem(pageIndex, itemIndex)}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default UserActivityForm;