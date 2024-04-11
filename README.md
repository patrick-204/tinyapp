# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["TinyApp - URLs Page"](images/TinyApp%20-%20URLs%20Page.png)
!["TinyApp - Register Page"](images/TinyApp%20-%20Register%20Page.png)
!["TinyApp - Login Page"](images/TinyApp%20-%20Login%20Page.png)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Register using the /register page
- Login using the /login page
- Select My URLs in the Naviagtion to access the user's URLs
- Select Create New URL to access the page for creating a new URL. Once on the page, enter a new URL and select the submit button to create new URL. The user will then be redirected to the URLs page

## File Explanation

express_server.js
- This file is the main server file for the TinyApp project. It sets up the Express server, defines routes, handles user authentication and manages URL shortening functionality. The following is a breakdown of the file:

- Dependencies: Imports required libraries and helper functions.
- Server Setup: Initializes an Express app, sets up middleware for parsing requests, and configures sessions using cookie-session.
- Routes:
    - GET /login: Renders the login page or redirects to the /urls page if the user is already logged in.
    - POST /login: Handles user login authentication and sets user session.
    - GET /register: Renders the register page or redirects to the /urls page if the user is already logged in.
    - POST /register: Handles user registration and redirects to the login page.
    - GET /urls: Renders the URLs page with a list of shortened URLs for the logged-in user.
    - GET /urls/new: Renders the page for creating a new shortened URL.
    - GET /urls/:id: Renders the page to view a specific shortened URL's details.
    - GET /u/:id: Redirects short URLs to their original long URLs.
    - POST /urls: Handles the creation of a new shortened URL.
    - POST /urls/:id/delete: Handles deletion of a shortened URL.
    - POST /urls/:id: Handles updating the long URL of a shortened URL.
    - POST /logout: Logs out the user by clearing the session and redirects to the login page.
    - Server Initialization: Sets the server to listen on a specified port.

This file is the main file of the TinyApp server, managing user authentication, URL shortening, and routing for the API.

helpers.js
- This file is the contains all helper functions.

helperTest.js
- This file contains test assertions for the helper functions.

routesTest.js
- This file contains test assertions for the routes.