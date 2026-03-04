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