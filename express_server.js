// Import the express library
const express = require('express');

// Import the cookie-session package
const cookieSession = require('cookie-session');

// Import the helper functions
const { findUser, generateRandomString, urlsForUser } = require('./helpers');

// Define the app as an instance of express
const app = express();

// Define default port for server to listen on
const PORT = 8080;

// Import the bcryptjs package
const bcrypt = require('bcryptjs');

// Use the Express 'urlencoded' middleware to parse incoming POST requests containing urlencoded data in their body
// so that it is accessible by the server in req.body in the form of a string
app.use(express.urlencoded({ extended: true }));

// Add middleware to decode JSON information
app.use(express.json());

// Tell Express to use the cookie-session middleware
app.use(cookieSession({
  name: 'session',
  keys: ['secret'],
}));

// Set ejs as the view engine
app.set("view engine", "ejs");

// URL database
const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  }
};

// Create global object to store and access the users in the app
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  }
};

// Add an endpoint to handle a GET for /login
app.get("/login", (req, res) => {
  // Request the user ID from the encrypted cookie and define new constant
  const userID = req.session.user_id;

  // If the user is already logged in then redirect to /urls page
  if (userID) {
    res.redirect("/urls");
  } else {
    res.render("login", { user_id: userID }); // Render the login page
  }
  
});

// Add an endpoint to handle a POST to /login
app.post("/login", (req, res) => {
  // Define a found user variable that stores the result of the findUser function
  const foundUser = findUser(req.body.email, users);

  // Define the username and password by accessing req.body
  const password = req.body.password;

  // If a user with the login email cannot be found, then return response with status 403
  if (!foundUser) {
    return res.status(403).send("Email not found: Please register");
  }

  // If a user that matches the email is found, then verify the password entered by the user
  // matches what is stored
  if (!bcrypt.compareSync(password, foundUser.password)) {
    return res.status(403).send("Incorrect Password");
  }

  // Generate a random user ID
  const randomUserID = foundUser.id;

  // Set the user_id cookie to match the user's random ID
  // res.cookie('user_id', randomUserID);

  // Set an encrypted cookie inside the session object to the value of the random user ID
  req.session.user_id = randomUserID;

  // Redirect the browser to the "/urls" page
  res.redirect("/urls");
});

// Create a GET /register endpoint, which returns the register template
app.get("/register", (req, res) => {
  // Request the user ID from the encrypted cookie and define new constant
  const userID = req.session.user_id;

  // Redirect to the /urls page if the user is already logged in
  if (userID) {
    res.redirect("/urls");
  } else {
    res.render("register", { user_id: userID }); // Render the register page if not logged in
  }
});

// Create the POST endpoint that handles the registration form data
app.post("/register", (req, res) => {
  // Generate a random user ID
  const randomUserID = generateRandomString();

  // Define email and password constants
  const email = req.body.email;
  const password = req.body.password;

  // If the email is an empty strings then send back response with 400 status code
  if (email.length === 0)  {
    return res.status(400).send("Invalid email: The email must be at least 1 character.");
  }

  // If the password is an empty strings then send back response with 400 status code
  if (password.length === 0) {
    return res.status(400).send("Invalid password: The password must be at least 1 character.");
  }

  // Define the hashed password constant
  const hashedPassword = bcrypt.hashSync(password, 10);

  // If an account for the same user already exists then send back response with 400 status code
  if (findUser(email, urlDatabase)) {
    return res.status(400).send("User Login Taken: Try and different ID.");
  }

  // Define a nested empty object that is assigned the random user ID
  users[randomUserID] = {};

  // Add a new user to the global users object
  users[randomUserID].id = randomUserID;
  users[randomUserID].email = req.body.email;
  users[randomUserID].password =  hashedPassword;

  // Redirect the user to the /login page
  res.redirect("/login");

  // Set a user_ID cookie that contains the new user ID
  // res.cookie('user_id', randomUserID);

  // Set an encrypted cookie inside the session object to the value of the random user ID
  req.session.user_id = randomUserID;

});

// Redirects user to /login page if GET request is made to root path of the server
app.get("/", (req, res) => {
  // Define user ID 
  const userID = req.session.user_id;

  // Check if the user is logged in
  if (!userID) {
    // Redirect to the login page
    res.redirect("/login");
  } 
});

// Calls the callback function that has sends a JSON response to the client when
// a GET request is sent to the /urls.json path of the server
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Call the callback function that sends HTML code to client browser (not actaully, but could)
// when a GET request is sent to the /Hello path of the server
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Add a new route handler for the "/urls" path and pass the url data to the urls_index template
app.get("/urls", (req, res) => {
  // Request the user ID from the encrypted cookie and define new constant
  const userID = req.session.user_id;

  // If the iser is not logged in then they cannot see any shortened URLs
  if (!userID) {
    return res.status(403).send("Must be logged in to view ID associated URLs.");
  } else {
    // Call the urlsForUser(id) helper function which returns the URLs 
    // where the userID is equal to the id of the logged in user
    let userURL = urlsForUser(userID, urlDatabase);

    const templateVars = { 
      // Pass in the users object and urls to the urls_index EJS template
      users,
      user_id: req.session.user_id,
      urls: userURL
    };


    // Render the index page
    res.render("urls_index", templateVars);
  }

});

// Add a new route handler to render the "urls_new" ejs template
app.get("/urls/new", (req, res) => {
  // Request the user ID from the encrypted cookie and define new constant
  const userID = req.session.user_id;

  // Redirect to the /login page if the user is not logged in
  if (!userID) {
    res.redirect("/login");
  } else {
    // Pass in the user object to the urls_new EJS template
    const templateVars = { users, user_id: req.session.user_id };

    // Render the new page
    res.render("urls_new", templateVars);
  }

});

// Add a new route handler for the "/urls/:id" path and pass the url data to the urls_show template
app.get("/urls/:id", (req, res) => {
  // Request the user ID from the encrypted cookie and define new constant
  const userID = req.session.user_id;

  // Send HTML message to user explaining they can't see the individual URL page because they are not logged in
  if (!userID) {
    return res.status(403).send("Must be logged in to view the URL.");
  } 

  // Check if the requested URL exists in the database
  if (!urlDatabase[req.params.id]) {
    return res.status(404).send("The URL does not exist in the database.");
  }
  
  // Check to see if URL belongs to user. If it does then render the ursl_show template with the new data
  for (let key in urlsForUser(userID)) {
    if (key === req.params.id) {
      const templateVars = { 
        id: req.params.id, 
        longURL: urlDatabase[req.params.id].longURL,
        // Pass in the users object to the urls_show EJS template
        users,
        user_id: req.session.user_id
      };
    
      // Render the show page
      res.render("urls_show", templateVars);
    } 
  }

  // Send HTML message to user explaining they can't see the individual URL page if it doesn't belong to them
  return res.status(403).send("You do not have access to this URL.");
});

// Route handler for short URL requests. Redirects to appropriate long URL
app.get("/u/:id", (req, res) => {
  // Define the short URL ID as new constant
  const id = req.params.id;

  for (let key in urlDatabase) {
    // Send HTML message to user explaining the shortended URL does not exist
    if (id === key) {
      // Assign the longURL the value of the urlDatabase object value associated with the given ID
      const longURL = urlDatabase[req.params.id].longURL;

      // Redirect to the long URL using the short URL
      res.redirect(longURL);
    } 
  }

  return res.status(403).send("The shortened URL does not exist.");

});

// Add POST route handler to receive the form submission for making a new short URL
app.post("/urls", (req, res) => {
  // Request the user ID from the encrypted cookie and define new constant
  const userID = req.session.user_id;

  // Send HTML message to user explaining why they can't shorten urls if the user is not logged in
  if (!userID) {
    return res.status(403).send("Must be logged in to shorten URLs.");
  } else {
    // Save the user entered URL to the URL database object with the radomly generated ID as the key
    let id = generateRandomString();

    // Create empty object for the ID in case does not exist
    if (!urlDatabase[id]) {
      urlDatabase[id] = {};
    }

    // Set the longURL of the object for the id
    urlDatabase[id].longURL = req.body.longURL;

    // Redirect to "/urls/:id" path so the user can see the newly added URL
    res.redirect(`/urls/${id}`);
  }

});

// Add a POST route that removes a URL resource: POST /urls/:id/delete
// Use Javascript's delete operator to remove the URL.
// After the resource has been deleted, redirect the client back to the urls_index page
app.post("/urls/:id/delete", (req, res) => {
  // Request the user ID from the encrypted cookie and define new constant
  const userID = req.session.user_id;

  // Return an error message if the id does not exist
  if (!urlDatabase[req.params.id]) {
    return res.status(400).send("The ID in the path does not exist. Please enter a valid ID.");
  }

  // Send HTML message to user explaining they are not logged in so they cannot edit or delete
  if (!userID) {
    return res.status(403).send("Must be logged in to delete URLs.");
  }

  // Send HTML message to user explaining they do not own the URL if they do not
  if (urlDatabase[req.params.id].userID !== userID) {
    return res.status(403).send("This URL does not belong to you so you cannot delete it.");
  }
  // Get the ID from the request
  const id = req.params.id;

  // Delete the URL
  delete urlDatabase[id].longURL;

  // Redirect the client back to the url_index page
  res.redirect("/urls");
});

// Add a POST route that updates a URL resource; POST /urls/:id and have it update the 
// value of your stored long URL based on the new value in req.body. Finally, redirect 
// the client back to /urls
app.post("/urls/:id", (req, res) => {
  // Request the user ID from the encrypted cookie and define new constant
  const userID = req.session.user_id;

  // Return an error message if the id does not exist
  if (!urlDatabase[req.params.id]) {
    return res.status(400).send("The ID in the path does not exist. Please enter a valid ID.");
  }

  // Send HTML message to user explaining they are not logged in so they cannot edit or delete
  if (!userID) {
    return res.status(403).send("Must be logged in to edit URLs.");
  }

  // Send HTML message to user explaining they do not own the URL if they do not
  if (urlDatabase[req.params.id].userID !== userID) {
    return res.status(403).send("This URL does not belong to you so you cannot edit it.");
  }

  // Define the new long URL as the long URL received in the req.body object
  const id = req.body.longURL;

  // Replace the old long URL with the new long URL
  urlDatabase[req.params.id].longURL = id;

  // Redirect the client back to the url_index page
  res.redirect("/urls");
});

// Add an endpoint to handle a POST to /logout
app.post("/logout", (req, res) => {
  // Log the user out and clear the encrypted cookie from the broswer by setting the req.session object to null
  req.session = null;

  // Redirect the browser to the "/login" page
  res.redirect("/login");
});

// Initialize server to listen on PORT for incoming HTTP requests
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
