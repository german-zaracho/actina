import * as service from '../../services/favoritesService.js';

// Obtener favoritos del usuario actual
async function getFavorites(req, res) {
    try {
        const favorites = await service.getFavorites(req.account._id);
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ error: { message: err.message } });
    }
}

// Agregar actividad a favoritos
async function addToFavorites(req, res) {
    try {
        const { activityId } = req.body;
        await service.addToFavorites(req.account._id, activityId);
        res.status(201).json({ message: 'Added to favorites' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

// Eliminar actividad de favoritos
async function removeFromFavorites(req, res) {
    try {
        const { activityId } = req.params;
        await service.removeFromFavorites(req.account._id, activityId);
        res.json({ message: 'Removed from favorites' });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

// Verificar si una actividad está en favoritos
async function isFavorite(req, res) {
    try {
        const { activityId } = req.params;
        const favorite = await service.isFavorite(req.account._id, activityId);
        res.json({ isFavorite: favorite });
    } catch (err) {
        res.status(500).json({ error: { message: err.message } });
    }
}

export {
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
};