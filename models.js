import mongoose from 'mongoose'

let models = {};

main().catch(err => console.log(err))
async function main() {
    console.log('Connecting to mongodb')
    await mongoose.connect('mongodb+srv://travelplan:travelplan123@travelplan.ceh9s.mongodb.net/projectDatabase?retryWrites=true&w=majority')
    console.log('success')
    const postSchema = new mongoose.Schema({
        state: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        hotel: { type: String, required: true, trim: true },
        restaurant: Array,
        places: Array,
        username: { type: String, required: true, trim: true }
    })
    // /search filters on state and city, and GET / filters on username
    postSchema.index({ state: 1 })
    postSchema.index({ city: 1 })
    postSchema.index({ username: 1 })
    // makes a Post piece
    models.Post = mongoose.model('Post', postSchema)

    const travelPlanSchema = new mongoose.Schema({
        state: { type: String, required: true, trim: true },
        city: Array,
        hotel: Array,
        restaurant: Array,
        places: Array,
        username: { type: String, required: true, trim: true }
    })
    // Every plan document is keyed by (username, state) per the app logic in
    // plans.js ("every entry is defined by a state and username") - enforce
    // that invariant at the DB level too, closing a race where two concurrent
    // requests could otherwise create duplicate documents for the same pair.
    travelPlanSchema.index({ username: 1, state: 1 }, { unique: true })
    // makes a Plan piece
    models.Plan = mongoose.model('Plan', travelPlanSchema)

    console.log('mongoose model created')
}

export default models;
