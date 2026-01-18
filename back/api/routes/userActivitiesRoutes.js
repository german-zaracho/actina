import { Router } from "express";
import { validateToken } from "../../middleware/validateTokenMiddleware.js";
import * as userActivitiesController from "../controllers/userActivitiesController.js";

const route = Router();

// Obtener todas las actividades del usuario
route.get('/my-activities', [validateToken], userActivitiesController.getMyActivities);

// Obtener actividades por tipo
route.get('/my-activities/type/:type', [validateToken], userActivitiesController.getActivitiesByType);

// Obtener una actividad específica
route.get('/my-activities/:id', [validateToken], userActivitiesController.getActivityById);

// Crear nueva actividad
route.post('/my-activities', [validateToken], userActivitiesController.createActivity);

// Actualizar actividad
route.put('/my-activities/:id', [validateToken], userActivitiesController.updateActivity);

// Eliminar actividad
route.delete('/my-activities/:id', [validateToken], userActivitiesController.deleteActivity);

// Obtener actividades públicas de un amigo (solo visibles para amigos)
route.get('/friend-activities/:friendId', [validateToken], userActivitiesController.getFriendActivities);

// Obtener actividades públicas (para todos, no requiere token)
route.get('/public-activities', userActivitiesController.getPublicActivities);

export default route;