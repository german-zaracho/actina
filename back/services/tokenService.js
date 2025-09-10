import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient('mongodb+srv://project:486njikl@project.gobfbbu.mongodb.net')
const db = client.db("AH2023")

const tokenCollection = db.collection("tokens")

async function createToken(account){

    const token = jwt.sign(account,"Secret password")

    await client.connect()
    console.log(account)
    await tokenCollection.insertOne({token, account_id: account._id})

    return token

}

async function verifyToken(token){

    try {
        const payload = jwt.verify(token, "Secret password")
        console.log("payload",payload)
        await client.connect()
        const activeSession = await tokenCollection.findOne({token, account_id: new ObjectId(payload._id)})
        console.log("activeSession",activeSession)
        if(!activeSession) return null
        return payload
    } catch (error) {
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