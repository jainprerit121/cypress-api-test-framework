
Cypress.Commands.add("post", (url, username, password, body) => {
    cy.request({
        method: "POST",
        headers: {
         'Authorization': `basic ${btoa(`${username}:${password}`)}`
         },
        url: url,
        body: body
   }).then((response) => {
    expect(response).to.have.property('status', 201);
})
})

Cypress.Commands.add("get", (url) => {
    cy.request({
        method: "GET",
        url: url
   }).then((response) => {
    expect(response).to.have.property('status', 200);
})
})

Cypress.Commands.add("delete", (url, username, password, body) => {
    cy.request({
        method: "DELETE",
        headers: {
         'Authorization': `basic ${btoa(`${username}:${password}`)}`
         },
        url: url,
        body: body
   }).then((response) => {
        expect(response).to.have.property('status', 204);
   })
})