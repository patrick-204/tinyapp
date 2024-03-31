// Import the express library
const express = require('express');

// Define the app as an instance of express
const app = express();

// Define default port for server to listen on
const PORT = 8080;

// Function the generates a random 6 alphanumeric string
function generateRandomString() {
  const randomString = Math.random().toString(36).substring(2, 8);
  return randomString;
};

// Set ejs as the view engine
app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Use the Express 'urlencoded' middleware to parse incoming POST requests containing urlencoded data in their body
// so that it is accessible by the server in req.body in the form of a string
app.use(express.urlencoded({ extended: true }));

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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Add a new route handler to render the "urls_new" ejs template
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Add a new route handler for the "/urls/:id" path and pass the url data to the urls_show template
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

// Route handler for short URL requests. Redirects to appropriate long URL
app.get("/u/:id", (req, res) => {

  // Assign the longURL the value of the urlDatabase object value associated with the given ID
  const longURL = urlDatabase[req.params.id];

  // Redirect to the long URL using the short URL
  res.redirect(longURL);
});

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

// Initialize server to listen on PORT for incoming HTTP requests
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});