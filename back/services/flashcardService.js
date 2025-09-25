import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("process.env.REACT_APP_MONGODB_URI")
const db = client.db("process.env.REACT_APP_DB_NAME");

// Los servicios reciben las indicaciones de los controladores y hacen la magia y devuelven la informacion pertinente
async function getFlashcards() {

    // Encuentra la informacion dentro de la coleccion de la base de datos de mongoDB y la convierte en un array y la devuelve
    return db.collection("flashcards").find().toArray();

}

// Hace lo mismo que arriba pero para un solo producto en base al ID
async function getFlashcardById(id) {
    return db.collection("flashcards").findOne({ _id: new ObjectId(id) });
}

// Este recibe la materia en base a un param que se pasa por la url al darle click a una de las materias, 
// luego busca dentro de la coleccion y devuelve todos los que tengan esa materia
async function getFlashcardsBySubject(subject) {
    return db.collection("flashcards").find({ subject: subject }).toArray();
}

//Basicamente cuando creas por POST un objeto nuevo en la base de datos te muestra el "insertedId": "el id que luego le pasas para el GET y demas"
//por lo que cuando se crea un objeto nuevo (para eso es el metodo .insertOne) en lugar de pasar solo el id te muestra el objeto directamente
const createFlashcard = async (flashcard) => {

    const flashcards = await db.collection("flashcards").insertOne(flashcard);
    flashcard._id = flashcards.insertedId;

    return flashcard;

};

// Busca dentro de la coleccion y reemplaza el flashcard (del cual se pasa el ID) por lo contenido en "flashcard"
const replaceFlashcard = async (id, flashcard) => {

    const replaceFlashcard = await db.collection("flashcards").replaceOne({ _id: new ObjectId(id) }, flashcard);
    return replaceFlashcard;

};

// A direfencia del de arriba, este actualiza los datos nuevos en base al ID, el $set: es el operador que utiliza mongoDB para actualizar el objeto "flashcard"
const editFlashcard = async (id, flashcard) => {

    const editFlashcard = await db.collection("flashcards").updateOne({ _id: new ObjectId(id) }, { $set: flashcard });
    return editFlashcard;

};

// Misma historia => Borra por ID
const deleteFlashcard = async (id) => {

    const deletedFlashcard = await db.collection("flashcards").deleteOne({ _id: new ObjectId(id) });
    return deletedFlashcard;

};

export {

    getFlashcards,
    getFlashcardById,
    editFlashcard,
    createFlashcard,
    replaceFlashcard,
    deleteFlashcard,
    getFlashcardsBySubject,

};