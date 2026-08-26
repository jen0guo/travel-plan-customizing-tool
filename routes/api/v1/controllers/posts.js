import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session';

var router = express.Router();

// Posts new entry in the database
router.post('/', async function(req, res, next){
    console.log("working i guess")
    let session = req.session
    console.log(req.body.restaurant)
    if (session.isAuthenticated) {
        try {
            const newPost = new req.models.Post(
                {
                    state: req.body.state,
                    city: req.body.city,
                    hotel: req.body.hotel,
                    restaurant: req.body.restaurant,
                    places: req.body.places,
                    username: req.session.account.username
                }
            )
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

// Gets required information requested by the frontend
router.get('/', async function(req,res,next) {
    try {
        let username = req.query.username
        let posts = await req.models.Post.find()
        if (username) {
          posts = await req.models.Post.find({username: username}).exec();
        }else {
          posts = await req.models.Post.find()
        }
        let postData = await Promise.all(
          posts.map(async post => {
            let places = post.places
            let restaurant = post.restaurant
            console.log("------------")
            console.log("post id: ", post._id)
            console.log("places: ", places)
            console.log("restaurant: ", restaurant)
            console.log("------------")
            let placesHTML = ""
            // renders HTML in the server
            for (let i = 0; i < places.length; i++) {
              placesHTML += `<p>${places[i]}</p><br>`
            }
            let restHTML = ""
            for (let i = 0; i < restaurant.length; i++) {
              restHTML += `<p>${restaurant[i]}</p><br>`
            }
            let plcStr = ""
            for (let i = 0; i < places.length; i++) {
              plcStr = plcStr + places[i] + "%^&*"
            }
            let resStr = ""
            for (let i = 0; i < restaurant.length; i++) {
              resStr = resStr + restaurant[i] + "%^&*"
            }
            return {
                "username":  post.username,
                "id": post._id,
                "city": post.city,
                "postHTML" : 
                `<div onclick="generateForm('${post.username}', '${post.city}', '${post.state}', '${plcStr}', '${post.hotel}', '${resStr}')"  id="post_card" class="col col-xs-12 col-sm-4 col-lg-3 col-xl-2">
                  <h3>${post.username}</h3>
                  <h2>Post</h2>
                  <h3>City</h3><p>${post.city}</p>
                  <h3>State</h3><p>${post.state}</p>
                  <h3>Hotel</h3><p>${post.hotel}</p>
                  <h3>Restaurant</h3><div>${restHTML}</div>
                  <h3>Place</h3><div>${placesHTML}</div>
                </div>`
            }
          })
        );
        res.json(postData)
      } catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', error: 'error' + error});
      }
})

/*router.get('/indView', async function(req, res, next) {
  let query = req.query.val
  console.log(query)
})*/

// Fields the search can filter and rank on. state/city are matched exactly
// (case-insensitive) to preserve the old single-field search behavior;
// hotel/restaurant/places are matched as a case-insensitive substring.
const CRITERIA_FIELDS = ['state', 'city', 'hotel', 'restaurant', 'places']
const ARRAY_FIELDS = new Set(['restaurant', 'places'])
const EXACT_FIELDS = new Set(['state', 'city'])

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function fieldMatches(fieldName, postValue, queryValue) {
  const needle = queryValue.toLowerCase()
  if (ARRAY_FIELDS.has(fieldName)) {
    return Array.isArray(postValue) &&
      postValue.some(v => typeof v === 'string' && v.toLowerCase().includes(needle))
  }
  if (typeof postValue !== 'string') return false
  return EXACT_FIELDS.has(fieldName)
    ? postValue.toLowerCase() === needle
    : postValue.toLowerCase().includes(needle)
}

// Multi-criteria search: accepts any of state/city/hotel/restaurant/places
// as query params, plus an optional `priority` (comma-separated field names,
// highest priority first) that controls how results are ranked. Results are
// filtered to posts matching at least one supplied criterion, then sorted by
// a relevance score weighted by priority order.
router.get('/search', async function(req, res, next) {
  const provided = CRITERIA_FIELDS.filter(field => req.query[field])

  if (provided.length === 0) {
    return res.json([])
  }

  const requestedPriority = (req.query.priority || '')
    .split(',')
    .map(f => f.trim())
    .filter(f => provided.includes(f))
  const orderedFields = [
    ...requestedPriority,
    ...provided.filter(f => !requestedPriority.includes(f))
  ]
  const weightByField = {}
  orderedFields.forEach((field, i) => {
    weightByField[field] = orderedFields.length - i
  })

  try {
    const orConditions = provided.map(field => ({
      [field]: { '$regex': new RegExp(escapeRegex(req.query[field]), 'i') }
    }))
    const candidates = await req.models.Post.find({ '$or': orConditions })

    const scored = candidates
      .map(post => {
        let score = 0
        for (const field of provided) {
          if (fieldMatches(field, post[field], req.query[field])) {
            score += weightByField[field]
          }
        }
        return { post, score }
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)

    res.json(scored.map(({ post, score }) => ({ ...post.toObject(), score })))
  } catch(err) {
    console.log(err)
    res.status(500).json({"status": "error", "error":err})
  }
})

export default router