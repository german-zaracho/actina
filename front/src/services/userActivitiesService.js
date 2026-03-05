import { call } from "./httpService";

// Obtiene todas mis actividades
export function getMyActivities() {
    return call({ 
        url: "my-activities", 
        method: "GET" 
    });
}

// Obtiene actividades por tipo
export function getActivitiesByType(type) {
    return call({ 
        url: `my-activities/type/${type}`, 
        method: "GET" 
    });
}

// Obtiene una actividad especi­fica
export function getActivityById(id) {
    return call({ 
        url: `my-activities/${id}`, 
        method: "GET" 
    });
}

// Crea una nueva actividad
export function createActivity(activityData) {
    return call({ 
        url: "my-activities", 
        method: "POST", 
        body: activityData 
    });
}

// Actualiza una actividad
export function updateActivity(id, activityData) {
    return call({ 
        url: `my-activities/${id}`, 
        method: "PUT", 
        body: activityData 
    });
}

// Elimina una actividad
export function deleteActivity(id) {
    return call({ 
        url: `my-activities/${id}`, 
        method: "DELETE" 
    });
}

// Obtiene las actividades publicas de un amigo
export function getFriendActivities(friendId) {
    return call({ 
        url: `friend-activities/${friendId}`, 
        method: "GET" 
    });
}

// Obtiene actividades públicas (para todos)
export function getPublicActivities() {
    return call({ 
        url: "public-activities", 
        method: "GET" 
    });
}

// Copia una actividad a mis actividades
export function copyActivity(activityId) {
    return call({ 
        url: "copy-activity", 
        method: "POST",
        body: { activityId }
    });
}