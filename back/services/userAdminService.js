import { MongoClient, ObjectId } from "mongodb";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);
const accountCollection = db.collection("account");
const profileCollection = db.collection("profile");

// Obtiene todos los usuarios con sus perfiles
async function getAllUsers() {
    await client.connect();
    
    // Obtiene todas las cuentas
    const accounts = await accountCollection.find().toArray();
    
    // Obtiene todos los perfiles
    const profiles = await profileCollection.find().toArray();
    
    // Combina accounts con profiles
    const users = accounts.map(account => {
        const profile = profiles.find(p => p._id.toString() === account._id.toString());
        return {
            _id: account._id,
            userName: account.userName,
            rol: account.rol,
            // Datos del perfil (pueden no existir)
            email: profile?.email || '',
            name: profile?.name || '',
            userImage: profile?.userImage || '',
            bio: profile?.bio || '',
            birthDate: profile?.birthDate || null,
            location: profile?.location || '',
            createdAt: profile?.createdAt || null,
            updatedAt: profile?.updatedAt || null
        };
    });
    
    return users;
}

// Obtiene un usuario específico con su perfil
async function getUserById(id) {
    await client.connect();
    
    const account = await accountCollection.findOne({ _id: new ObjectId(id) });
    if (!account) {
        throw new Error("Usuario no encontrado");
    }
    
    const profile = await profileCollection.findOne({ _id: new ObjectId(id) });
    
    return {
        _id: account._id,
        userName: account.userName,
        rol: account.rol,
        email: profile?.email || '',
        name: profile?.name || '',
        userImage: profile?.userImage || '',
        bio: profile?.bio || '',
        birthDate: profile?.birthDate || null,
        location: profile?.location || '',
        createdAt: profile?.createdAt || null,
        updatedAt: profile?.updatedAt || null
    };
}

// Crea nuevo usuario (account + profile)
async function createUser(userData) {
    await client.connect();
    
    // Verifica que no exista el userName
    const existingUser = await accountCollection.findOne({ userName: userData.userName });
    if (existingUser) {
        throw new Error("El nombre de usuario ya existe");
    }
    
    // Verifica el email si se proporciona
    if (userData.email) {
        const existingEmail = await profileCollection.findOne({ email: userData.email });
        if (existingEmail) {
            throw new Error("El email ya está en uso");
        }
    }
    
    // Crear account
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newAccount = {
        userName: userData.userName,
        password: hashedPassword,
        rol: userData.rol || 1
    };
    
    const accountResult = await accountCollection.insertOne(newAccount);
    const userId = accountResult.insertedId;
    
    // Crear profile
    const newProfile = {
        _id: userId,
        userName: userData.userName,
        email: userData.email || '',
        name: userData.name || userData.userName,
        userImage: userData.userImage || '',
        bio: userData.bio || '',
        birthDate: userData.birthDate ? new Date(userData.birthDate) : null,
        location: userData.location || '',
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    await profileCollection.insertOne(newProfile);
    
    return {
        _id: userId,
        userName: newAccount.userName,
        rol: newAccount.rol,
        ...newProfile
    };
}

// Actualiza el usuario (account + profile)
async function updateUser(id, userData) {
    await client.connect();
    
    // Verifica que el usuario exista
    const account = await accountCollection.findOne({ _id: new ObjectId(id) });
    if (!account) {
        throw new Error("Usuario no encontrado");
    }
    
    // Prepara las actualizaciones para la account
    const accountUpdates = {};
    
    // Si se cambia el userName, verifica que no exista
    if (userData.userName && userData.userName !== account.userName) {
        const existingUser = await accountCollection.findOne({ 
            userName: userData.userName,
            _id: { $ne: new ObjectId(id) }
        });
        if (existingUser) {
            throw new Error("El nombre de usuario ya existe");
        }
        accountUpdates.userName = userData.userName;
    }
    
    // Si se cambia el rol
    if (userData.rol !== undefined) {
        accountUpdates.rol = userData.rol;
    }
    
    // Si se cambia la contraseña
    if (userData.password) {
        accountUpdates.password = await bcrypt.hash(userData.password, 10);
    }
    
    // Actualiza la account si hay cambios
    if (Object.keys(accountUpdates).length > 0) {
        await accountCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: accountUpdates }
        );
    }
    
    // Prepara las actualizaciones para profile
    const profileUpdates = {
        updatedAt: new Date()
    };
    
    if (userData.userName) profileUpdates.userName = userData.userName;
    if (userData.email !== undefined) profileUpdates.email = userData.email;
    if (userData.name !== undefined) profileUpdates.name = userData.name;
    if (userData.userImage !== undefined) profileUpdates.userImage = userData.userImage;
    if (userData.bio !== undefined) profileUpdates.bio = userData.bio;
    if (userData.birthDate !== undefined) {
        profileUpdates.birthDate = userData.birthDate ? new Date(userData.birthDate) : null;
    }
    if (userData.location !== undefined) profileUpdates.location = userData.location;
    
    // Actualiza o crea el profile
    await profileCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: profileUpdates },
        { upsert: true }
    );
    
    return await getUserById(id);
}

// Elimina el usuario (primero sus actividades de user_activities, luego profile y account)
async function deleteUser(id) {
    await client.connect();
    
    // Verifica que el usuario exista
    const account = await accountCollection.findOne({ _id: new ObjectId(id) });
    if (!account) {
        throw new Error("Usuario no encontrado");
    }
    
    const userName = account.userName;
    const userId = new ObjectId(id);
    
    console.log(`Iniciando eliminación del usuario ${userName} (ID: ${id})`);
    
    // Primero: Busca y verificaa las actividades del usuario
    const userActivitiesCollection = db.collection("user_activities");
    
    // Busca todas las actividades del usuario
    const userActivities = await userActivitiesCollection.find({ userId: userId }).toArray();
    console.log(`Encontradas ${userActivities.length} actividades del usuario ${userName}`);
    
    // Elimina todas las actividades del usuario
    if (userActivities.length > 0) {
        const deleteResult = await userActivitiesCollection.deleteMany({ userId: userId });
        
        if (deleteResult.deletedCount !== userActivities.length) {
            throw new Error(`Error al eliminar actividades: se esperaban ${userActivities.length} pero se eliminaron ${deleteResult.deletedCount}`);
        }
        
        console.log(`Eliminadas ${deleteResult.deletedCount} actividades del usuario ${userName}`);
    } else {
        console.log(`El usuario ${userName} no tiene actividades para eliminar`);
    }
    
    // Segundo: Elimina el profile
    const profileResult = await profileCollection.deleteOne({ _id: userId });
    if (profileResult.deletedCount === 1) {
        console.log(`Eliminado profile del usuario ${userName}`);
    } else {
        console.log(`No se encontró profile para el usuario ${userName}`);
    }
    
    // Tercero: Elimina la account
    const accountResult = await accountCollection.deleteOne({ _id: userId });
    if (accountResult.deletedCount !== 1) {
        throw new Error("Error al eliminar la cuenta del usuario");
    }
    console.log(`Eliminado account del usuario ${userName}`);
    
    return { 
        message: "Usuario y todas sus actividades eliminados correctamente",
        userName: userName,
        deletedActivities: userActivities.length,
        deletedProfile: profileResult.deletedCount === 1,
        deletedAccount: true
    };
}

export {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};