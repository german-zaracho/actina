import { call } from "./httpService";

/**
 * Obtiene sugerencias de autocomplete
 */
export async function getAutocompleteSuggestions(query, types = ['multiplechoice', 'flashcard', 'atlas']) {
    try {
        const params = new URLSearchParams({
            q: query,
            types: types.join(',')
        });
        
        const response = await call({
            url: `search/autocomplete?${params.toString()}`,
            method: "GET"
        });
        
        return response;
    } catch (error) {
        console.error('Error en autocomplete:', error);
        return [];
    }
}

/**
 * Busca actividades
 */
export async function searchActivities(query, types = ['multiplechoice', 'flashcard', 'atlas']) {
    try {
        const params = new URLSearchParams({
            q: query,
            types: types.join(',')
        });
        
        const response = await call({
            url: `search?${params.toString()}`,
            method: "GET"
        });
        
        return response;
    } catch (error) {
        console.error('Error en búsqueda:', error);
        return {
            multiplechoices: [],
            flashcards: [],
            atlas: []
        };
    }
}