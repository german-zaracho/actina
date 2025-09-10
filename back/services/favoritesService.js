import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb+srv://project:486njikl@project.gobfbbu.mongodb.net"); // mongodb://localhost:27017 -> 127.0.0.1 ipv6 ipv4

const db = client.db("AH20232CP1");
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