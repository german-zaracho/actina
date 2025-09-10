import { MongoClient, ObjectId } from "mongodb";
import bcrypt from 'bcrypt'

const client = new MongoClient('mongodb+srv://project:486njikl@project.gobfbbu.mongodb.net')
const db = client.db("AH2023")
const accountCollection = db.collection("profile")

async function createProfile(account, profile){

    const completeProfile = {
        ...profile,
        userName: account.userName,
        _id: new ObjectId(account._id)
    }
    await client.connect()
    const exists = await accountCollection.findOne( { userName: account.userName } )
    if(exists){
        throw new Error("That profile already exists")
    }

    await accountCollection.insertOne(completeProfile)

}

async function getProfile(id){

    await client.connect()
    const profile = await accountCollection.findOne( { _id: new ObjectId(id) } )
    if(!profile){
        throw new Error("That profile doesn't exist")
    }
    return profile
    
}

export {
    createProfile,
    getProfile
}