import * as multiplechoiceService from '../../services/multiplechoiceService.js';
import * as flashcardService from '../../services/flashcardService.js';
import * as atlasService from '../../services/atlasService.js';
import * as userAdminService from '../../services/userAdminService.js';

// Multiplechoice
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
        const data = {
            ...req.body,
            userName: req.account.userName,
            createdAt: new Date()
        };
        const newItem = await multiplechoiceService.create(data);
        res.status(201).json({ message: 'Multiplechoice creado', data: newItem });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function updateMultiplechoice(req, res) {
    try {
        await multiplechoiceService.update(req.params.id, req.body);
        res.json({ message: 'Multiplechoice actualizado' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function deleteMultiplechoice(req, res) {
    try {
        await multiplechoiceService.delete(req.params.id);
        res.json({ message: 'Multiplechoice eliminado' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

//Flashcard
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
        const data = {
            ...req.body,
            userName: req.account.userName,
            createdAt: new Date()
        };
        const newItem = await flashcardService.create(data);
        res.status(201).json({ message: 'Flashcard creada', data: newItem });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function updateFlashcard(req, res) {
    try {
        await flashcardService.update(req.params.id, req.body);
        res.json({ message: 'Flashcard actualizada' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function deleteFlashcard(req, res) {
    try {
        await flashcardService.deleteFlashcard(req.params.id);
        res.json({ message: 'Flashcard eliminada' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

//Atlas
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
        const data = {
            ...req.body,
            userName: req.account.userName,
            createdAt: new Date()
        };
        const newItem = await atlasService.create(data);
        res.status(201).json({ message: 'Atlas creado', data: newItem });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function updateAtlas(req, res) {
    try {
        await atlasService.update(req.params.id, req.body);
        res.json({ message: 'Atlas actualizado' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function deleteAtlas(req, res) {
    try {
        await atlasService.deleteAtlas(req.params.id);
        res.json({ message: 'Atlas eliminado' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

// User
async function getAllUsers(req, res) {
    try {
        const users = await userAdminService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: { message: err.message } });
    }
}

async function getUserById(req, res) {
    try {
        const user = await userAdminService.getUserById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: { message: err.message } });
    }
}

async function createUser(req, res) {
    try {
        const newUser = await userAdminService.createUser(req.body);
        res.status(201).json({ message: 'User creado', data: newUser });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function updateUser(req, res) {
    try {
        await userAdminService.updateUser(req.params.id, req.body);
        res.json({ message: 'User actualizado' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function deleteUser(req, res) {
    try {
        await userAdminService.deleteUser(req.params.id);
        res.json({ message: 'User eliminado' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

// Dashboard stat
async function getDashboardStats(req, res) {
    try {
        const [multiplechoices, flashcards, atlas, users] = await Promise.all([
            multiplechoiceService.getAll(),
            flashcardService.getAll(),
            atlasService.getAll(),
            userAdminService.getAllUsers()
        ]);

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const multiplechoicesThisWeek = multiplechoices.filter(item =>
            new Date(item.createdAt) > oneWeekAgo
        ).length;

        const flashcardsThisWeek = flashcards.filter(item =>
            new Date(item.createdAt) > oneWeekAgo
        ).length;

        const atlasThisWeek = atlas.filter(item =>
            new Date(item.createdAt) > oneWeekAgo
        ).length;

        const contentThisWeek = multiplechoicesThisWeek + flashcardsThisWeek + atlasThisWeek;

        let totalMultiplechoiceQuestions = 0;
        let totalMultiplechoiceJustified = 0;

        multiplechoices.forEach(mc => {
            if (mc.questions && Array.isArray(mc.questions)) {
                totalMultiplechoiceQuestions += mc.questions.length;
                mc.questions.forEach(question => {
                    if (question.justification && question.justification.trim() !== '') {
                        totalMultiplechoiceJustified++;
                    }
                });
            }
        });

        const activeUsersSet = new Set();

        multiplechoices.forEach(item => {
            if (new Date(item.createdAt) > oneWeekAgo && item.userName) {
                activeUsersSet.add(item.userName);
            }
        });

        flashcards.forEach(item => {
            if (new Date(item.createdAt) > oneWeekAgo && item.userName) {
                activeUsersSet.add(item.userName);
            }
        });

        atlas.forEach(item => {
            if (new Date(item.createdAt) > oneWeekAgo && item.userName) {
                activeUsersSet.add(item.userName);
            }
        });

        const stats = {
            totalUsers: users.length,
            totalMultiplechoices: multiplechoices.length,
            totalMultiplechoiceQuestions,
            totalMultiplechoiceJustified,
            totalFlashcards: flashcards.length,
            totalAtlas: atlas.length,
            contentThisWeek,
            activeUsersThisWeek: activeUsersSet.size
        };

        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: { message: err.message } });
    }
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
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    // Dashboard
    getDashboardStats
};