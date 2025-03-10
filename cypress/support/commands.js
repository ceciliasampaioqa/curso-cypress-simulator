Cypress.Commands.add('login', () => {
  const setup = () => {
    cy.visit('./src/index.html?skipCaptcha=true')
    cy.contains('button', 'Login').click()
  }

  const validate = () => {
    cy.visit('./src/index.html')
    cy.contains('button', 'Login', { timeout: 1000 }).should('not.be.visible')
  }

  const options = {
    cacheAcrossSpecs: true,
    validate
  }

  cy.session('sessionId', setup, options)
})

Cypress.Commands.add('run', (cmd) => {
  cy.get('textarea[id="codeInput"]').type(cmd)
  cy.contains('button', 'Run').click()
})

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
