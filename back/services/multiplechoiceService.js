// import { MongoClient, ObjectId } from "mongodb";
// import dotenv from 'dotenv';
// dotenv.config();

// const client = new MongoClient(process.env.MONGODB_URI);
// const db = client.db(process.env.DB_NAME);

// // Los servicios reciben las indicaciones de los controladores y hacen la magia y devuelven la informacion pertinente
// async function getMultiplechoices() {

//     // Encuentra la informacion dentro de la coleccion de la base de datos de mongoDB y la convierte en un array y la devuelve
//     return db.collection("multiplechoices").find().toArray();

// }

// // Hace lo mismo que arriba pero para un solo producto en base al ID
// async function getMultiplechoiceById(id) {
//     return db.collection("multiplechoices").findOne({ _id: new ObjectId(id) });
// }

// // Este recibe la materia en base a un param que se pasa por la url al darle click a una de las materias, 
// // luego busca dentro de la coleccion y devuelve todos los que tengan esa materia
// async function getMultiplechoicesBySubject(subject) {
//     return db.collection("multiplechoices").find({ subject: subject }).toArray();
// }

// //Basicamente cuando creas por POST un objeto nuevo en la base de datos te muestra el "insertedId": "el id que luego le pasas para el GET y demas"
// //por lo que cuando se crea un objeto nuevo (para eso es el metodo .insertOne) en lugar de pasar solo el id te muestra el objeto directamente
// const createMultiplechoice = async (multiplechoice) => {

//     const multiplechoices = await db.collection("multiplechoices").insertOne(multiplechoice);
//     multiplechoice._id = multiplechoices.insertedId;

//     return multiplechoice;

// };

// // Busca dentro de la coleccion y reemplaza el producto (del cual se pasa el ID) por lo contenido en "product"
// const replaceMultiplechoice = async (id, multiplechoice) => {

//     const replaceMultiplechoice = await db.collection("multiplechoices").replaceOne({ _id: new ObjectId(id) }, multiplechoice);
//     return replaceMultiplechoice;

// };

// // A direfencia del de arriba, este actualiza los datos nuevos en base al ID, el $set: es el operador que utiliza mongoDB para actualizar el objeto "product"
// const editMultiplechoice = async (id, multiplechoice) => {

//     const editMultiplechoice = await db.collection("multiplechoices").updateOne({ _id: new ObjectId(id) }, { $set: multiplechoice });
//     return editMultiplechoice;

// };

// // Misma historia => Borra por ID
// const deleteMultiplechoice = async (id) => {

//     const deletedMultiplechoice = await db.collection("multiplechoices").deleteOne({ _id: new ObjectId(id) });
//     return deletedMultiplechoice;

// };

// export {

//     getMultiplechoices,
//     getMultiplechoiceById,
//     editMultiplechoice,
//     createMultiplechoice,
//     replaceMultiplechoice,
//     deleteMultiplechoice,
//     getMultiplechoicesBySubject,

// };

import dotenv from 'dotenv';
dotenv.config();
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);
const collection = db.collection("multiplechoices");

async function getAll() {
    await client.connect();
    return await collection.find().toArray();
}

async function getById(id) {
    await client.connect();
    return await collection.findOne({ _id: new ObjectId(id) });
}

async function create(data) {
    await client.connect();
    const result = await collection.insertOne(data);
    return { _id: result.insertedId, ...data };
}

async function update(id, data) {
    await client.connect();
    await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
    );
}

async function deleteItem(id) {
    await client.connect();
    await collection.deleteOne({ _id: new ObjectId(id) });
}

export { getAll, getById, create, update, deleteItem as delete };