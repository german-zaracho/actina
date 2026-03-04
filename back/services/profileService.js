import { MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);
const profileCollection = db.collection("profile");
const accountCollection = db.collection("account");

// Obtener perfil del usuario actual
async function getProfile(userId) {
    await client.connect();
    const profile = await profileCollection.findOne({ _id: new ObjectId(userId) });
    return profile;
}

// Crear perfil básico
async function createBasicProfile(profileData) {
    await client.connect();
    const newProfile = {
        _id: new ObjectId(profileData._id),
        userName: profileData.userName,
        email: profileData.email || '',
        name: profileData.name || profileData.userName,
        userImage: '',
        bio: '',
        birthDate: null,
        location: '',
        createdAt: new Date(),
        updatedAt: new Date()
    };
    await profileCollection.insertOne(newProfile);
    return newProfile;
}

// Actualizar perfil
async function updateProfile(userId, profileData) {
    await client.connect();
    
    const updateData = {
        ...profileData,
        updatedAt: new Date()
    };
    
    await profileCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData },
        { upsert: true }
    );
    
    return await getProfile(userId);
}

// Obtener perfil público por ID
async function getPublicProfile(userId) {
    await client.connect();
    
    const profile = await profileCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!profile) {
        throw new Error("Usuario no encontrado");
    }
    
    // También obtener el rol del usuario de la colección account
    const account = await accountCollection.findOne({ _id: new ObjectId(userId) });
    
    return {
        ...profile,
        rol: account?.rol
    };
}

// Obtener perfil público por userName
async function getPublicProfileByUsername(userName) {
    await client.connect();
    
    const profile = await profileCollection.findOne({ userName: userName });
    
    if (!profile) {
        throw new Error("Usuario no encontrado");
    }
    
    // También obtener el rol del usuario de la colección account
    const account = await accountCollection.findOne({ userName: userName });
    
    return {
        ...profile,
        rol: account?.rol
    };
}

export {
    getProfile,
    createBasicProfile,
    updateProfile,
    getPublicProfile,
    getPublicProfileByUsername
};