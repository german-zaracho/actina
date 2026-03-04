import React from 'react';

const MultiplechoiceFormContent = ({ formData, setFormData, item, validationErrors, setValidationErrors }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (qIndex, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex][field] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const checkDuplicateOptions = (qIndex, options) => {
        const duplicates = {};
        const seen = new Map();
        options.forEach((option, index) => {
            const trimmedOption = option.trim().toLowerCase();
            if (trimmedOption === '') return;
            if (seen.has(trimmedOption)) {
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
                    const questionDuplicates = validationErrors?.[`question_${qIndex}_duplicates`] || {};
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
                                {Object.keys(questionDuplicates).length > 0 && (
                                    <div className="validation-error"> Hay opciones duplicadas</div>
                                )}
                                {q.options.map((option, optIndex) => (
                                    <div key={optIndex} className={`option-row ${q.answer === optIndex ? 'option-correct' : ''}`}>
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

export default MultiplechoiceFormContent;