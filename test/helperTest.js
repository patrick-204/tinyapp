const { assert } = require('chai');

const { findUser } = require('../helpers.js');

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

describe('findUser', function() {
  // Test that checks if email exists in user database
  it('should return a user with valid email', function() {
    const user = findUser("user@example.com", testUsers)
    const expectedUserID = "userRandomID";

    // Check if the user ID is equal to the expected user ID
    assert.equal(user.id, expectedUserID);
  });

  // Test that checks if undefined is returned when an email that doesn't exist is entered
  it('should return undefined if email does not exist', function() {
    const notUser = "kdfjhdkfjghe@example.com";
    const user = findUser("user@example.com", notUser);
    const expected = undefined;

    // Check if the user ID is equal to the expected user ID
    assert.equal(user, expected);
  });

});