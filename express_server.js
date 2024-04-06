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

// Add an endpoint to handle a POST to /login
app.post("/login", (req, res) => {
  // Set a user_ID cookie that contains the new user ID
  // res.cookie('user_ID', randomUserID);

  // Redirect the browser to the "/urls" page
  res.redirect("/urls");
});

// Helper function to find a user from email
const findUser = function(email) {
  for (let user in users) {
    // If the email matches a user email in the users object then return the users object
    if (users[user].email === email) return users[user];
  }

  // If the email does not match then return null
  return null;

};

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
    userID: req.cookies.user_ID,
    urls: urlDatabase };

    // console.log(req.cookies.user_ID);

  // Render the index page
  res.render("urls_index", templateVars);
});

// Add a new route handler to render the "urls_new" ejs template
app.get("/urls/new", (req, res) => {
  // Pass in the user object to the urls_new EJS template
  const templateVars = { users, userID: req.cookies.user_ID };

  // Render the new page
  res.render("urls_new", templateVars);
});

// Add a new route handler for the "/urls/:id" path and pass the url data to the urls_show template
app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    // Pass in the users object to the urls_show EJS template
    users,
    userID: req.cookies.user_ID
   };

  // Render the show page
  res.render("urls_show", templateVars);
});

// Route handler for short URL requests. Redirects to appropriate long URL
app.get("/u/:id", (req, res) => {

  // Assign the longURL the value of the urlDatabase object value associated with the given ID
  const longURL = urlDatabase[req.params.id];

  // Redirect to the long URL using the short URL
  res.redirect(longURL);
});

// Create a GET /register endpoint, which returns the register template
app.get("/register", (req, res) => {
  // render the Register page
  res.render("register")
})

// Add POST route handler to receive the form submission
app.post("/urls", (req, res) => {
  // Save the user entered URL to the URL database object with the radomly generated ID as the key
  let id = generateRandomString();
  urlDatabase[id] = req.body.longURL;

  // Redirect to "/urls/:id" path so the user can see the newly added URL
  res.redirect(`/urls/${id}`);
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
  res.clearCookie('user_ID')

  // Redirect the browser to the "/urls" page
  res.redirect("/urls");
});

// Create the POST endpoint that handles the registration form data
app.post("/register", (req, res) => {
  // Generate a random user ID
  const randomUserID = generateRandomString();

  // Define a nested empty object that is assigned the random user ID
  users[randomUserID] = {};

  // Add a new user to the global users object
  users[randomUserID].id = randomUserID
  users[randomUserID].email = req.body.email;
  users[randomUserID].password =  req.body.password;

  // console.log(users[randomUserID].email);

  // If the email is an empty strings then send back response with 400 status code
  if (req.body.email.length === 0) {
    res.status(400).send("Invalid email: The email must be at least 1 character.")
    return;
  }

  // If the password is an empty strings then send back response with 400 status code
  if (req.body.password.length === 0) {
    res.status(400).send("Invalid password: The password must be at least 1 character.")
    return;
  }

  console.log("test");
  // console.log(findUser(req.body.email));

  // If an account for the same user already exists then send back response with 400 status code
  if (findUser(req.body.email)) {
    res.status(400).send("User Login Taken: Try and different ID.")
    return;
  }

  // Set a user_ID cookie that contains the new user ID
  res.cookie('user_ID', randomUserID);

  // Redirect the user to the /urls page
  res.redirect("/urls");

});

// console.log(users);

// Initialize server to listen on PORT for incoming HTTP requests
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});