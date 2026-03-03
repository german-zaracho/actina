// import { MongoClient, ObjectId } from "mongodb";
// import bcrypt from 'bcrypt'
// import dotenv from 'dotenv';
// dotenv.config();

// const client = new MongoClient(process.env.MONGODB_URI);
// const db = client.db(process.env.DB_NAME);
// const profileCollection = db.collection("profile");

// // Función para crear perfil automáticamente al registrarse
// async function createBasicProfile(account) {
//     // Seleccionar imagen aleatoria de las disponibles
//     // const availableImages = ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg', 'avatar4.jpg', 'avatar5.jpg'];
//     // const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];

//     const basicProfile = {
//         userName: account.userName,
//         email: account.email || '', // Email desde el registro
//         name: account.userName, // Por defecto, usar el userName como name
//         userImage: '', // Imagen aleatoria predeterminada
//         bio: '',
//         birthDate: null,
//         location: '',
//         _id: new ObjectId(account._id),
//         createdAt: new Date()
//     }

//     await client.connect()
    
//     // Verificar si ya existe un perfil
//     const exists = await profileCollection.findOne({ _id: new ObjectId(account._id) })
//     if (exists) {
//         return exists // Si ya existe, retornar el existente
//     }

//     // Insertar el nuevo perfil básico
//     await profileCollection.insertOne(basicProfile)
//     return basicProfile
// }

// // Función para crear/actualizar perfil completo (desde la interfaz de usuario)
// async function createProfile(account, profileData) {
//     const completeProfile = {
//         ...profileData,
//         userName: account.userName,
//         _id: new ObjectId(account._id),
//         updatedAt: new Date()
//     }

//     await client.connect()
    
//     // Usar upsert para crear o actualizar
//     await profileCollection.replaceOne(
//         { _id: new ObjectId(account._id) },
//         completeProfile,
//         { upsert: true }
//     )
    
//     return completeProfile
// }

// // Función para actualizar perfil existente
// async function updateProfile(accountId, profileData) {
//     await client.connect()
    
//     const updateData = {
//         ...profileData,
//         updatedAt: new Date()
//     }
    
//     const result = await profileCollection.updateOne(
//         { _id: new ObjectId(accountId) },
//         { $set: updateData }
//     )
    
//     if (result.matchedCount === 0) {
//         throw new Error("Profile not found")
//     }
    
//     return await getProfile(accountId)
// }

// async function getProfile(id) {
//     await client.connect()
//     const profile = await profileCollection.findOne({ _id: new ObjectId(id) })
    
//     if (!profile) {
//         throw new Error("That profile doesn't exist")
//     }
    
//     return profile
// }

// async function getPublicProfile(userId) {
//     await client.connect();
//     const profile = await profileCollection.findOne({ _id: new ObjectId(userId) });
    
//     if (!profile) {
//         throw new Error("That profile doesn't exist");
//     }
    
//     return profile;
// }


// export {
//     createBasicProfile,
//     createProfile,
//     updateProfile,
//     getProfile,
//     getPublicProfile
// }

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