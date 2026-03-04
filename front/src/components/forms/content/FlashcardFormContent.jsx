import React from 'react';

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
            tabs: [...formData.tabs, { concepts: [''], features: [['']], atlasId: '', atlasPage: '' }]
        });
    };

    const removeTab = (tabIndex) => {
        if (formData.tabs.length === 1) { alert('Debe haber al menos una tab'); return; }
        setFormData({ ...formData, tabs: formData.tabs.filter((_, i) => i !== tabIndex) });
    };

    const addConcept = (tabIndex) => {
        const newTabs = [...formData.tabs];
        newTabs[tabIndex].concepts.push('');
        newTabs[tabIndex].features.push(['']);
        setFormData({ ...formData, tabs: newTabs });
    };

    const removeConcept = (tabIndex, conceptIndex) => {
        const newTabs = [...formData.tabs];
        if (newTabs[tabIndex].concepts.length === 1) { alert('Debe haber al menos un concepto por tab'); return; }
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
        if (newTabs[tabIndex].features[conceptIndex].length === 1) { alert('Debe haber al menos una característica'); return; }
        newTabs[tabIndex].features[conceptIndex].splice(featureIndex, 1);
        setFormData({ ...formData, tabs: newTabs });
    };

    return (
        <>
            <div className="form-row">
                <div className="form-group">
                    <label>Materia *</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="ej: Anatomía" />
                </div>
                <div className="form-group">
                    <label>Tema *</label>
                    <input type="text" name="topic" value={formData.topic} onChange={handleChange} required placeholder="ej: Nervio peroneo común" />
                </div>
            </div>

            <div className="tabs-section">
                <div className="tabs-header">
                    <h3>Tabs ({formData.tabs.length})</h3>
                    <button type="button" className="btn-add" onClick={addTab}>+ Agregar Tab</button>
                </div>

                {formData.tabs.map((tab, tabIndex) => (
                    <div key={tabIndex} className="tab-card">
                        <div className="tab-header">
                            <h4>Tab {tabIndex + 1}</h4>
                            {formData.tabs.length > 1 && (
                                <button type="button" className="btn-remove" onClick={() => removeTab(tabIndex)}>
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
                                <button type="button" className="btn-add-small" onClick={() => addConcept(tabIndex)}>
                                    + Concepto
                                </button>
                            </div>

                            {tab.concepts.map((concept, conceptIndex) => (
                                <div key={conceptIndex} className="concept-card">
                                    <div className="concept-header">
                                        <span>Concepto {conceptIndex + 1}</span>
                                        {tab.concepts.length > 1 && (
                                            <button type="button" className="btn-remove-small" onClick={() => removeConcept(tabIndex, conceptIndex)}>×</button>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        className="concept-input"
                                        value={concept}
                                        onChange={(e) => handleConceptChange(tabIndex, conceptIndex, e.target.value)}
                                        placeholder="Nombre del concepto"
                                    />
                                    <div className="features-section">
                                        <label>Características:</label>
                                        {tab.features[conceptIndex]?.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="feature-row">
                                                <textarea
                                                    value={feature}
                                                    onChange={(e) => handleFeatureChange(tabIndex, conceptIndex, featureIndex, e.target.value)}
                                                    rows="2"
                                                    placeholder="Característica"
                                                />
                                                {tab.features[conceptIndex].length > 1 && (
                                                    <button type="button" className="btn-remove-inline" onClick={() => removeFeature(tabIndex, conceptIndex, featureIndex)}>×</button>
                                                )}
                                            </div>
                                        ))}
                                        <button type="button" className="btn-add-feature" onClick={() => addFeature(tabIndex, conceptIndex)}>
                                            + Agregar Característica
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default FlashcardFormContent;