// Inserts the sample Post documents from samplePosts.js into the database
// so the main page has something to display locally. Safe to re-run: posts
// already present (matched by username+city+state) are skipped, not duplicated.
//
// Usage: npm run seed

import models from '../models.js'
import samplePosts from './samplePosts.js'

async function waitForModels(timeoutMs = 15000) {
    const start = Date.now()
    while (!models.Post) {
        if (Date.now() - start > timeoutMs) {
            throw new Error(`Timed out waiting for the database connection (${timeoutMs}ms). Check the MongoDB connection in models.js.`)
        }
        await new Promise(resolve => setTimeout(resolve, 100))
    }
}

async function seed() {
    await waitForModels()

    for (const post of samplePosts) {
        const existing = await models.Post.findOne({
            username: post.username,
            city: post.city,
            state: post.state
        })
        if (existing) {
            console.log(`Skipped (already exists): ${post.city}, ${post.state} - ${post.username}`)
            continue
        }
        await models.Post.create(post)
        console.log(`Inserted: ${post.city}, ${post.state} - ${post.username}`)
    }

    console.log('Seeding complete')
    process.exit(0)
}

seed().catch(err => {
    console.error('Seeding failed:', err)
    process.exit(1)
})
