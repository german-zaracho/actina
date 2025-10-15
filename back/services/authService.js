import { MongoClient, ObjectId } from "mongodb";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);

const accountCollection = db.collection("account")

async function createAccount(account){
    await client.connect()

    // Verificar si ya existe el userName
    const existsByUserName = await accountCollection.findOne({ userName: account.userName })
    if (existsByUserName) {
        throw new Error("That account already exists")
    }

    // Si tienes email, también verificar que no exista
    if (account.email) {
        const existsByEmail = await accountCollection.findOne({ email: account.email })
        if (existsByEmail) {
            throw new Error("Email already exists")
        }
    }
    
    const newAccount = { 
        ...account,
        rol:1
    }

    newAccount.password = await bcrypt.hash( account.password, 10 )

    // Insertar la nueva cuenta
    const result = await accountCollection.insertOne(newAccount)

    // Retornar la cuenta creada (sin la contraseña)
    return {
        _id: result.insertedId,
        userName: newAccount.userName,
        rol: newAccount.rol,
        ...(newAccount.email && { email: newAccount.email })
    }
}

async function login( account ){
    await client.connect()

    const exists = await accountCollection.findOne( { userName: account.userName } )

    if( !exists ) throw new Error( "I couldn't log in" )

    const itsValid = await bcrypt.compare( account.password, exists.password )

    if( !itsValid ) throw new Error( "I couldn't log in" )

    return { 
        ...exists, 
        password: undefined }
}
export {
    createAccount,
    login
}