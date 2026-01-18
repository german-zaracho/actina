import { call } from "./httpService";

// Obtener todas mis actividades
export function getMyActivities() {
    return call({ 
        url: "my-activities", 
        method: "GET" 
    });
}

// Obtener actividades por tipo
export function getActivitiesByType(type) {
    return call({ 
        url: `my-activities/type/${type}`, 
        method: "GET" 
    });
}

// Obtener una actividad específica
export function getActivityById(id) {
    return call({ 
        url: `my-activities/${id}`, 
        method: "GET" 
    });
}

// Crear nueva actividad
export function createActivity(activityData) {
    return call({ 
        url: "my-activities", 
        method: "POST", 
        body: activityData 
    });
}

// Actualizar actividad
export function updateActivity(id, activityData) {
    return call({ 
        url: `my-activities/${id}`, 
        method: "PUT", 
        body: activityData 
    });
}

// Eliminar actividad
export function deleteActivity(id) {
    return call({ 
        url: `my-activities/${id}`, 
        method: "DELETE" 
    });
}

//Verificar esta ultima de abajo

// Obtener actividades públicas de un amigo
export function getFriendActivities(friendId) {
    return call({ 
        url: `friend-activities/${friendId}`, 
        method: "GET" 
    });
}

// Obtener actividades públicas (para todos)
export function getPublicActivities() {
    return call({ 
        url: "public-activities", 
        method: "GET" 
    });
}