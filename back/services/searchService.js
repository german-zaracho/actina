
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);

// Obtiene sugerencias unicas para el autocompletado usando Atlas Search Autocomplete

async function getAutocompleteSuggestions(query, types) {
    await client.connect();
    
    const suggestions = new Set();

    // Busca en Multiplechoices
    if (types.includes('multiplechoice')) {
        try {
            const multiplechoices = await db.collection('multiplechoices')
                .aggregate([
                    {
                        $search: {
                            index: "multiplechoice_autocomplete_index",
                            autocomplete: {
                                query: query,
                                path: "subject",
                                fuzzy: {
                                    maxEdits: 1,
                                    prefixLength: 2
                                }
                            }
                        }
                    },
                    { $limit: 10 },
                    { $project: { subject: 1, classification: 1, _id: 0 } }
                ])
                .toArray();

            multiplechoices.forEach(mc => {
                if (mc.subject) suggestions.add(mc.subject);
            });

            // También busca en classification
            const byClassification = await db.collection('multiplechoices')
                .aggregate([
                    {
                        $search: {
                            index: "multiplechoice_autocomplete_index",
                            autocomplete: {
                                query: query,
                                path: "classification",
                                fuzzy: {
                                    maxEdits: 1,
                                    prefixLength: 2
                                }
                            }
                        }
                    },
                    { $limit: 10 },
                    { $project: { classification: 1, _id: 0 } }
                ])
                .toArray();

            byClassification.forEach(mc => {
                if (mc.classification) suggestions.add(mc.classification);
            });

        } catch (err) {
            console.error('Error en autocomplete multiplechoice:', err.message);
        }
    }

    // Busca en Flashcards
    if (types.includes('flashcard')) {
        try {
            const flashcards = await db.collection('flashcards')
                .aggregate([
                    {
                        $search: {
                            index: "flashcard_autocomplete_index",
                            autocomplete: {
                                query: query,
                                path: "subject",
                                fuzzy: {
                                    maxEdits: 1,
                                    prefixLength: 2
                                }
                            }
                        }
                    },
                    { $limit: 10 },
                    { $project: { subject: 1, topic: 1, _id: 0 } }
                ])
                .toArray();

            flashcards.forEach(fc => {
                if (fc.subject) suggestions.add(fc.subject);
            });

            // También busca en topic
            const byTopic = await db.collection('flashcards')
                .aggregate([
                    {
                        $search: {
                            index: "flashcard_autocomplete_index",
                            autocomplete: {
                                query: query,
                                path: "topic",
                                fuzzy: {
                                    maxEdits: 1,
                                    prefixLength: 2
                                }
                            }
                        }
                    },
                    { $limit: 10 },
                    { $project: { topic: 1, _id: 0 } }
                ])
                .toArray();

            byTopic.forEach(fc => {
                if (fc.topic) suggestions.add(fc.topic);
            });

        } catch (err) {
            console.error('Error en autocomplete flashcard:', err.message);
        }
    }

    // Busca en Atlas
    if (types.includes('atlas')) {
        try {
            const atlas = await db.collection('atlas')
                .aggregate([
                    {
                        $search: {
                            index: "atlas_autocomplete_index",
                            autocomplete: {
                                query: query,
                                path: "type",
                                fuzzy: {
                                    maxEdits: 1,
                                    prefixLength: 2
                                }
                            }
                        }
                    },
                    { $limit: 10 },
                    { $project: { type: 1, subject: 1, _id: 0 } }
                ])
                .toArray();

            atlas.forEach(a => {
                if (a.type) suggestions.add(a.type);
            });

            // También busca en subject
            const bySubject = await db.collection('atlas')
                .aggregate([
                    {
                        $search: {
                            index: "atlas_autocomplete_index",
                            autocomplete: {
                                query: query,
                                path: "subject",
                                fuzzy: {
                                    maxEdits: 1,
                                    prefixLength: 2
                                }
                            }
                        }
                    },
                    { $limit: 10 },
                    { $project: { subject: 1, _id: 0 } }
                ])
                .toArray();

            bySubject.forEach(a => {
                if (a.subject) suggestions.add(a.subject);
            });

        } catch (err) {
            console.error('Error en autocomplete atlas:', err.message);
        }
    }

    // Convertir Set a Array, limita y ordena
    return Array.from(suggestions)
        .slice(0, 10)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

// Normaliza texto removiendo acentos
function normalizeText(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Encuentra palabras que coinciden con el query en un texto, solo considera coincidencias significativas (mínimo 3 caracteres)
function findMatchingWords(text, query) {
    if (!text || !query) return [];
    
    const queryLower = query.toLowerCase().trim();
    const queryNormalized = normalizeText(queryLower);
    
    // Si el query es muy corto, requerir coincidencia desde el inicio
    if (queryLower.length < 2) return [];
    
    const words = text.split(/\s+/);
    const matches = [];
    
    words.forEach(word => {
        // Limpia la palabra de puntuación
        const wordClean = word.replace(/[.,!?;:()¿¡""]/g, '');
        const wordLower = wordClean.toLowerCase();
        const wordNormalized = normalizeText(wordLower);
        
        // La palabra debe tener al menos 3 caracteres
        if (!wordLower || wordLower.length < 3) return;
        
        // Si el query tiene menos de 3 caracteres, solo coincidencia al inicio
        if (queryLower.length < 3) {
            if (wordNormalized.startsWith(queryNormalized)) {
                matches.push(wordClean);
            }
        } else {
            // Query >= 3 caracteres: busca como subcadena
            // Verifica que la coincidencia sea significativa (no solo una letra)
            const matchIndex = wordNormalized.indexOf(queryNormalized);
            if (matchIndex !== -1) {
                // Asegura que la coincidencia es del query completo, no solo una letra
                matches.push(wordClean);
            }
        }
    });
    
    // Elimina duplicados
    return [...new Set(matches)];
}

//Extrae términos coincidentes de un documento

function extractMatchedTerms(doc, query, type) {
    const matches = new Set();
    const queryNormalized = normalizeText(query.toLowerCase().trim());
    
    // Función auxiliar para verificar y agregar coincidencias
    const addIfMatches = (text) => {
        if (!text) return;
        
        const words = findMatchingWords(text, query);
        words.forEach(word => {
            const wordNormalized = normalizeText(word.toLowerCase());
            if (wordNormalized.includes(queryNormalized) && word.length >= 3) {
                matches.add(word);
            }
        });
    };
    
    if (type === 'multiplechoice') {
        addIfMatches(doc.subject);
        addIfMatches(doc.classification);
        
        if (doc.questions) {
            doc.questions.forEach(q => {
                addIfMatches(q.question);
                
                if (q.options && Array.isArray(q.options)) {
                    q.options.forEach(option => addIfMatches(option));
                }
                
                if (q.justification) {
                    addIfMatches(q.justification);
                }
            });
        }
    } else if (type === 'flashcard') {
        addIfMatches(doc.subject);
        addIfMatches(doc.topic);
        
        if (doc.tabs) {
            doc.tabs.forEach(tab => {
                if (tab.concepts) {
                    tab.concepts.forEach(concept => addIfMatches(concept));
                }
                
                if (tab.features && Array.isArray(tab.features)) {
                    tab.features.forEach(featureArray => {
                        if (Array.isArray(featureArray)) {
                            featureArray.forEach(feature => addIfMatches(feature));
                        }
                    });
                }
            });
        }
    } else if (type === 'atlas') {
        addIfMatches(doc.type);
        addIfMatches(doc.subject);
        
        if (doc.pages) {
            doc.pages.forEach(page => {
                addIfMatches(page.topic);
                
                if (page.items) {
                    page.items.forEach(item => addIfMatches(item));
                }
            });
        }
    }
    
    // Filtrar coincidencias válidas
    let filtered = Array.from(matches).filter(term => {
        const termNormalized = normalizeText(term.toLowerCase());
        return term.length >= 3 && termNormalized.includes(queryNormalized);
    });
    
    if (filtered.length === 0) {
        console.warn(`Búsqueda exhaustiva para "${query}" en documento ${doc._id}`);
        
        // Función para extraer todos los strings del documento
        const extractAllStrings = (obj, strings = [], depth = 0) => {
            if (depth > 10 || !obj) return strings;
            
            if (typeof obj === 'string' && obj.trim().length > 0) {
                strings.push(obj.trim());
            } else if (Array.isArray(obj)) {
                obj.forEach(item => extractAllStrings(item, strings, depth + 1));
            } else if (typeof obj === 'object' && obj !== null) {
                Object.entries(obj).forEach(([key, value]) => {
                    // Evitar campos internos de MongoDB
                    if (!key.startsWith('_') && key !== 'createdAt' && key !== 'updatedAt' && key !== 'userId') {
                        extractAllStrings(value, strings, depth + 1);
                    }
                });
            }
            
            return strings;
        };
        
        // Extraer los strings del documento
        const allStrings = extractAllStrings(doc);
        console.log(`📝 Strings extraídos: ${allStrings.length}`);
        
        // Buscar en cada string
        const foundWords = new Set();
        allStrings.forEach(str => {
            // Extraer palabras de 3+ caracteres que contengan el query
            const words = str.match(/\b[a-záéíóúñüA-ZÁÉÍÓÚÑÜ]{3,}\b/g) || [];
            
            words.forEach(word => {
                const wordNormalized = normalizeText(word.toLowerCase());
                if (wordNormalized.includes(queryNormalized)) {
                    foundWords.add(word);
                }
            });
        });
        
        // Ordenar por relevancia
        filtered = Array.from(foundWords)
            .sort((a, b) => {
                const aNorm = normalizeText(a.toLowerCase());
                const bNorm = normalizeText(b.toLowerCase());
                
                // 1. Coincidencia exacta primero
                if (aNorm === queryNormalized && bNorm !== queryNormalized) return -1;
                if (aNorm !== queryNormalized && bNorm === queryNormalized) return 1;
                
                // 2. Que empiece con el query
                if (aNorm.startsWith(queryNormalized) && !bNorm.startsWith(queryNormalized)) return -1;
                if (!aNorm.startsWith(queryNormalized) && bNorm.startsWith(queryNormalized)) return 1;
                
                // 3. Palabras más cortas (más relevantes)
                return a.length - b.length;
            })
            .slice(0, 5); // Máximo 5 términos
        
        if (filtered.length > 0) {
            console.log(`Encontradas ${filtered.length} coincidencias exhaustivas:`, filtered);
        } else {
            console.error(`No se encontro ninguna coincidencia para "${query}"`, {
                type,
                id: doc._id,
                subject: doc.subject,
                stringsExtraidos: allStrings.length,
                primeros3Strings: allStrings.slice(0, 3)
            });
        }
    }
    
    return filtered;
}

// Busca actividades completas

async function searchActivities(query, types) {
    await client.connect();
    
    const results = {
        multiplechoices: [],
        flashcards: [],
        atlas: []
    };

    // Buscar en Multiplechoices
    if (types.includes('multiplechoice')) {
        try {
            const multiplechoices = await db.collection('multiplechoices')
                .aggregate([
                    {
                        $search: {
                            index: "multiplechoice_autocomplete_index",
                            compound: {
                                should: [
                                    {
                                        autocomplete: {
                                            query: query,
                                            path: "subject",
                                            fuzzy: { maxEdits: 1 }
                                        }
                                    },
                                    {
                                        autocomplete: {
                                            query: query,
                                            path: "classification",
                                            fuzzy: { maxEdits: 1 }
                                        }
                                    },
                                    {
                                        autocomplete: {
                                            query: query,
                                            path: "questions.question",
                                            fuzzy: { maxEdits: 1 }
                                        }
                                    }
                                ],
                                minimumShouldMatch: 1
                            }
                        }
                    },
                    { $limit: 50 }
                ])
                .toArray();

            results.multiplechoices = multiplechoices.map(mc => ({
                ...mc,
                type: 'multiplechoice',
                matchedTerms: extractMatchedTerms(mc, query, 'multiplechoice')
            }));
        } catch (err) {
            console.error('Error en búsqueda multiplechoice:', err.message);
        }
    }

    // Buscar en Flashcards
    if (types.includes('flashcard')) {
        try {
            const flashcards = await db.collection('flashcards')
                .aggregate([
                    {
                        $search: {
                            index: "flashcard_autocomplete_index",
                            compound: {
                                should: [
                                    {
                                        autocomplete: {
                                            query: query,
                                            path: "subject",
                                            fuzzy: { maxEdits: 1 }
                                        }
                                    },
                                    {
                                        autocomplete: {
                                            query: query,
                                            path: "topic",
                                            fuzzy: { maxEdits: 1 }
                                        }
                                    },
                                    {
                                        autocomplete: {
                                            query: query,
                                            path: "tabs.concepts",
                                            fuzzy: { maxEdits: 1 }
                                        }
                                    }
                                ],
                                minimumShouldMatch: 1
                            }
                        }
                    },
                    { $limit: 50 }
                ])
                .toArray();

            results.flashcards = flashcards.map(fc => ({
                ...fc,
                type: 'flashcard',
                matchedTerms: extractMatchedTerms(fc, query, 'flashcard')
            }));
        } catch (err) {
            console.error('Error en búsqueda flashcard:', err.message);
        }
    }

    // Buscar en Atlas
    if (types.includes('atlas')) {
        try {
            const atlas = await db.collection('atlas')
                .aggregate([
                    {
                        $search: {
                            index: "atlas_autocomplete_index",
                            compound: {
                                should: [
                                    {
                                        autocomplete: {
                                            query: query,
                                            path: "type",
                                            fuzzy: { maxEdits: 1 }
                                        }
                                    },
                                    {
                                        autocomplete: {
                                            query: query,
                                            path: "subject",
                                            fuzzy: { maxEdits: 1 }
                                        }
                                    },
                                    {
                                        autocomplete: {
                                            query: query,
                                            path: "pages.topic",
                                            fuzzy: { maxEdits: 1 }
                                        }
                                    },
                                    {
                                        autocomplete: {
                                            query: query,
                                            path: "pages.items",
                                            fuzzy: { maxEdits: 1 }
                                        }
                                    }
                                ],
                                minimumShouldMatch: 1
                            }
                        }
                    },
                    { $limit: 50 }
                ])
                .toArray();

            results.atlas = atlas.map(a => ({
                ...a,
                type: 'atlas',
                matchedTerms: extractMatchedTerms(a, query, 'atlas')
            }));
        } catch (err) {
            console.error('Error en búsqueda atlas:', err.message);
        }
    }

    return results;
}

export {
    getAutocompleteSuggestions,
    searchActivities
};