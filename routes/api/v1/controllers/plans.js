import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session';

var router = express.Router();

// Gets a planner made by the user
router.get('/', async function(req, res, next) {
    let session = req.session
    let username = session.account.username
    if (session.isAuthenticated) {
        try {
            let plans = await req.models.Plan.find({username: username});
            console.log("plans", plans)
            let plansJSON = await Promise.all(
                plans.map(async plan => {
                  return {
                      "username": plan.username,
                      "state": plan.state,
                      "city": plan.city,
                      "hotel": plan.hotel,
                      "restaurant": plan.restaurant,
                      "place": plan.places
                  }
                })
              );
            res.json(plansJSON)
        } catch(err) {
            const errJson = {"status": "error", "error": err}
            res.status(500).json(errJson)
        }
    } else {
        res.status(401).json({"status": "Failed"})
    }

})

// Posts a plan to the database. Every user can have up to 51 different documents with 51 respective states
// Because there can only be one unique state per persone, every entry is defined by a state and username.
// If a region within the state already exists, returns nothing. If the said state doesn't exist in the database, posts a new state
router.post('/', async function(req, res, next){
    console.log("working i guess")
    let session = req.session
    console.log(req.body.content)
    // req.body.content - a list that have 3 elements
    // 0 - restsurant/place/hotel/city/state/username 
    // 1 - content
    // 2 - state
    if (session.isAuthenticated) {
        try {
            let universalID = await req.models.Plan.find({state: req.body.content[2], username: session.account.username})
            console.log("universalID", universalID)
            console.log("username", session.account.username)
            console.log(req.body.content[0] == 'city')
            let newPost
            // If what user sent is a state
            if (req.body.content[0] == 'state') {
                let existingUser = await req.models.Plan.find({username: session.account.username})
                for (const element of existingUser) {
                    if (element.state == req.body.content[1]) {
                        return
                    }
                }
                newPost = new req.models.Plan(
                    {
                        state: req.body.content[1],
                        username: session.account.username
                    }
                )
            // If what user sent is a city
            } else if (req.body.content[0] == 'city') {
                let exists = false
                let curId = ""
                if (universalID.length != 0) {
                    exists = true
                    curId = universalID[0]._id
                }
                console.log(exists)
                if (exists && !universalID[0].city.includes(req.body.content[1])) {
                    console.log("city in this loop1")
                    newPost = await req.models.Plan.findById(curId)
                    newPost.city.push(req.body.content[1])                
                } else if (!exists) {
                    console.log("city in this loop2")
                    newPost = new req.models.Plan(
                        {
                            state: req.body.content[2],
                            city: req.body.content[1],
                            username: session.account.username
                        }
                    )
                } else {
                    return
                }
            // If what user sent is a hotel
            } else if (req.body.content[0] == 'hotel') {
                let exists = false
                let curId = ""
                if (universalID.length != 0) {
                    exists = true
                    curId = universalID[0]._id
                }
                console.log(exists)
                if (exists && !universalID[0].hotel.includes(req.body.content[1])) {
                    console.log("hotel in this loop1")
                    newPost = await req.models.Plan.findById(curId)
                    newPost.hotel.push(req.body.content[1])                
                } else if (!exists) {
                    console.log("hotel in this loop2")
                    newPost = new req.models.Plan(
                        {
                            state: req.body.content[2],
                            hotel: req.body.content[1],
                            username: session.account.username
                        }
                    )
                } else {
                    return
                }
            // If what user sent is a restaurant
            } else if (req.body.content[0] == 'restaurant') {
                let exists = false
                let curId = ""
                if (universalID.length != 0) {
                    exists = true
                    curId = universalID[0]._id
                }
                console.log("restaurant " + exists)
                if (exists && !universalID[0].restaurant.includes(req.body.content[1])) {
                    console.log("restaurant in this loop1")
                    newPost = await req.models.Plan.findById(curId)
                    newPost.restaurant.push(req.body.content[1])                
                } else if (!exists) {
                    console.log("restaurant in this loop2")
                    newPost = new req.models.Plan(
                        {
                            state: req.body.content[2],
                            restaurant: req.body.content[1],
                            username: session.account.username
                        }
                    )
                } else {
                    return
                }
            // If what user sent are places
            } else if (req.body.content[0] == 'places') {
                let exists = false
                let curId = ""
                if (universalID.length != 0) {
                    exists = true
                    curId = universalID[0]._id
                }
                console.log(exists)
                if (exists && !universalID[0].places.includes(req.body.content[1])) {
                    console.log("places in this loop1")
                    newPost = await req.models.Plan.findById(curId)
                    newPost.places.push(req.body.content[1])                
                } else if (!exists) {
                    console.log("places in this loop2")
                    newPost = new req.models.Plan(
                        {
                            state: req.body.content[2],
                            places: req.body.content[1],
                            username: session.account.username
                        }
                    )
                } else {
                    return
                }
            }
            console.log("sent successfuly")
            await newPost.save()
            res.json({"status": "Success"})
        } catch(err) {
            const errJson = {"status": "error", "error": err}
            res.status(500).json(errJson)
        }
    } else {
        res.status(401).json({"status": "Failed"})
    }

})

export default router