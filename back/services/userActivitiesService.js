import { MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);
const userActivitiesCollection = db.collection("user_activities");
const friendshipsCollection = db.collection("friendships");

// Obtener actividades de un usuario
async function getUserActivities(userId) {
    await client.connect();
    const activities = await userActivitiesCollection.find({ 
        userId: new ObjectId(userId) 
    }).toArray();
    return activities;
}

// Obtener actividades de un usuario específico (públicas + amigos si corresponde)
async function getFriendActivities(friendId, currentUserId) {
    await client.connect();
    
    // Verificar si son amigos
    let areFriends = false;
    if (currentUserId) {
        const friendship = await friendshipsCollection.findOne({
            $or: [
                { userId: new ObjectId(currentUserId), friendId: new ObjectId(friendId), status: 'accepted' },
                { userId: new ObjectId(friendId), friendId: new ObjectId(currentUserId), status: 'accepted' }
            ]
        });
        areFriends = !!friendship;
    }
    
    // Construir query según si son amigos o no
    const query = {
        userId: new ObjectId(friendId),
        visibility: areFriends ? { $in: ['public', 'friends'] } : 'public'
    };
    
    const activities = await userActivitiesCollection.find(query).toArray();
    return activities;
}

// Obtener todas las actividades públicas
async function getPublicActivities() {
    await client.connect();
    const activities = await userActivitiesCollection.find({ 
        visibility: 'public' 
    }).toArray();
    return activities;
}

// Obtener actividad por ID (verificando visibilidad)
async function getActivityById(activityId, userId) {
    await client.connect();
    
    const activity = await userActivitiesCollection.findOne({ 
        _id: new ObjectId(activityId)
    });
    
    if (!activity) {
        throw new Error("Activity not found");
    }
    
    // Verificar que el usuario tenga permiso
    const isOwner = activity.userId.toString() === userId?.toString();
    
    if (isOwner) {
        return activity;
    }
    
    // Si no es el dueño, verificar visibilidad
    if (activity.visibility === 'public') {
        return activity;
    }
    
    if (activity.visibility === 'friends' && userId) {
        // Verificar si son amigos
        const friendship = await friendshipsCollection.findOne({
            $or: [
                { userId: new ObjectId(userId), friendId: activity.userId, status: 'accepted' },
                { userId: activity.userId, friendId: new ObjectId(userId), status: 'accepted' }
            ]
        });
        
        if (friendship) {
            return activity;
        }
    }
    
    throw new Error("You don't have permission to view this activity");
}

// Obtener actividades por tipo
async function getActivitiesByType(userId, activityType) {
    await client.connect();
    const activities = await userActivitiesCollection.find({ 
        userId: new ObjectId(userId),
        activityType: activityType
    }).toArray();
    return activities;
}

// Crear actividad
async function createActivity(userId, activityData) {
    await client.connect();
    
    const newActivity = {
        ...activityData,
        userId: new ObjectId(userId),
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    const result = await userActivitiesCollection.insertOne(newActivity);
    return { _id: result.insertedId, ...newActivity };
}

// Actualizar actividad
async function updateActivity(activityId, userId, activityData) {
    await client.connect();
    
    // Verificar que la actividad pertenezca al usuario
    const activity = await userActivitiesCollection.findOne({ 
        _id: new ObjectId(activityId),
        userId: new ObjectId(userId)
    });
    
    if (!activity) {
        throw new Error("Activity not found or you don't have permission");
    }
    
    // Filtrar campos que no se deben actualizar
    const { _id, userId: uid, createdAt, ...updateData } = activityData;
    
    console.log('Updating activity with data:', updateData);
    
    const result = await userActivitiesCollection.updateOne(
        { _id: new ObjectId(activityId) },
        { 
            $set: {
                ...updateData,
                updatedAt: new Date()
            }
        }
    );
    
    console.log('Update result:', result);
    
    return result;
}

// Eliminar actividad
async function deleteActivity(activityId, userId) {
    await client.connect();
    
    // Verificar que la actividad pertenezca al usuario
    const activity = await userActivitiesCollection.findOne({ 
        _id: new ObjectId(activityId),
        userId: new ObjectId(userId)
    });
    
    if (!activity) {
        throw new Error("Activity not found or you don't have permission");
    }
    
    const result = await userActivitiesCollection.deleteOne({ 
        _id: new ObjectId(activityId) 
    });
    
    return result;
}

// Copiar actividad a mis actividades
async function copyActivity(activityId, userId) {
    await client.connect();
    
    // Buscar la actividad original
    const originalActivity = await userActivitiesCollection.findOne({ 
        _id: new ObjectId(activityId)
    });
    
    if (!originalActivity) {
        throw new Error("Activity not found");
    }
    
    // Verificar que no sea privada de otro usuario
    if (originalActivity.visibility === 'private' && 
        originalActivity.userId.toString() !== userId.toString()) {
        throw new Error("Cannot copy private activity");
    }
    
    // Crear copia de la actividad
    const { _id, userId: originalUserId, createdAt, updatedAt, ...activityData } = originalActivity;
    
    const copiedActivity = {
        ...activityData,
        userId: new ObjectId(userId),
        visibility: 'private', // La copia es privada por defecto
        createdAt: new Date(),
        updatedAt: new Date(),
        copiedFrom: originalActivity._id,
        copiedFromUser: originalActivity.userId
    };
    
    const result = await userActivitiesCollection.insertOne(copiedActivity);
    
    return {
        _id: result.insertedId,
        ...copiedActivity
    };
}

// Obtener actividad específica por ID (pública o de amigo)
async function getActivityByIdPublic(activityId, currentUserId) {
    return getActivityById(activityId, currentUserId);
}

export {
    getUserActivities,
    getActivityById,
    getActivitiesByType,
    createActivity,
    updateActivity,
    deleteActivity,
    getFriendActivities,
    getPublicActivities,
    getActivityByIdPublic,
    copyActivity
};