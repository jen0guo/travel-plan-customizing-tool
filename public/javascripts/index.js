async function init(){
    await loadIdentity();
    showPosts();
}

// Creates a new entry form for restaurant if the user clicks 'add'
function addRest() {
    let numChild = document.getElementById("rest-query").childElementCount
    let r = (numChild/2) + 1
    let rVal = 'r' + r
    let delR = "deleteQuery(\"" + rVal + "\")"
    document.getElementById("rest-query").innerHTML += 
    `<div id=${rVal}>
        <br>
        <div>
            <input type="text" class="inR">
            <button onclick=${delR}>delete</button>
        </div>
     </div>
    `
}

// Creates a new entry form for places if the user clicks 'add'
function addPlace() {
    let numChild = document.getElementById("place-query").childElementCount
    let p = (numChild/2) + 1
    let pVal = 'p' + p
    let delP = "deleteQuery(\"" + pVal + "\")"
    let currentInnerHTML = document.getElementById("place-query").innerHTML
    document.getElementById("place-query").innerHTML = currentInnerHTML + 
    `<div id=${pVal}>
        <br>
        <div>
            <input type="text" class="inP">
            <button onclick=${delP}>delete</button>
        </div>
     </div>
    `
}

// If the user wishes to delete the entry, deletes it
function deleteQuery(divVal) {
    document.getElementById(divVal).remove()
}

// Makes a post to the database
async function makePost() {
    console.log("It's working")
    // Puts all of the places in an array
    let placeClass = document.querySelectorAll(".inP")
    let places = []
    let placeEmpty = false
    for (let i = 0; i < placeClass.length; i++) {
        if (placeClass[i].value == "") {
            placeEmpty = true
            break
        }
        console.log(placeClass[i].value)
        places.push(placeClass[i].value)
    }
    // Puts all of the restaurants in an array
    let restClass = document.querySelectorAll(".inR")
    let restaurant = []
    let restEmpty = false
    for (let i = 0; i < restClass.length; i++) {
        if (restClass[i].value == "") {
            restEmpty = true
            break
        }
        console.log(restClass[i].value)
        restaurant.push(restClass[i].value)
    }
    console.log(placeEmpty)
    console.log(restEmpty)
    let city = escapeHTML(document.getElementById("city").value);
    let state = escapeHTML(document.getElementById("state").value);
    let hotel = escapeHTML(document.getElementById("hotel").value);
    // If any of the fields are empty
    let boolCheck = city.length == 0 || hotel.length == 0 || restEmpty || placeEmpty;
    if (!boolCheck) {
        let myData = {
            city: city,
            state: state,
            hotel: hotel,
            restaurant: restaurant,
            places: places
        }
        console.log(myData)
        // send stuff to server
        // redirected to users.js through app.js
        let statusCode = 0
        let returnResponse = await fetch("/api/v1/posts", {
            method: "POST",
            body: JSON.stringify(myData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            statusCode = response.status
        })
        // Resets the entire field once the form is submitted
        document.getElementById("state").value = ""
        document.getElementById("city").value = ""
        document.getElementById("hotel").value = ""
        document.getElementById("rest-query").innerHTML = 
        `<div id="r1">
            <br>
            <div>
                <input type="text" id="restaurant" class="inR">
                <button onclick="deleteQuery('r1')">delete</button>
            </div>
         </div>
        `
        document.getElementById("place-query").innerHTML = 
        `<div id="p1">
            <br>
            <div>
                <input type="text" id="places" class="inP">
                <button onclick="deleteQuery('p1')">delete</button>
            </div>
         </div>
        `
        // If the status code is over 300, alerts the user
        if (statusCode < 300) {
            document.getElementById("postStatus").innerHTML = "Submit successfully!"
            document.getElementById("popup").style.display = "none"
        } else {
            window.alert("Please log in first")
        }
    } else {
        window.alert("Forms can't be empty")
    }

    showPosts()
}

// Show posts stored in the database
async function showPosts() {
    document.getElementById('post_boxes').innerHTML = ""
    let postsJson = await fetchJSON('api/v1/posts')
    console.log(postsJson)
    let postBoxes = ""
    for(let i = 0; i < postsJson.length; i++) {
        postBoxes = postBoxes + postsJson[i].postHTML
    }
    document.getElementById('post_boxes').innerHTML = postBoxes

}

// modal for submitting an entry
async function popup() {
    let postsJson = await fetchJSON('api/v1/users/myIdentity')
    if (postsJson.status == 'loggedout') {
        window.alert("Please log in before creating posts")
    } else if (postsJson.status == 'loggedin') {
        let status = document.getElementById("popup").style.display;
        if(status == "none" || status == "") {
            document.getElementById("popup").style.display = "block"
        } else {
            // If it's none, completely resets the innerHTML
            document.getElementById("popup").style.display = "none"
            document.getElementById("popup").innerHTML = 
            `
                <div id="content">
                <button onclick="popup()" id="close">X</button>
                <p class="text-font">Enter the state</p>
                <select type="text" id="state">
                <option value="Alabama">Alabama</option>
                <option value="Alaska">Alaska</option>
                <option value="Arizona">Arizona</option>
                <option value="Arkansas">Arkansas</option>
                <option value="California">California</option>
                <option value="Colorado">Colorado</option>
                <option value="Connecticut">Connecticut</option>
                <option value="Delaware">Delaware</option>
                <option value="Florida">Florida</option>
                <option value="Georgia">Georgia</option>
                <option value="Hawaii">Hawaii</option>
                <option value="Idaho">Idaho</option>
                <option value="Illinois">Illinois</option>
                <option value="Indiana">Indiana</option>
                <option value="Iowa">Iowa</option>
                <option value="Kansas">Kansas</option>
                <option value="Kentucky">Kentucky</option>
                <option value="Louisiana">Louisiana</option>
                <option value="Maine">Maine</option>
                <option value="Maryland">Maryland</option>
                <option value="Massachusetts">Massachusetts</option>
                <option value="Michigan">Michigan</option>
                <option value="Minnesota">Minnesota</option>
                <option value="Mississippi">Mississippi</option>
                <option value="Missouri">Missouri</option>
                <option value="Montana">Montana</option>
                <option value="Nebraska">Nebraska</option>
                <option value="Nevada">Nevada</option>
                <option value="New Hampshire">New Hampshire</option>
                <option value="New Jersey">New Jersey</option>
                <option value="New Mexico">New Mexico</option>
                <option value="New York">New York</option>
                <option value="North Carolina">North Carolina</option>
                <option value="North Dakota">North Dakota</option>
                <option value="Ohio">Ohio</option>
                <option value="Oklahoma">Oklahoma</option>
                <option value="Oregon">Oregon</option>
                <option value="Pennsylvania">Pennsylvania</option>
                <option value="Rhode Island">Rhode Island</option>
                <option value="South Carolina">South Carolina</option>
                <option value="South Dakota">South Dakota</option>
                <option value="Tennessee">Tennessee</option>
                <option value="Texas">Texas</option>
                <option value="Utah">Utah</option>
                <option value="Vermont">Vermont</option>
                <option value="Virginia">Virginia</option>
                <option value="Washington">Washington</option>
                <option value="West Virginia">West Virginia</option>
                <option value="Wisconsin">Wisconsin</option>
                <option value="Wyoming">Wyoming</option>
                </select>
                <br/>
                <p class="text-font">Enter the City</p>
                <input type="text" id ="city">
                <br/>
                <p class="text-font">Enter the hotel you stayed at</p>
                <input type="text" id="hotel">
                <br/>
                <p class="text-font">Enter the restaurants you visited</p>
                <div id="rest-query" class="flex">
                    <div id="r1">
                    <br>
                    <div>
                        <input type="text" id="restaurant">
                        <button onclick="deleteQuery('r1')">delete</button>
                    </div>
                    </div>
                </div>
                <button onclick="addRest()">add</button>
                <br/>
                <p class="text-font">Enter the places you visited</p>
                <div id="place-query" class="flex">
                    <div id="p1">
                    <br>
                    <div>
                        <input type="text" id="places" class="inP">
                        <button onclick="deleteQuery('p1')">delete</button>
                    </div>
                    </div>
                </div>
                <button onclick="addPlace()">add</button>
                <br/>
                <br/>
                <button class="color-change text-font" onclick="makePost()">Submit</button> <span id="postStatus"></span>
            </div>
            `
        }
    }
}


let modalBtn = document.getElementById("modal-btn")

// Generates a modal for each entry submitted by users
async function generateForm(username, city, state, places, hotel, restaurant) {
    let newPlc = places.split("%^&*")
    let newRes = restaurant.split("%^&*")
    newPlc.pop()
    newRes.pop()
    let plcHTML = ""
    let resHTML = ""
    for (let i = 0; i < newPlc.length; i++) {
        plcHTML +=  
            `<div style="padding-left:30px">
                <h1>Places</h1>
                <p>${newRes[i]}</p>
            </div>
            <button onclick="addToList(['restaurant', '${newRes[i]}', '${state}'])">Add</button><br>`
    }
    for (let i = 0; i < newRes.length; i++) {
        resHTML +=
        `<div style="padding-left:30px">
        <h1>Restaurants</h1>
        <p>${newRes[i]}</p>
    </div>
    <button onclick="addToList(['places', '${newRes[i]}', '${state}'])">Add</button><br>`
    }
    // Modal content
    let htmlBlock = `
    <div>
        <div class="click-block" id="username-block">
            <div>
                <h1>Username</h1>
                <p>${username}</p>
            </div>
        </div>
        <div class="click-block" id="city-block">
            <div>
                <h1>City</h1>
                <p>${city}</p>
            </div>
            <button onclick="addToList(['city', '${city}', '${state}'])">Add</button>
        </div>
        <div class="click-block" id="state-block">
            <div>
                <h1>State</h1>
                <p>${state}</p>
            </div>
            <button onclick="addToList(['state', '${state}', '${state}'])">Add</button>
        </div>
        <div class="click-block" id="hotel-block">
            <div>
                <h1>Hotel</h1>
                <p>${hotel}</p>
            </div>
            <button onclick="addToList(['hotel', '${hotel}', '${state}'])">Add</button>
        </div>
        <div class="click-block" id="places-block">
            ${plcHTML}
        </div>

        <div class="click-block" id="restaurant-block">
            ${resHTML}
        </div>
    </div>
    `
    document.getElementById("modal-insert").innerHTML = htmlBlock
    let modals = document.querySelector(".modal")
    modals.style.display = "block"
    // let button = document.querySelector("#modal-insert button")
    // button.style.display = "none"

}

// When the user clicks outside the modal, automatically close it
window.onclick = function(e){
    let modal = document.querySelector(".modal")
    if (e.target == modal) {
      modal.style.display = "none"
    }
}

// Adds to list
async function addToList(inputList) {
    let postsJson = await fetchJSON('api/v1/users/myIdentity')
    if (postsJson.status == 'loggedout') {
        window.alert("Please log in before adding to travel plan")
    } else if (postsJson.status == 'loggedin') {
        console.log(inputList)
        // 0: restsurant/place/hotel/city/state/username
        // 1: content
        // 2: state
        let inputType = inputList[0] // 
        let inputValue = inputList[1]
        let returnResponse = await fetchJSON("/api/v1/plans", {
            method: "POST",
            body: {content: inputList}
        })
        window.alert("Add to Travel Plan Successfully! :)")
    }
}

// Returns posts queried by the user
async function searchPosts() {
    let keyword = document.getElementById("search").value;
    let keySearch = document.getElementById("filter").value;
    if(keyword === "") {
        document.getElementById('search_boxes').innerHTML = "<p style=color:red;font-size:large>Please enter the keyword before searching :D</p2><br><br>";
        await new Promise(resolve => setTimeout(resolve, 4 * 1000))
        document.getElementById('search_boxes').innerHTML = "";
    } else {
        let response = await fetch('api/v1/posts/search?' + keySearch + '=' + keyword)
        let postJson = await response.json()
        console.log(postJson)
        console.log("length: " + postJson.length)
        if (postJson.length == 0) {
            document.getElementById('search_boxes').innerHTML = "<p style=color:red;font-size:large>no result, please try another keyword or check your keyword and filter :D</p><br><br>";
            await new Promise(resolve => setTimeout(resolve, 4 * 1000))
            document.getElementById('search_boxes').innerHTML = "";
        } else {
            let searchHTML = ""
            searchHTML = postJson.map(post => {
                return`<div id="post_card" class="col col-xs-12 col-sm-4 col-lg-3 col-xl-2">
                <h3>${post.username}</h3>
                <h2>Post</h2>
                <h3>City</h3><p>${post.city}</p>
                <h3>State</h3><p>${post.state}</p>
                <h3>Hotel</h3><p>${post.hotel}</p>
                <h3>Restaurant</h3><div>${post.restaurant}</div>
                <h3>Place</h3><div>${post.places}</div>
                </div>`
            })
            document.getElementById('search_boxes').innerHTML = searchHTML + "<br>";
        }
    }
}

