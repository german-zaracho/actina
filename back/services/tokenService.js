import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient('process.env.REACT_APP_MONGODB_URI')
const db = client.db("process.env.REACT_APP_DB_NAME")
const tokenCollection = db.collection("tokens")

async function createToken(account){
    const token = jwt.sign(account,"Secret password")
    
    await client.connect()
    console.log("Creating token for account:", account)
    await tokenCollection.insertOne({token, account_id: account._id})
    
    return token
}

async function verifyToken(token){
    try {
        console.log("=== VERIFY TOKEN DEBUG ===");
        console.log("Token to verify:", token);
        
        const payload = jwt.verify(token, "Secret password")
        console.log("JWT payload:", payload)
        
        await client.connect()
        const activeSession = await tokenCollection.findOne({token, account_id: new ObjectId(payload._id)})
        console.log("Active session found:", activeSession)
        
        if(!activeSession) {
            console.log("No active session found for token");
            return null;
        }
        
        console.log("Token verification successful");
        return payload
    } catch (error) {
        console.error("Token verification error:", error);
        return null
    }
}

async function removeToken(token){
    await client.connect()
    await tokenCollection.deleteOne({token})
}

export {
    createToken,
    verifyToken,
    removeToken
}