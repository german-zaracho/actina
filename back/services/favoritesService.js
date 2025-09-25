import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("process.env.REACT_APP_MONGODB_URI"); // mongodb://localhost:27017 -> 127.0.0.1 ipv6 ipv4

const db = client.db("process.env.REACT_APP_DB_NAME");
const favorites = db.collection("favorites")

function getFavorites(id){
    return favorites.findOne({ _id: new ObjectId(id) })
        .then( peripheral => {
            return peripheral?.favorites || []
    })
}
async function addToFavorites(id, favorite){
    const update = await favorites.updateOne({ _id: new ObjectId(id) }, { $push: { favorites: favorite } })
    if (update.matchedCount == 0) {
        await favorites.insertOne({ _id: new ObjectId(id), favorites: [favorite] })
    }
    return update
}

export{
    getFavorites,
    addToFavorites
}