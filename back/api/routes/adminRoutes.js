import { Router } from "express";
import { validateToken } from "../../middleware/validateTokenMiddleware.js";
import { validateAdmin } from "../../middleware/validateRoleMiddleware.js";
import * as adminControllers from "../controllers/adminController.js";

const route = Router();

// Multiplechoices
route.get('/admin/multiplechoices', [validateToken, validateAdmin], adminControllers.getAllMultiplechoices);
route.post('/admin/multiplechoices', [validateToken, validateAdmin], adminControllers.createMultiplechoice);
route.put('/admin/multiplechoices/:id', [validateToken, validateAdmin], adminControllers.updateMultiplechoice);
route.delete('/admin/multiplechoices/:id', [validateToken, validateAdmin], adminControllers.deleteMultiplechoice);

// Flashcards
route.get('/admin/flashcards', [validateToken, validateAdmin], adminControllers.getAllFlashcards);
route.post('/admin/flashcards', [validateToken, validateAdmin], adminControllers.createFlashcard);
route.put('/admin/flashcards/:id', [validateToken, validateAdmin], adminControllers.updateFlashcard);
route.delete('/admin/flashcards/:id', [validateToken, validateAdmin], adminControllers.deleteFlashcard);

// Atlas
route.get('/admin/atlas', [validateToken, validateAdmin], adminControllers.getAllAtlas);
route.post('/admin/atlas', [validateToken, validateAdmin], adminControllers.createAtlas);
route.put('/admin/atlas/:id', [validateToken, validateAdmin], adminControllers.updateAtlas);
route.delete('/admin/atlas/:id', [validateToken, validateAdmin], adminControllers.deleteAtlas);

// Users
route.get('/admin/users', [validateToken, validateAdmin], adminControllers.getAllUsers);

export default route;