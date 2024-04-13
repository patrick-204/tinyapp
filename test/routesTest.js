const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);

// 403 status code should returned if url doesn't belong to user
describe("Login and Access Control Test", () => {
  it('should return 403 status code for unauthorized access to "http://localhost:8080/urls/b2xVn2"', () => {
    const agent = chai.request.agent("http://localhost:8080");

    // Step 1: Login with valid credentials
    return agent
      .post("/login")
      .send({ email: "bill@gmail.com", password: "123" })
      .then((loginRes) => {
        // Step 2: Make a GET request to a protected resource
        return agent.get("/urls/b2xVn2").then((accessRes) => {
          // Step 3: Expect the status code to be 403
          expect(accessRes).to.have.status(403);
        });
      });
  });
});

// A user should be redirected to /login if they are not logged in
describe('GET /', function() {
  it('should redirect to /login with status code 302', function() {
    // Create an agent to make requests
    const agent = chai.request.agent("http://localhost:8080");

    return agent
      .get('/')
      .redirects(0) // Disable automatic redirection
      .then(function(res) {
        // Expect a redirect with status code 302
        expect(res).to.redirect;
        expect(res).to.have.header('location', '/login'); // Check if "Location" header is set to "/login"
        expect(res).to.have.status(302);
      })
  });
});

// A user should be redirected to /login if GET request is made to urls/new
describe('GET /urls/new', function() {
  it('should redirect to /login with status code 302', function() {
    // Create an agent to make requests
    const agent = chai.request.agent("http://localhost:8080");

    return agent
      .get('/urls/new')
      .redirects(0) // Disable automatic redirection
      .then(function(res) {
        // Expect a redirect with status code 302
        expect(res).to.redirect;
        expect(res).to.have.header('location', '/login'); // Check if "Location" header is set to "/login"
        expect(res).to.have.status(302);
      })
  });
});


// A user should receive status code 404 if url request does not exist
describe('GET /urls/NOTEXISTS', function() {
  it('should return status code 404', function() {
    chai.request('http://localhost:8080')
      .get('/urls/NOTEXISTS')
      .end(function(err, res) {
        expect(res).to.have.status(404);
      });
  });
});

// A user should see an error message if they are not logged in
describe('GET /urls/b2xVn2', function() {
  it('should return status code 403', function() {
    // Create an agent to make the request
    const agent = chai.request.agent("http://localhost:8080");

    return agent
      .get('/urls/b2xVn2')
      .then(function(res) {
        // Expect the response to have a status code of 403
        expect(res).to.have.status(403);
      })
      .finally(function() {
        // Close the agent
        agent.close();
      });
  });
});