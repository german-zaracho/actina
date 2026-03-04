import React from 'react';

const AtlasFormContent = ({ formData, setFormData, validationErrors, setValidationErrors }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePageChange = (pageIndex, field, value) => {
        const newPages = [...formData.pages];
        newPages[pageIndex][field] = value;
        setFormData({ ...formData, pages: newPages });
    };

    const checkDuplicateItems = (pageIndex, items) => {
        const duplicates = {};
        const seen = new Map();
        items.forEach((item, index) => {
            const trimmedItem = item.trim().toLowerCase();
            if (trimmedItem === '') return;
            if (seen.has(trimmedItem)) {
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
            pages: [...formData.pages, { topic: '', image: '', items: [''], flashcardId: '' }]
        });
    };

    const removePage = (pageIndex) => {
        if (formData.pages.length === 1) { alert('Debe haber al menos una página'); return; }
        const newPages = formData.pages.filter((_, i) => i !== pageIndex);
        setFormData({ ...formData, pages: newPages });
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
        if (newPages[pageIndex].items.length === 1) { alert('Debe haber al menos un item por página'); return; }
        newPages[pageIndex].items.splice(itemIndex, 1);
        setFormData({ ...formData, pages: newPages });
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
                    <input type="text" name="type" value={formData.type} onChange={handleChange} required placeholder="ej: Básico" />
                </div>
                <div className="form-group">
                    <label>Materia *</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="ej: Anatomía" />
                </div>
            </div>

            <div className="pages-section">
                <div className="pages-header">
                    <h3>Páginas ({formData.pages.length})</h3>
                    <button type="button" className="btn-add" onClick={addPage}>+ Agregar Página</button>
                </div>

                {formData.pages.map((page, pageIndex) => {
                    const pageDuplicates = validationErrors?.[`page_${pageIndex}_duplicates`] || {};
                    const hasDuplicates = Object.keys(pageDuplicates).length > 0;

                    return (
                        <div key={pageIndex} className="page-card">
                            <div className="page-header">
                                <h4>Página {pageIndex + 1}</h4>
                                {formData.pages.length > 1 && (
                                    <button type="button" className="btn-remove" onClick={() => removePage(pageIndex)}>
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
                                    <button type="button" className="btn-add-small" onClick={() => addItem(pageIndex)}>
                                        + Item
                                    </button>
                                </div>

                                {hasDuplicates && (
                                    <div className="validation-error"> Hay items duplicados en esta página</div>
                                )}

                                {page.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className={`item-row ${pageDuplicates[itemIndex] ? 'item-duplicate' : ''}`}>
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleItemChange(pageIndex, itemIndex, e.target.value)}
                                            placeholder={`Item ${itemIndex + 1}`}
                                            required
                                            className={pageDuplicates[itemIndex] ? 'input-error' : ''}
                                        />
                                        {page.items.length > 1 && (
                                            <button type="button" className="btn-remove-inline" onClick={() => removeItem(pageIndex, itemIndex)}>
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

export default AtlasFormContent;