import { call } from "./httpService";

// Multiplechoices - Trabajar con grupos (subject + classification)
export function getAllMultiplechoiceGroups() {
    return call({ url: "admin/multiplechoices", method: "GET" });
}

export function getMultiplechoiceGroupById(id) {
    return call({ url: `admin/multiplechoices/${id}`, method: "GET" });
}

export function createMultiplechoiceGroup(data) {
    return call({ url: "admin/multiplechoices", method: "POST", body: data });
}

export function updateMultiplechoiceGroup(id, data) {
    return call({ url: `admin/multiplechoices/${id}`, method: "PUT", body: data });
}

export function deleteMultiplechoiceGroup(id) {
    return call({ url: `admin/multiplechoices/${id}`, method: "DELETE" });
}


// Flashcards - Trabajar con grupos (subject + topic)
export function getAllFlashcardGroups() {
    return call({ url: "admin/flashcards", method: "GET" });
}

export function getFlashcardGroupById(id) {
    return call({ url: `admin/flashcards/${id}`, method: "GET" });
}

export function createFlashcardGroup(data) {
    return call({ url: "admin/flashcards", method: "POST", body: data });
}

export function updateFlashcardGroup(id, data) {
    return call({ url: `admin/flashcards/${id}`, method: "PUT", body: data });
}

export function deleteFlashcardGroup(id) {
    return call({ url: `admin/flashcards/${id}`, method: "DELETE" });
}

// Atlas - Trabajar con grupos (type + subject)
export function getAllAtlasGroups() {
    return call({ url: "admin/atlas", method: "GET" });
}

export function getAtlasGroupById(id) {
    return call({ url: `admin/atlas/${id}`, method: "GET" });
}

export function createAtlasGroup(data) {
    return call({ url: "admin/atlas", method: "POST", body: data });
}

export function updateAtlasGroup(id, data) {
    return call({ url: `admin/atlas/${id}`, method: "PUT", body: data });
}

export function deleteAtlasGroup(id) {
    return call({ url: `admin/atlas/${id}`, method: "DELETE" });
}