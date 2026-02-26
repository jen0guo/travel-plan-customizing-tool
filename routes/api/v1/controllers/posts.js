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

// returns results searched by the user
router.get('/search', async function(req,res,next) {
    let keyword = req.query.state;
    let keycity = req.query.city;
    let cityType = typeof keycity;
    if(cityType ==='undefined') {
      try {
        let results = await req.models.Post.find({state: {'$regex' : new RegExp(`^${keyword}$`), '$options': 'i'}});
        res.json(results)
      } catch(err) {
        console.log(err)
        res.status(500).json({"status": "error", "error":err})
      }
    } else {
      try {
        let results = await req.models.Post.find({city: {'$regex' : new RegExp(`^${keycity}$`), '$options': 'i'}});
        res.json(results)
      } catch(err) {
        console.log(err)
        res.status(500).json({"status": "error", "error":err})
    }
  }
    
})

export default router