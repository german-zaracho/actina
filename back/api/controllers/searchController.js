// import * as searchService from '../../services/searchService.js';

// async function searchActivities(req, res) {
//     try {
//         const { q: query, type = 'all' } = req.query;

//         if (!query || query.trim().length < 2) {
//             return res.status(400).json({ 
//                 error: { message: 'La búsqueda debe tener al menos 2 caracteres' } 
//             });
//         }

//         const validTypes = ['all', 'multiplechoice', 'flashcard', 'atlas'];
//         if (!validTypes.includes(type)) {
//             return res.status(400).json({ 
//                 error: { message: 'Tipo de actividad inválido' } 
//             });
//         }

//         const results = await searchService.searchActivities(query.trim(), type);
//         res.json(results);
//     } catch (err) {
//         console.error('Error en búsqueda:', err);
//         res.status(500).json({ 
//             error: { message: 'Error al buscar actividades' } 
//         });
//     }
// }

// export { searchActivities };

// import * as searchService from '../../services/searchService.js';

// /**
//  * Endpoint de autocompletado
//  * Retorna sugerencias únicas basadas en el texto ingresado
//  */
// async function getAutocomplete(req, res) {
//     try {
//         const { q, types } = req.query;

//         // Validar query
//         if (!q || q.trim().length < 2) {
//             return res.status(400).json({ 
//                 error: { message: 'La búsqueda debe tener al menos 2 caracteres' } 
//             });
//         }

//         // Parsear tipos
//         const typesArray = types ? types.split(',') : ['multiplechoice', 'flashcard', 'atlas'];
        
//         // Validar tipos
//         const validTypes = ['multiplechoice', 'flashcard', 'atlas'];
//         const filteredTypes = typesArray.filter(t => validTypes.includes(t.trim()));

//         if (filteredTypes.length === 0) {
//             return res.status(400).json({ 
//                 error: { message: 'Tipos de actividad inválidos' } 
//             });
//         }

//         // Obtener sugerencias
//         const suggestions = await searchService.getAutocompleteSuggestions(
//             q.trim(),
//             filteredTypes
//         );

//         res.json(suggestions);

//     } catch (err) {
//         console.error('Error en autocomplete:', err);
//         res.status(500).json({ 
//             error: { message: 'Error al obtener sugerencias' } 
//         });
//     }
// }

// /**
//  * Endpoint de búsqueda completa
//  * Retorna resultados completos agrupados por tipo
//  */
// async function searchActivities(req, res) {
//     try {
//         const { q, types } = req.query;

//         // Validar query
//         if (!q || q.trim().length < 2) {
//             return res.status(400).json({ 
//                 error: { message: 'La búsqueda debe tener al menos 2 caracteres' } 
//             });
//         }

//         // Parsear tipos
//         const typesArray = types ? types.split(',') : ['multiplechoice', 'flashcard', 'atlas'];
        
//         // Validar tipos
//         const validTypes = ['multiplechoice', 'flashcard', 'atlas'];
//         const filteredTypes = typesArray.filter(t => validTypes.includes(t.trim()));

//         if (filteredTypes.length === 0) {
//             return res.status(400).json({ 
//                 error: { message: 'Tipos de actividad inválidos' } 
//             });
//         }

//         // Buscar actividades
//         const results = await searchService.searchActivities(
//             q.trim(),
//             filteredTypes
//         );

//         res.json(results);

//     } catch (err) {
//         console.error('Error en búsqueda:', err);
//         res.status(500).json({ 
//             error: { message: 'Error al buscar actividades' } 
//         });
//     }
// }

// export {
//     getAutocomplete,
//     searchActivities
// };

import * as searchService from '../../services/searchService.js';

/**
 * GET /api/search/autocomplete
 * Retorna sugerencias de autocomplete
 */
async function getAutocomplete(req, res) {
    try {
        const { q, types } = req.query;
        
        if (!q || q.trim().length < 2) {
            return res.json([]);
        }

        const typesArray = types ? types.split(',') : ['multiplechoice', 'flashcard', 'atlas'];
        const suggestions = await searchService.getAutocompleteSuggestions(q.trim(), typesArray);
        
        res.json(suggestions);
    } catch (err) {
        console.error('Error en autocomplete:', err);
        res.status(500).json({ error: { message: err.message } });
    }
}

/**
 * GET /api/search
 * Retorna resultados de búsqueda completos
 */
async function search(req, res) {
    try {
        const { q, types } = req.query;
        
        if (!q || q.trim().length < 2) {
            return res.json({
                multiplechoices: [],
                flashcards: [],
                atlas: []
            });
        }

        const typesArray = types ? types.split(',') : ['multiplechoice', 'flashcard', 'atlas'];
        const results = await searchService.searchActivities(q.trim(), typesArray);
        
        res.json(results);
    } catch (err) {
        console.error('Error en búsqueda:', err);
        res.status(500).json({ error: { message: err.message } });
    }
}

export {
    getAutocomplete,
    search
};