import 'dotenv/config'
import mongoose from 'mongoose'

let models = {};

main().catch(err => console.log(err))
async function main() {
    console.log('Connecting to mongodb')
    await mongoose.connect(process.env.mongoUri)
    console.log('success')
    const postSchema = new mongoose.Schema({
        state: String,
        city: String,
        hotel: String,
        restaurant: Array,
        places: Array,
        username: String
    })
    // makes a Post piece
    models.Post = mongoose.model('Post', postSchema)

    const travelPlanSchema = new mongoose.Schema({
        state: String,
        city: Array,
        hotel: Array,
        restaurant: Array,
        places: Array,
        username: String
    })
    // makes a Plan piece
    models.Plan = mongoose.model('Plan', travelPlanSchema)

    console.log('mongoose model created')
}

export default models;
