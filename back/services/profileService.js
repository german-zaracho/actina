import { MongoClient, ObjectId } from "mongodb";
import bcrypt from 'bcrypt'

const client = new MongoClient('process.env.REACT_APP_MONGODB_URI')
const db = client.db("process.env.REACT_APP_DB_NAME")
const profileCollection = db.collection("profile")

// Función para crear perfil automáticamente al registrarse
async function createBasicProfile(account) {
    // Seleccionar imagen aleatoria de las disponibles
    // const availableImages = ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg', 'avatar4.jpg', 'avatar5.jpg'];
    // const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];

    const basicProfile = {
        userName: account.userName,
        email: account.email || '', // Email desde el registro
        name: account.userName, // Por defecto, usar el userName como name
        userImage: '', // Imagen aleatoria predeterminada
        bio: '',
        birthDate: null,
        location: '',
        _id: new ObjectId(account._id),
        createdAt: new Date()
    }

    await client.connect()
    
    // Verificar si ya existe un perfil
    const exists = await profileCollection.findOne({ _id: new ObjectId(account._id) })
    if (exists) {
        return exists // Si ya existe, retornar el existente
    }

    // Insertar el nuevo perfil básico
    await profileCollection.insertOne(basicProfile)
    return basicProfile
}

// Función para crear/actualizar perfil completo (desde la interfaz de usuario)
async function createProfile(account, profileData) {
    const completeProfile = {
        ...profileData,
        userName: account.userName,
        _id: new ObjectId(account._id),
        updatedAt: new Date()
    }

    await client.connect()
    
    // Usar upsert para crear o actualizar
    await profileCollection.replaceOne(
        { _id: new ObjectId(account._id) },
        completeProfile,
        { upsert: true }
    )
    
    return completeProfile
}

// Función para actualizar perfil existente
async function updateProfile(accountId, profileData) {
    await client.connect()
    
    const updateData = {
        ...profileData,
        updatedAt: new Date()
    }
    
    const result = await profileCollection.updateOne(
        { _id: new ObjectId(accountId) },
        { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
        throw new Error("Profile not found")
    }
    
    return await getProfile(accountId)
}

async function getProfile(id) {
    await client.connect()
    const profile = await profileCollection.findOne({ _id: new ObjectId(id) })
    
    if (!profile) {
        throw new Error("That profile doesn't exist")
    }
    
    return profile
}

export {
    createBasicProfile,
    createProfile,
    updateProfile,
    getProfile
}