import { call } from "./httpService";

export function getFlashcards() {
    return call({ url: "flashcards" });
}

export function getFlashcard(id) {
    return call({ url: `flashcards/${id}` });
}

export default {
    getFlashcards,
    getFlashcard
};