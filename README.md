#Interview Tool Management
This code represents an interview tool management system that uses Node.js, Express, and MongoDB. It provides APIs for managing users, interviewers, HR, technologies, and conducting interviews. It uses the Passport library for authentication and authorization using Google OAuth2.0.

Setup
Before running this application, make sure to have the following:

Node.js installed
MongoDB installed and running on port 27017
To run the application, follow these steps:

Clone this repository
Open a terminal and navigate to the project directory
Run npm install to install the required dependencies
Create a .env file in the project root and add the following environment variables:
makefile
Copy code
PORT=3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=mongodb://localhost:27017/interview_tool_db
SESSION_SECRET=your_session_secret
Replace your_google_client_id, your_google_client_secret, and your_session_secret with your own values.
Run npm start to start the server
Open your browser and navigate to http://localhost:3000 to access the application
Architecture
The application is divided into two main parts: the server and the client.

Server
The server is built using Node.js and Express. It uses MongoDB as the database and Passport for authentication and authorization using Google OAuth2.0. The server uses a cluster module to take advantage of multi-core systems.

Client
The client is built using EJS (Embedded JavaScript) templates and Bootstrap. It provides a web-based user interface for managing users, interviewers, HR, technologies, and conducting interviews.

API Documentation
The API documentation is not provided in the code. However, the API endpoints can be found in the following files:

src/router/hrRouter/hrRouter.js
src/router/interviewerRouter/interviewerRouter.js
src/router/userRouter/userRouter.js
src/router/technologyRouter/technologyRouter.js
