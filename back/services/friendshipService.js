import dotenv from 'dotenv';
dotenv.config();
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);
const friendshipCollection = db.collection("friendships");
const profileCollection = db.collection("profile");

// Enviar solicitud de amistad
async function sendFriendRequest(userId, friendId) {
    await client.connect();
    
    // Verificar que no exista ya una relación
    const existing = await friendshipCollection.findOne({
        $or: [
            { userId: new ObjectId(userId), friendId: new ObjectId(friendId) },
            { userId: new ObjectId(friendId), friendId: new ObjectId(userId) }
        ]
    });
    
    if (existing) {
        throw new Error("Ya existe una relación con este usuario");
    }
    
    const friendship = {
        userId: new ObjectId(userId),
        friendId: new ObjectId(friendId),
        status: "pending",
        createdAt: new Date()
    };
    
    const result = await friendshipCollection.insertOne(friendship);
    return { _id: result.insertedId, ...friendship };
}

// Aceptar solicitud
async function acceptFriendRequest(friendshipId, currentUserId) {
    await client.connect();
    
    const friendship = await friendshipCollection.findOne({
        _id: new ObjectId(friendshipId),
        friendId: new ObjectId(currentUserId),
        status: "pending"
    });
    
    if (!friendship) {
        throw new Error("Solicitud no encontrada");
    }
    
    await friendshipCollection.updateOne(
        { _id: new ObjectId(friendshipId) },
        { $set: { status: "accepted", updatedAt: new Date() } }
    );
    
    return { message: "Solicitud aceptada" };
}

// Rechazar solicitud
async function rejectFriendRequest(friendshipId, currentUserId) {
    await client.connect();
    
    await friendshipCollection.deleteOne({
        _id: new ObjectId(friendshipId),
        friendId: new ObjectId(currentUserId),
        status: "pending"
    });
    
    return { message: "Solicitud rechazada" };
}

// Eliminar amistad
async function removeFriend(friendshipId, currentUserId) {
    await client.connect();
    
    await friendshipCollection.deleteOne({
        _id: new ObjectId(friendshipId),
        $or: [
            { userId: new ObjectId(currentUserId) },
            { friendId: new ObjectId(currentUserId) }
        ]
    });
    
    return { message: "Amistad eliminada" };
}

// Obtener amigos de un usuario
async function getFriends(userId) {
    await client.connect();
    
    const friendships = await friendshipCollection.find({
        $or: [
            { userId: new ObjectId(userId), status: "accepted" },
            { friendId: new ObjectId(userId), status: "accepted" }
        ]
    }).toArray();
    
    // Obtener IDs de amigos
    const friendIds = friendships.map(f => 
        f.userId.toString() === userId ? f.friendId : f.userId
    );
    
    // Obtener perfiles de amigos
    const friends = await profileCollection.find({
        _id: { $in: friendIds }
    }).toArray();
    
    return friends;
}

// Obtener solicitudes pendientes
async function getPendingRequests(userId) {
    await client.connect();
    
    const requests = await friendshipCollection.find({
        friendId: new ObjectId(userId),
        status: "pending"
    }).toArray();
    
    // Obtener perfiles de quienes enviaron solicitud
    const senderIds = requests.map(r => r.userId);
    const senders = await profileCollection.find({
        _id: { $in: senderIds }
    }).toArray();
    
    // Combinar datos
    return requests.map(req => ({
        ...req,
        sender: senders.find(s => s._id.toString() === req.userId.toString())
    }));
}

// Buscar usuarios por nombre
async function searchUsers(searchTerm, currentUserId) {
    await client.connect();
    
    const users = await profileCollection.find({
        $or: [
            { userName: { $regex: searchTerm, $options: 'i' } },
            { name: { $regex: searchTerm, $options: 'i' } }
        ],
        _id: { $ne: new ObjectId(currentUserId) } // Excluir usuario actual
    }).limit(20).toArray();
    
    // Verificar estado de amistad con cada usuario
    const userIds = users.map(u => u._id);
    const friendships = await friendshipCollection.find({
        $or: [
            { userId: new ObjectId(currentUserId), friendId: { $in: userIds } },
            { friendId: new ObjectId(currentUserId), userId: { $in: userIds } }
        ]
    }).toArray();
    
    // Agregar estado de amistad a cada usuario
    return users.map(user => {
        const friendship = friendships.find(f => 
            f.userId.toString() === user._id.toString() || 
            f.friendId.toString() === user._id.toString()
        );
        
        return {
            ...user,
            friendshipStatus: friendship ? friendship.status : "none",
            friendshipId: friendship ? friendship._id : null,
            isSentByMe: friendship?.userId.toString() === currentUserId
        };
    });
}

export {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    getFriends,
    getPendingRequests,
    searchUsers
};