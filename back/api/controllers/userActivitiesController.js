import * as userActivitiesService from '../../services/userActivitiesService.js';

// Obtener todas las actividades del usuario
async function getMyActivities(req, res) {
    try {
        const activities = await userActivitiesService.getUserActivities(req.account._id);
        res.json(activities);
    } catch (err) {
        res.status(500).json({ error: { message: err.message } });
    }
}

// Obtener una actividad específica
async function getActivityById(req, res) {
    try {
        const activity = await userActivitiesService.getActivityById(
            req.params.id,
            req.account._id
        );
        res.json(activity);
    } catch (err) {
        res.status(404).json({ error: { message: err.message } });
    }
}

// Crear nueva actividad
async function createActivity(req, res) {
    try {
        const newActivity = await userActivitiesService.createActivity(
            req.account._id,
            req.body
        );
        res.status(201).json({ 
            message: 'Activity created successfully', 
            data: newActivity 
        });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

// Actualizar actividad
async function updateActivity(req, res) {
    try {
        console.log('=== UPDATE ACTIVITY DEBUG ===');
        console.log('Activity ID:', req.params.id);
        console.log('User ID:', req.account._id);
        console.log('Body received:', req.body);
        
        await userActivitiesService.updateActivity(
            req.params.id,
            req.account._id,
            req.body
        );
        res.json({ message: 'Activity updated successfully' });
    } catch (err) {
        console.error('Update error:', err);
        res.status(400).json({ error: { message: err.message } });
    }
}

// Eliminar actividad
async function deleteActivity(req, res) {
    try {
        await userActivitiesService.deleteActivity(
            req.params.id,
            req.account._id
        );
        res.json({ message: 'Activity deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

// Obtener actividades por tipo
async function getActivitiesByType(req, res) {
    try {
        const activities = await userActivitiesService.getActivitiesByType(
            req.account._id,
            req.params.type
        );
        res.json(activities);
    } catch (err) {
        res.status(500).json({ error: { message: err.message } });
    }
}

// Obtener actividades públicas de un amigo
async function getFriendActivities(req, res) {
    try {
        const activities = await userActivitiesService.getFriendActivities(
            req.params.friendId
        );
        res.json(activities);
    } catch (err) {
        res.status(500).json({ error: { message: err.message } });
    }
}

// Obtener actividades públicas (para todos)
async function getPublicActivities(req, res) {
    try {
        const activities = await userActivitiesService.getPublicActivities();
        res.json(activities);
    } catch (err) {
        res.status(500).json({ error: { message: err.message } });
    }
}

export {
    getMyActivities,
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivitiesByType,
    getFriendActivities,
    getPublicActivities
};