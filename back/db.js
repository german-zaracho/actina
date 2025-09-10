import { MongoClient } from 'mongodb'

const client = new MongoClient('process.env.REACT_APP_MONGODB_URI')
const db = client.db("process.env.REACT_APP_DB_NAME")

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
