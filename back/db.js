import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);

client.connect()
    .then( async() => {

        console.log("Connected to the database");
        const collectionNames = ["multiplechoices", "flashcards", "atlas"];
        const queries = collectionNames.map(collectionName =>
            db.collection(collectionName).find().toArray()
        );

        const results = await Promise.all(queries);

        console.log(results);
    } )
    .catch( () => console.log("Actina no se conecto con la base de datos") ) 
