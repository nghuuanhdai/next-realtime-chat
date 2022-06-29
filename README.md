<h1 align="center">
    Nextjs Chat
</h1>
<p align="center">
  <img width="200" src="https://user-images.githubusercontent.com/24937352/175799542-67ca2c15-1112-43a6-98a4-0df9db0198c1.png" alt="Online tutor logo">

  <br/>
  <h4 align="center">A Chat app made with nextjs, socket.io, typescript, jwt, mongoose, tailwind css.</h4>
</p>

## Demo
### Live demo: [Nextjs Chat Heroku](https://nnhhaadd-realtime-chat.herokuapp.com/)

### Deploy it yourself
  - **Clone this repo:** `git clone git@github.com:nghuuanhdai/next-realtime-chat.git`
  - **Setup environment variable:** This application uses MongoAtlas and JWT. To deploy the application yourself, make sure to populate all the environment variables in the following table.


| Key | Value |
|---|---|
| MONGODB_URI | MongoDB connection URI |
| JWT_SECRET  | Json web token secret |

  - **Start the server with**  `npm run start` 
       
## Features
### Account authentication/authorization
This application uses JWT for authentication.  
**Password reset hasn't been implemented yet**

### User search
Use the search form to search for a user with their username.  
![image](https://user-images.githubusercontent.com/24937352/175799796-ecfc0fd0-d514-48c1-8d98-18747826c756.png)
### User conversations
Past conversation is available under Conversations section. Click on an username to see the conversation and continue it.  
![image](https://user-images.githubusercontent.com/24937352/175799800-560e0716-a744-438a-b947-645096f0f387.png)
### Chat history
Upon open a conversation past messages will be fetched, allow user to see what they have said before.
### Realtime chat with socket.io
Realtime connection with socket.io, new message will be available immediately on other receipant if they are online

### Responsive design with TailwindCss
| Desktop | Tablet | Mobile |
|---|---|---|
|![image](https://user-images.githubusercontent.com/24937352/175799663-b1f2c2a6-4a24-41ab-a0e9-50f705b37ef3.png)|![image](https://user-images.githubusercontent.com/24937352/175799677-4c0410c9-37db-4079-ba19-9f7338b01ff6.png)|![image](https://user-images.githubusercontent.com/24937352/175799688-e0f345db-69cd-476e-a027-a1a69fd2bbec.png)|
