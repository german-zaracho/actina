import { call } from "./httpService";

// Obtener favoritos del usuario
export function getFavorites() {
    return call({ 
        url: "favorites", 
        method: "GET" 
    });
}

// Agregar actividad a favoritos
export function addToFavorites(activityId) {
    return call({ 
        url: "favorites", 
        method: "POST", 
        body: { activityId } 
    });
}

// Eliminar actividad de favoritos
export function removeFromFavorites(activityId) {
    return call({ 
        url: `favorites/${activityId}`, 
        method: "DELETE" 
    });
}

// Verificar si una actividad está en favoritos
export function isFavorite(activityId) {
    return call({ 
        url: `favorites/check/${activityId}`, 
        method: "GET" 
    });
}