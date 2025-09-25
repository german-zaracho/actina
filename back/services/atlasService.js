import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("process.env.REACT_APP_MONGODB_URI")
const db = client.db("process.env.REACT_APP_DB_NAME");

// Los servicios reciben las indicaciones de los controladores y hacen la magia y devuelven la informacion pertinente
async function getAtlas() {

    // Encuentra la informacion dentro de la coleccion de la base de datos de mongoDB y la convierte en un array y la devuelve
    return db.collection("atlas").find().toArray();

}

// Hace lo mismo que arriba pero para un solo producto en base al ID
async function getAtlasById(id) {
    return db.collection("atlas").findOne({ _id: new ObjectId(id) });
}

// Este recibe la materia en base a un param que se pasa por la url al darle click a una de las materias, 
// luego busca dentro de la coleccion y devuelve todos los que tengan esa materia
async function getAtlasBySubject(subject) {
    return db.collection("atlas").find({ subject: subject }).toArray();
}

//Basicamente cuando creas por POST un objeto nuevo en la base de datos te muestra el "insertedId": "el id que luego le pasas para el GET y demas"
//por lo que cuando se crea un objeto nuevo (para eso es el metodo .insertOne) en lugar de pasar solo el id te muestra el objeto directamente
const createAtlas = async (atla) => {

    const atlas = await db.collection("atlas").insertOne(atla);
    atlas._id = atlas.insertedId;

    return atlas;

};

// Busca dentro de la coleccion y reemplaza el atlas (del cual se pasa el ID) por lo contenido en "atlas"
const replaceAtlas = async (id, atlas) => {

    const replaceAtlas = await db.collection("atlas").replaceOne({ _id: new ObjectId(id) }, atlas);
    return replaceAtlas;

};

// A direfencia del de arriba, este actualiza los datos nuevos en base al ID, el $set: es el operador que utiliza mongoDB para actualizar el objeto "atlas"
const editAtlas = async (id, atlas) => {

    const editAtlas = await db.collection("atlas").updateOne({ _id: new ObjectId(id) }, { $set: atlas });
    return editAtlas;

};

// Misma historia => Borra por ID
const deleteAtlas = async (id) => {

    const deletedAtlas = await db.collection("atlas").deleteOne({ _id: new ObjectId(id) });
    return deletedAtlas;

};

export {

    getAtlas,
    getAtlasById,
    editAtlas,
    createAtlas,
    replaceAtlas,
    deleteAtlas,
    getAtlasBySubject,

};