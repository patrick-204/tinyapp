// Import the express library
const express = require('express');
// Import the cookie-parser library
const cookieParser = require('cookie-parser');

// Define the app as an instance of express
const app = express();

// Define default port for server to listen on
const PORT = 8080;

// Use the Express 'urlencoded' middleware to parse incoming POST requests containing urlencoded data in their body
// so that it is accessible by the server in req.body in the form of a string
app.use(express.urlencoded({ extended: true }));
// Tell Express to use the cookie-parser middleware
app.use(cookieParser());

// Set ejs as the view engine
app.set("view engine", "ejs");

// URL database
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Function the generates a random 6 alphanumeric string
const generateRandomString = function() {
  const randomString = Math.random().toString(36).substring(2, 8);
  return randomString;
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

// Helper function to find a user from email
const findUser = function(email) {
  for (let user in users) {
    // If the email matches a user email in the users object then return the user object
    if (users[user].email === email) return users[user];
  }

  // If the email does not match then return null
  return null;

};

// Add an endpoint to handle a GET for /login
app.get("/login", (req, res) => {
  // Request the user ID from the cookie and define new constant
  const userID = req.cookies.user_id;

  // If the user is already logged in then redirect to /urls page
  if (userID) {
    res.redirect("/urls");
  } else {
    res.render("login"); // Render the login page
  }

  // // If there is no cookie for the user ID then return error message
  // if (!userID) {
  //   return res.status(401).send("No user ID found: Login to see this page.");
  // }
  
})

// Add an endpoint to handle a POST to /login
app.post("/login", (req, res) => {
  // console.log(req.body.email);

  // Define a found user variable that stores the result of the findUser function
  const foundUser = findUser(req.body.email);

  // Define the username and password by accessing req.body
  const username = req.body.username;
  const password = req.body.password;

  // Generate a random user ID
  const randomUserID = foundUser.id;

  // If a user with the login email cannot be found, then return response with status 403
  if (!foundUser) {
    res.status(403).send("Email not found: Please register");
  }

  // If a user that matches the email is found, then verify the password entered by the user
  // matches what is stored
  if (password !== foundUser.password) {
    res.status(403).send("Incorrect Password");
  }

  // Set the user_id cookie to match the user's random ID
  res.cookie('user_id', randomUserID);

  // Redirect the browser to the "/urls" page
  res.redirect("/urls");
});

// Create a GET /register endpoint, which returns the register template
app.get("/register", (req, res) => {
  // Request the user ID from the cookie and define new constant
  const userID = req.cookies.user_id;

  // Redirect to the /urls page if the user is already logged in
  if (userID) {
    res.redirect("/urls");
  } else {
    res.render("register") // Render the register page if not logged in
  }
});

// Create the POST endpoint that handles the registration form data
app.post("/register", (req, res) => {
  // Generate a random user ID
  const randomUserID = generateRandomString();

  // Define email and password variables
  const email = req.body.email;
  const password = req.body.password;

  // If the email is an empty strings then send back response with 400 status code
  if (email.length === 0)  {
    res.status(400).send("Invalid email: The email must be at least 1 character.")
    return;
  }

  // If the password is an empty strings then send back response with 400 status code
  if (password.length === 0) {
    res.status(400).send("Invalid password: The password must be at least 1 character.")
    return;
  }

  // If an account for the same user already exists then send back response with 400 status code
  if (findUser(email)) {
    res.status(400).send("User Login Taken: Try and different ID.")
    return;
  }

    // Define a nested empty object that is assigned the random user ID
    users[randomUserID] = {};

    // Add a new user to the global users object
    users[randomUserID].id = randomUserID;
    users[randomUserID].email = req.body.email;
    users[randomUserID].password =  req.body.password;

  // Set a user_ID cookie that contains the new user ID
  res.cookie('user_id', randomUserID);

  // Redirect the user to the /login page
  res.redirect("/login");

});

// Calls the callback function that has response "Hello" when GET request is made to 
// root path of the server
app.get("/", (req, res) => {
  res.send("Hello!");
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
  const templateVars = { 
    // Pass in the users object and urls to the urls_index EJS template
    users,
    user_id: req.cookies.user_id,
    urls: urlDatabase };


  // Render the index page
  res.render("urls_index", templateVars);
});

// Add a new route handler to render the "urls_new" ejs template
app.get("/urls/new", (req, res) => {
  // Request the user ID from the cookie and define new constant
  const userID = req.cookies.user_id;

  // Redirect to the /login page if the user is not logged in
  if (!userID) {
    res.redirect("/login");
  } else {
    // Pass in the user object to the urls_new EJS template
    const templateVars = { users, user_id: req.cookies.user_id };

    // Render the new page
    res.render("urls_new", templateVars);
  }

});

// Add a new route handler for the "/urls/:id" path and pass the url data to the urls_show template
app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    // Pass in the users object to the urls_show EJS template
    users,
    user_id: req.cookies.user_id
   };

  // Render the show page
  res.render("urls_show", templateVars);
});

// Route handler for short URL requests. Redirects to appropriate long URL
app.get("/u/:id", (req, res) => {
  // Define the short URL ID as new constant
  const id = req.params.id;

  for (let key in urlDatabase) {
    // Send HTML message to user explaining the shortended URL does not exist
    if (id === key) {
      // Assign the longURL the value of the urlDatabase object value associated with the given ID
      const longURL = urlDatabase[req.params.id];

      // Redirect to the long URL using the short URL
      res.redirect(longURL);
    } 
  }

  res.status(403).send("The shortened URL does not exist.");

});

// Add POST route handler to receive the form submission
app.post("/urls", (req, res) => {
  // Request the user ID from the cookie and define new constant
  const userID = req.cookies.user_id;

  // Send HTML message to user explaining why they can't shorten urls if the user is not logged in
  if (!userID) {
    res.status(403).send("Must be logged in to shorten URLs.");
  } else {
    // Save the user entered URL to the URL database object with the radomly generated ID as the key
    let id = generateRandomString();
    urlDatabase[id] = req.body.longURL;

    // Redirect to "/urls/:id" path so the user can see the newly added URL
    res.redirect(`/urls/${id}`);
  }

});

// Add a POST route that removes a URL resource: POST /urls/:id/delete
// Use Javascript's delete operator to remove the URL.
// After the resource has been deleted, redirect the client back to the urls_index page
app.post("/urls/:id/delete", (req, res) => {
  // Get the ID from the request
  const id = req.params.id;

  // Delete the URL
  delete urlDatabase[id];

  // Redirect the client back to the url_index page
  res.redirect("/urls");
})

// Add a POST route that updates a URL resource; POST /urls/:id and have it update the 
// value of your stored long URL based on the new value in req.body. Finally, redirect 
// the client back to /urls
app.post("/urls/:id", (req, res) => {
  // Define the new long URL as the long URL received in the req.body object
  const id = req.body.longURL;

  // Replace the old long URL with the new long URL
  urlDatabase[req.params.id] = id

  // Redirect the client back to the url_index page
  res.redirect("/urls");
});

// Add an endpoint to handle a POST to /logout
app.post("/logout", (req, res) => {
  // Clear the username cookie by implementing the clearCookie method
  res.clearCookie('user_id');

  // Redirect the browser to the "/login" page
  res.redirect("/login");
});

// console.log(users);

// Initialize server to listen on PORT for incoming HTTP requests
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});