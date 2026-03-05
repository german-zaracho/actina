import { call } from "./httpService";

// Obtiene favoritos del usuario
export function getFavorites() {
    return call({ 
        url: "favorites", 
        method: "GET" 
    });
}

// Agrega una actividad a favoritos
export function addToFavorites(activityId) {
    return call({ 
        url: "favorites", 
        method: "POST", 
        body: { activityId } 
    });
}

// Elimina una actividad de favoritos
export function removeFromFavorites(activityId) {
    return call({ 
        url: `favorites/${activityId}`, 
        method: "DELETE" 
    });
}

// Verifica si una actividad está en favoritos
export function isFavorite(activityId) {
    return call({ 
        url: `favorites/check/${activityId}`, 
        method: "GET" 
    });
}