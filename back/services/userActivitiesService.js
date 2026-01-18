import { MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);
const collection = db.collection("user_activities");

// Obtener todas las actividades de un usuario
async function getUserActivities(userId) {
    await client.connect();
    return await collection.find({ 
        userId: new ObjectId(userId) 
    }).toArray();
}

// Obtener una actividad específica
async function getActivityById(activityId, userId) {
    await client.connect();
    const activity = await collection.findOne({ 
        _id: new ObjectId(activityId),
        userId: new ObjectId(userId)
    });
    
    if (!activity) {
        throw new Error("Activity not found or you don't have permission");
    }
    
    return activity;
}

// Crear nueva actividad
async function createActivity(userId, activityData) {
    await client.connect();
    
    const newActivity = {
        ...activityData,
        userId: new ObjectId(userId),
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newActivity);
    return { _id: result.insertedId, ...newActivity };
}

// Actualizar actividad
async function updateActivity(activityId, userId, activityData) {
    await client.connect();
    
    // Verificar que la actividad pertenezca al usuario
    const activity = await collection.findOne({ 
        _id: new ObjectId(activityId),
        userId: new ObjectId(userId)
    });
    
    if (!activity) {
        throw new Error("Activity not found or you don't have permission");
    }
    
    const result = await collection.updateOne(
        { _id: new ObjectId(activityId) },
        { 
            $set: {
                ...activityData,
                updatedAt: new Date()
            }
        }
    );
    
    return result;
}

// Eliminar actividad
async function deleteActivity(activityId, userId) {
    await client.connect();
    
    // Verificar que la actividad pertenezca al usuario
    const activity = await collection.findOne({ 
        _id: new ObjectId(activityId),
        userId: new ObjectId(userId)
    });
    
    if (!activity) {
        throw new Error("Activity not found or you don't have permission");
    }
    
    const result = await collection.deleteOne({ 
        _id: new ObjectId(activityId) 
    });
    
    return result;
}

// Obtener actividades por tipo
async function getActivitiesByType(userId, type) {
    await client.connect();
    return await collection.find({ 
        userId: new ObjectId(userId),
        activityType: type
    }).toArray();
}

// Obtener actividades públicas de un amigo
async function getFriendActivities(friendId) {
    await client.connect();
    return await collection.find({ 
        userId: new ObjectId(friendId),
        visibility: 'friends' // Solo actividades compartidas con amigos
    }).toArray();
}

// Obtener actividades públicas (para todos)
async function getPublicActivities() {
    await client.connect();
    return await collection.find({ 
        visibility: 'public'
    }).toArray();
}

export {
    getUserActivities,
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivitiesByType,
    getFriendActivities,
    getPublicActivities
};