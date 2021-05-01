
Make sure you have the following Installed:

    1. Install nodejs 
    2. Install npm
    3. `npm install`
    4. `npm start`

The API will be up and running.

    You can view localhost:3000/pupils to get a list of all pupils or go to localhost:3000/pupils/{pupilId} to get only specific pupil

    You can also do POST to /pupils and DELETE to /pupils/{pupilId}, which requires Basic Authentication header to be present in the request  

    `username: testCandidate`  
    `password: P@ssw0rd`

## Framework Details:
    1. Refer support/commands.js file for all the common reusable commands which can be used for any kind of API Request.
    2. Reading test data(request json for post request) from fixtures
    3. Reading username, password from environment variables. Here we are using it from cypress.env.json file.

## Sample Command for get request:

    Cypress.Commands.add("get", (url) => {
    cy.request({
        method: "GET",
        url: url
    }).then((response) => {
        expect(response).to.have.property('status', 200);
    })
    })


This command can be used to make a GET request by directly calling it on cy object like cy.get('/pupils'). This will take care of the initial assertions needed like here it expects it to be 200.

We can add some other methods to which we can take input expected result and those can be used for negative/positive test cases as and when applicable.

## Before hooks:
    This can be done as per need. But here in the test I am using it to read the test data from fixtures and to create sample test data which can be used for other tests