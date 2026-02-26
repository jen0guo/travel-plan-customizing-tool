async function init(){
    await loadIdentity();
    let identityInfo = await fetchJSON(`api/v1/users/myIdentity`)
    if(identityInfo.status == "loggedout"){
        window.alert("Please log in first")
    } else {
        loadUserInfo();
    }

}

async function travlePlanInit(){
    await loadIdentity();
    let identityInfo = await fetchJSON(`api/v1/users/myIdentity`)
    if(identityInfo.status == "loggedout"){
        window.alert("Please log in first")
    } else {
        loadTravelPlans();
    }

}

async function loadUserInfo(){
    let identityInfo = await fetchJSON(`api/v1/users/myIdentity`)
    let username = identityInfo.userInfo.username
    let name = identityInfo.userInfo.name
    if(identityInfo.status == "loggedin"){
        document.getElementById("username-span").innerText = `${name} (${username})`;
    }
    loadUserInfoPosts(username)
}


async function loadUserInfoPosts(username){
    document.getElementById("posts_box").innerText = "Loading...";
    let postsJson = await fetchJSON(`api/v1/posts`);
    let postBoxes = ""
    let user_cities = []
    for(let i = 0; i < postsJson.length; i++) {
        if(username == postsJson[i].username) {
            postBoxes = postBoxes + postsJson[i].postHTML
            if (!user_cities.includes(postsJson[i].city)) {
                user_cities.push(postsJson[i].city)
            }
        }
    }
    
    document.getElementById("posts_box").innerHTML = postBoxes;
    document.getElementById("user_cities").innerText = user_cities.join(', ') + " (" + user_cities.length + ")";
}

async function loadTravelPlans() {
    document.getElementById("travel_plan").innerHTML = ""
    let travelPlan = await fetchJSON(`api/v1/plans`);
    let travelPlanHtml = travelPlan.map((plan) => {
        return `<div id="plan" class="col col-xs-12 col-sm-3 col-lg-3 col-xl-2">
        <h2>${plan.state}</h2>
            <h3>City</h3><p>${plan.city.join('; <br>')}</p>
            <h3>Hotel</h3><p>${plan.hotel.join('; <br>')}</p>
            <h3>Restaurant</h3><p>${plan.restaurant.join('; <br>')}</p>
            <h3>Place</h3><p>${plan.place.join('; <br>')}</p>
        </div>`

    })
    console.log(travelPlan)
    document.getElementById("travel_plan").innerHTML = travelPlanHtml
}
