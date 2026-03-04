import { MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

const db = client.db(process.env.DB_NAME);
const favoritesCollection = db.collection("favorites");
const userActivitiesCollection = db.collection("user_activities");

// Obtiene IDs de favoritos del usuario
async function getFavoriteIds(userId) {
    await client.connect();
    const userFavorites = await favoritesCollection.findOne({ _id: new ObjectId(userId) });
    return userFavorites?.favorites || [];
}

// Obtiene actividades favoritas completas del usuario
async function getFavorites(userId) {
    await client.connect();
    const favoriteIds = await getFavoriteIds(userId);
    
    if (favoriteIds.length === 0) {
        return [];
    }
    
    // Obtiene las actividades que aún existen
    const activities = await userActivitiesCollection.find({
        _id: { $in: favoriteIds.map(id => new ObjectId(id)) }
    }).toArray();
    
    // Identifica actividades eliminadas
    const foundIds = activities.map(a => a._id.toString());
    const deletedIds = favoriteIds.filter(id => !foundIds.includes(id.toString()));
    
    // Crea objetos para actividades eliminadas
    const deletedActivities = deletedIds.map(id => ({
        _id: id,
        isDeleted: true,
        deletedMessage: 'Esta actividad ha sido eliminada por su propietario'
    }));
    
    // Combina actividades existentes y eliminadas
    return [...activities, ...deletedActivities];
}

// Agrega actividad a favoritos
async function addToFavorites(userId, activityId) {
    await client.connect();
    
    // Verifica que la actividad existe y es accesible
    const activity = await userActivitiesCollection.findOne({ _id: new ObjectId(activityId) });
    if (!activity) {
        throw new Error("Activity not found");
    }
    
    // Verifica que no sea una actividad privada de otro usuario
    if (activity.visibility === 'private' && activity.userId.toString() !== userId.toString()) {
        throw new Error("Cannot add private activity to favorites");
    }
    
    const update = await favoritesCollection.updateOne(
        { _id: new ObjectId(userId) }, 
        { $addToSet: { favorites: new ObjectId(activityId) } }, // $addToSet evita duplicados
        { upsert: true }
    );
    
    return update;
}

// Elimina actividades de favoritos
async function removeFromFavorites(userId, activityId) {
    await client.connect();
    
    const update = await favoritesCollection.updateOne(
        { _id: new ObjectId(userId) }, 
        { $pull: { favorites: new ObjectId(activityId) } }
    );
    
    return update;
}

// Verifica si una actividad está en favoritos
async function isFavorite(userId, activityId) {
    await client.connect();
    
    const userFavorites = await favoritesCollection.findOne({ 
        _id: new ObjectId(userId),
        favorites: new ObjectId(activityId)
    });
    
    return !!userFavorites;
}

export {
    getFavorites,
    getFavoriteIds,
    addToFavorites,
    removeFromFavorites,
    isFavorite
};