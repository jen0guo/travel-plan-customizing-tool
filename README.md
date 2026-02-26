# Project Proposal
## Project Description
* Who is your target audience?  Who do you envision using your application? Depending on the domain of your application, there may be a variety of audiences interested in using your application.  You should hone in on one of these audiences.
    * Our target audience is people who want to travel, yet don’t know where to visit, where to stay, and so on. Covid prevented people from traveling for a while, and with lockdown and travel restrictions lifted in multiple areas, it is possible that people would want to travel again. Another kind of targer users is people who seek for recommendations about specific locations to visit such as restaurants, coffee shops, and hotels. These audience know their destination of their travel but do not know about what locations are good to visist in their destination. Users could find all these information in our application easily and effciently.
* Why does your audience want to use your application? Please provide some sort of reasoning. 
    * When one wants to travel to different places, research is a must. However, it is a hassle trying to collect information on where to stay, where to eat, and where to visit while looking at the reviews. This application would provide comprehensive recommendations including restaurants, hotels, and scenery in the destination that travelers want to visit in one place, and also let users customize their travel plan based on reviews left by other users. The functions of searching and categorizing make the process of making a travel plan much easier. Users could access all the information they need and make a great plan on this single website without jumping around different ones. Moreover, users could post their reviews about a place they visit, which provides information to future travelers. Users could leave a heart or like to comment that they agree with and comment on others’ reviews.
* Why do you as developers want to build this application?
    * We want to build this application because we want to help people who have a hard time making travel plans. We want to make their life easier and help them enjoy their traveling.
Additionally, this application would be a time saver for those who need to spend much time searching for relevant travel information across different websites.



## Technical Description
- Architectural diagram
    - Workflow: https://miro.com/app/board/uXjVO49R8lM=/
    - Communication type: 
      Our application would use Websocket as the communication type. Users could see the latest posts made by other users as soon as possible. Users could update and correct their posts simultaneously when other users are browsing the webiste. The newest information would be uploaded to the webiste to avoid disseminating misinformation.

| __Priority__ | __User__ | __Description__ | __Technical Implemetation__ |
|----------|------|-------------|-------------------------|
| P0  | Users who make posts | I want to share my travel plan to a certain city, state that I have been to and describe my experience. |  When users make a post, the post object would be added to the list of posts. The post object would have attributes like city, state, and description. Users could also see all the previous posts on the website. |
| P0.5 | Login users who make posts | I want to log in to the website and make a post. I want to preview all the posts I made with a certain account. | When a new user tries to make posts, they would be directed to the login page and log in by using their email. After login, users could repeat P0 with user authentication. Users could only see the document. They could also log out when they want to stop using the website. |
| P1 | Users who want to input more information in the post | I want to share which restaurants I have been to and which hotel I have stayed at. | Add more features like restaurants, hotel, star ratings |
| P2 | Users who search for posts | I want to search for great restaurants and hotels in the destination that I will visit. I want to know good places to visit when I have no plans. | When searching from the mongodb for restaurants, hotels, places to visit, etc., users can filter out the results by clicking on specific categories. Suggested places to visit can be found by sorting results by popularity/rating. |
| P3 | Users who want to make a travel plan | I want to make a 3-day tour plan based on places “most recommended” by other users in a specific | The majority of this is going to be done through POST and GET as always. Once a user adds a place they wish to visit, it will be added to their travel_plan through POST, which will be visible on their profile page through GET travel_plan |



## Endpoints
   * Main routers:
      * posts
      * users
      * plans
   * __GET__ /api/v1/users/myIdentity
      * Fetches the user information stored in session 
   * __POST__ api/v1/posts
      * Posts a new data entry in the database
   * __GET__ api/v1/posts
      * Gets required information requested by the frontend via JSON
   * __GET__ api/v1/posts/search?state={}&state={}
      * Returns a search query, usually filtered using State
   * __GET__ api/v1/plans
      * Gets the user's travel plan
   * __POST__ api/v1/plans
      * Posts the user's potential future travel plan
   



## Database schema
### __POST__ submitting travel information
| __Data__ | __Data type__ |
|------|------|
| user_id | String |
| state | String |
| city | String |
| date_visited | Date |
| hotel_stayed | String |
| place_visited | Array |
| restaurants_visited | Array |

### __POST__ submitting travel plan
| __Data__ | __Data type__ |
|------|------|
| user_id | String |
| state | String |
| city | String |
| hotel| String |
| place_to_visit | Array |
| restaurants_to_visit | Array |
| visit_priority | Array |

## Link to our main document
https://docs.google.com/document/d/1UzABK_UNkesL1jw0-JaoVgiDWVxtfrEjfG-Znp3GAaY/edit?usp=sharing
