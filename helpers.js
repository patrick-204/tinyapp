// Import from express server
const { urlDatabase } = require('./express_server');

// Helper function to find a user from email
const findUser = function(email, userDatabase) {
  for (let user in userDatabase) {
    // If the email matches a user email in the users object then return the user object
    if (userDatabase[user].email === email) return userDatabase[user];
  }

  // If the email does not match then return undefined
  return null;
};

// Helper function that the generates a random 6 alphanumeric string
const generateRandomString = function() {
  const randomString = Math.random().toString(36).substring(2, 8);
  return randomString;
};

// Helper function that returns the URLs where the userID is equal to the id of the logged in user
const urlsForUser = function(id) {
  // Define empty array to store the user specific URL(s) in
  let userURL = {};

  // Filter the urlDatabase by comparing the userID with the logged in user's cookie.
  // Only send ther logged in user URL to template
  for (let key in urlDatabase) {
    if (id === urlDatabase[key].userID) {
      userURL[key] = urlDatabase[key].longURL;
    }
  }

  // Return the array of URL(s)
  return userURL;
};

// Export the findUser function so that can use in express_servr.js
module.exports = { findUser, generateRandomString, urlsForUser };
