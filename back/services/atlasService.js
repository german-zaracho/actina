import { MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);
const collection = db.collection("atlas");

async function getAll() {
    await client.connect();
    return await collection.find().toArray();
}

async function getById(id) {
    await client.connect();
    return await collection.findOne({ _id: new ObjectId(id) });
}

// Este recibe la materia en base a un param que se pasa por la url al darle click a una de las materias, 
// luego busca dentro de la coleccion y devuelve todos los que tengan esa materia
// async function getAtlasBySubject(subject) {
//     return db.collection("atlas").find({ subject: subject }).toArray();
// }

async function create(data) {
    await client.connect();
    const result = await collection.insertOne(data);
    return { _id: result.insertedId, ...data };
}

async function update(id, data) {
    await client.connect();
    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
    );
    return result;
}

async function deleteAtlas(id) {
    await client.connect();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result;
}

export {

    getAll,
    getById,
    update,
    create,
    deleteAtlas,
    // getAtlasBySubject,

};