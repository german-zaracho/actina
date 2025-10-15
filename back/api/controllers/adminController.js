import * as multiplechoiceService from '../../services/multiplechoiceService.js';
import * as flashcardService from '../../services/flashcardService.js';
import * as atlasService from '../../services/atlasService.js';

// ===== MULTIPLECHOICES =====
async function getAllMultiplechoices(req, res) {
    try {
        const multiplechoices = await multiplechoiceService.getAll();
        res.json(multiplechoices);
    } catch (err) {
        res.status(500).json({ error: { message: err.message } });
    }
}

async function createMultiplechoice(req, res) {
    try {
        const newItem = await multiplechoiceService.create(req.body);
        res.status(201).json({ message: 'Multiple choice created', data: newItem });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function updateMultiplechoice(req, res) {
    try {
        await multiplechoiceService.update(req.params.id, req.body);
        res.json({ message: 'Multiple choice updated' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function deleteMultiplechoice(req, res) {
    try {
        await multiplechoiceService.delete(req.params.id);
        res.json({ message: 'Multiple choice deleted' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

// ===== FLASHCARDS =====
async function getAllFlashcards(req, res) {
    try {
        const flashcards = await flashcardService.getAll();
        res.json(flashcards);
    } catch (err) {
        res.status(500).json({ error: { message: err.message } });
    }
}

async function createFlashcard(req, res) {
    try {
        const newItem = await flashcardService.create(req.body);
        res.status(201).json({ message: 'Flashcard created', data: newItem });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function updateFlashcard(req, res) {
    try {
        await flashcardService.update(req.params.id, req.body);
        res.json({ message: 'Flashcard updated' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function deleteFlashcard(req, res) {
    try {
        await flashcardService.deleteFlashcard(req.params.id);
        res.json({ message: 'Flashcard deleted' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

// ===== ATLAS =====
async function getAllAtlas(req, res) {
    try {
        const atlas = await atlasService.getAll();
        res.json(atlas);
    } catch (err) {
        res.status(500).json({ error: { message: err.message } });
    }
}

async function createAtlas(req, res) {
    try {
        const newItem = await atlasService.create(req.body);
        res.status(201).json({ message: 'Atlas created', data: newItem });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function updateAtlas(req, res) {
    try {
        await atlasService.update(req.params.id, req.body);
        res.json({ message: 'Atlas updated' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function deleteAtlas(req, res) {
    try {
        await atlasService.deleteAtlas(req.params.id);
        res.json({ message: 'Atlas deleted' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

// ===== USUARIOS =====
async function getAllUsers(req, res) {
    // Implementar cuando sea necesario
    res.json({ message: 'Get all users - to implement' });
}

export {
    // Multiplechoices
    getAllMultiplechoices,
    createMultiplechoice,
    updateMultiplechoice,
    deleteMultiplechoice,
    // Flashcards
    getAllFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    // Atlas
    getAllAtlas,
    createAtlas,
    updateAtlas,
    deleteAtlas,
    // Users
    getAllUsers
};