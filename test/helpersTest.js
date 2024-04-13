const { assert } = require('chai');

const { findUser, generateRandomString, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

// Tests for the find user function
describe('findUser', function() {
  // Test that checks if email exists in user database
  it('should return a user with valid email', function() {
    const user = findUser("user@example.com", testUsers);
    const expectedUserID = "userRandomID";

    // Check if the user ID is equal to the expected user ID
    assert.equal(user.id, expectedUserID);
  });

  // Test that checks if undefined is returned when an email that doesn't exist is entered
  it('should return null if email does not exist', function() {
    const notUser = "kdfjhdkfjghe@example.com";
    const user = findUser("user@example.com", notUser);
    const expected = null;

    // Check if the user ID is equal to the expected user ID
    assert.equal(user, expected);
  });
});

// Tests for the generate random string function
describe('generateRandomString', function() {
  // Test that checks if returns string of length 6
  it('should return a string of length 6', function() {
    const result = generateRandomString();

    // Check if the length of the string is 6
    assert.lengthOf(result, 6);
  });

  // Test that checks if is a string
  it('should return a string', function() {
    const result = generateRandomString();

    // Check if is string
    assert.isString(result);
  });

  // Test that checks if is aplhanumeric
  it('should return a alphanumeric string', function() {
    const result = generateRandomString();

    // Check if only alphanumeric chars
    assert.match(result, /^[a-zA-Z0-9]+$/);
  });
});

// Tests for the urls for random user function
describe('urlsForUser', function() {
  // Test that checks if a url is returned
  it('should return a url', function() {
    const userID = "userRandomID";

    const urlDatabase = {
      "url1": { userID: "userRandomID", longURL: "https://example.com" },
      "url2": { userID: "anotherUserID", longURL: "https://anotherexample.com" }
    };

    const result = urlsForUser(userID, urlDatabase);

    // Confirm is object
    assert.isObject(result);

    // Confirm is not empty
    assert.isNotEmpty(result);

    // Assert that at least one URL is returned for the given user ID
    assert.isAtLeast(Object.keys(result).length, 1);
  });
});