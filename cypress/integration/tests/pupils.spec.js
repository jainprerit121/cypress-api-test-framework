const username = Cypress.env('username');
const password = Cypress.env('password');

let pupilIdExpected;

before(function() {
    cy.fixture('pupil_request').then( function(requestJson){
        this.requestJson = requestJson;
    })

    cy.log('Create sample pupil record created');
    cy.post('/pupils', username,password, this.requestJson).then((response) => { 
        pupilIdExpected = response.body.pupilId;
    })
})

describe('Testing API Endpoints Using Cypress', function() {

    it('Test GET All pupils Request', function() {
          cy.get('/pupils')
               .then((response) => {
                      expect(response).to.have.property('status', 200);
                      expect(response.body[0])
                      .to.have.all.keys('pupilId', 'firstName', 'infix', 'lastName', 'classId', 'gradeId', 'email', 'isDisabled')
          })
    })

    it('Test POST pupil Request', function() {
        cy.post('/pupils', username, password, this.requestJson)
            .then((response) => { 
                  expect(response.body).has.property('firstName',this.requestJson.firstName); 
                  expect(response.body).has.property('lastName',this.requestJson.lastName); 
                  expect(response.body).has.property('gradeId',this.requestJson.gradeId); 
          })
    })

    it('Test GET Request for specfic pupil ID', function() {
        cy.get(`/pupils/${pupilIdExpected}`)
            .then((response) => {
                expect(response.body.pupilId).to.equal(pupilIdExpected);
            })
    })

    it('Test DELETE pupil Request', function() {
        cy.log('Delete sample pupil record');
        cy.delete(`/pupils/${pupilIdExpected}`, username, password)
            .then(() => {
                cy.log('Verify records got deleted');
                cy.get('/pupils')
                    .then((response) => {
                        expect(response.body).to.not.include(pupilIdExpected);
                    })	
            })
    })
 
})