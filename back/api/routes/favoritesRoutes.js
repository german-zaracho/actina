import { Router } from 'express';
import { validateToken } from '../../middleware/validateTokenMiddleware.js';
import * as controllers from '../controllers/favoritesController.js';

const route = Router();

// Obtener favoritos del usuario actual
route.get('/favorites', [validateToken], controllers.getFavorites);

// Agregar actividad a favoritos
route.post('/favorites', [validateToken], controllers.addToFavorites);

// Eliminar actividad de favoritos
route.delete('/favorites/:activityId', [validateToken], controllers.removeFromFavorites);

// Verificar si una actividad está en favoritos
route.get('/favorites/check/:activityId', [validateToken], controllers.isFavorite);

export default route;