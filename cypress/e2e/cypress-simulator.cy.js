describe('Cypress Simulator', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('./src/index.html?skipCaptcha=true', {
      onBeforeLoad(win) {
        win.localStorage.setItem('cookieConsent', 'accepted') //acepting cookies before login
      }
    })
    //cy.contains('button', 'Login').click() //cy.get("button").contains("Login").click()
  })
  it('shows an error when entering and running a valid Cypress command without parentheses cy.visit', () => {
    cy.run('cy.visit')

    cy.get('[id="outputArea"]', { timeout: 6000 })
      .should('contain', 'Error:')
      .and('contain', 'Missing parentheses on `cy.visit` command')
      .and('be.visible')
  })
  it('checks the run button disabled and enabled states', () => {
    cy.get('[id="runButton"]').should('be.disabled')

    cy.get('textarea[id="codeInput"]').type('help')
    cy.get('[id="runButton"]').should('be.enabled')

    cy.get('textarea[id="codeInput"]').clear()
    cy.get('[id="runButton"]').should('be.disabled')
  })
  it('clears the code input when logging off then logging in again', () => {
    cy.get('textarea[id="codeInput"]').type('help')

    cy.get('[id="sandwich-menu"]').click()
    cy.contains('button', 'Logout').click()
    cy.contains('button', 'Login').click()

    cy.get('textarea[id="codeInput"]').should('have.not.value')
    // .should('have.value', '') // .should('be.empty')
  })
  it('disables the run button when logging off then logging in again', () => {
    cy.get('textarea[id="codeInput"]').type('help')

    cy.get('[id="sandwich-menu"]').click()
    cy.contains('button', 'Logout').click()
    cy.contains('button', 'Login').click()

    cy.get('[id="runButton"]').should('be.disabled')
  })
  it('clears the code output when logging off then logging in again', () => {
    cy.run('help')

    cy.get('[id="outputArea"]', { timeout: 6000 })
      .should('contain', 'Common Cypress commands and examples:')
      .and('be.visible')

    cy.get('[id="sandwich-menu"]').click()
    cy.contains('button', 'Logout').click()
    cy.contains('button', 'Login').click()

    cy.get('[id="outputArea"]').should('be.empty')
    //.should('not.contain', 'Common Cypress commands and examples:')
  })
  it('does not show the cookie consent banner on the login page', () => {
    cy.clearAllLocalStorage() //clearing the localStorage before the test

    cy.reload() //reloading the page to make sure the localStorage is cleared
    cy.contains('button', 'Login').should('be.visible')
    cy.get('[id="cookieConsent"]').should('not.be.visible')
  })
})

describe('Cypress Simulator - Cookies consent', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('./src/index.html?skipCaptcha=true')
    //cy.contains('button', 'Login').click()
  })
  it('consents on the cookies usage', () => {
    cy.get('[id="cookieConsent"]').find('button[id="acceptCookies"]').click()

    cy.get('[id="cookieConsent"]').should('not.be.visible')
    cy.window().its('localStorage.cookieConsent').should('eq', 'accepted')
    //at the localStorage in the window we can make sure that the cookieConsent is accepted
  })
})
