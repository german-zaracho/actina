import { MongoClient, ObjectId } from "mongodb";
import bcrypt from 'bcrypt'

const client = new MongoClient('mongodb+srv://project:486njikl@project.gobfbbu.mongodb.net')
const db = client.db("AH2023")

const accountCollection = db.collection("account")

async function createAccount(account){
    await client.connect()

    const exists = await accountCollection.findOne( { userName: account.userName } )

    if( exists ) throw new Error( "That account already exists" )
    
    const newAccount = { ...account }

    newAccount.password = await bcrypt.hash( account.password, 10 )

    await accountCollection.insertOne(newAccount)
}

async function login( account ){
    await client.connect()

    const exists = await accountCollection.findOne( { userName: account.userName } )

    if( !exists ) throw new Error( "I could't log in" )

    const itsValid = await bcrypt.compare( account.password, exists.password )

    if( !itsValid ) throw new Error( "I could't log in" )

    return { ...exists, password: undefined }
}
export {
    createAccount,
    login
}