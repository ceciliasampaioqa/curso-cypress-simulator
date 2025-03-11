describe('Cypress Simulator - A11y Checks', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('./src/index.html?skipCaptcha=true', {
      onBeforeLoad(win) {
        //onBeforeLoad is a hook that that allows you to execute code before the page loads
        //The win parameter represents the window object of the page being visited
        //ex: acepting cookies before login
        win.localStorage.setItem('cookieConsent', 'accepted')
      }
    })
    cy.injectAxe() //injecting axe-core library, which is a tool for automated accessibility testing
  })
  Cypress._.times(100, () => {
    //
    it('successfully simulates a Cypress command cy.log Yay! on Cypress Output area', () => {
      cy.run("cy.log('Yay!')")

      cy.get('[id="outputArea"]', { timeout: 6000 })
        .should('contain', 'Success:')
        .and('contain', "cy.log('Yay!') // Logged message 'Yay!'")
        .and('be.visible')

      cy.checkA11y('.success') //check the a11y issues on the success message only
    })
  })
  it('shows an error when entering and running an invalid Cypress command cy.run', () => {
    cy.run('cy.run')

    cy.get('[id="outputArea"]', { timeout: 6000 })
      .should('contain', 'Error:')
      .and('contain', 'Invalid Cypress command: cy.run')
      .and('be.visible')

    cy.checkA11y('.error')
  })
  it("shows a warning when entering and running a not-implemented Cypress command cy.contains ('Login')", () => {
    cy.run("cy.contains('Login')")

    cy.get('[id="outputArea"]', { timeout: 6000 })
      .should('contain', 'Warning:')
      .and('contain', 'The `cy.contains` command has not been implemented yet.')
      .and('be.visible')

    cy.checkA11y('.warning')
  })
  it('asks for help and gets common Cypress commands and examples with a link to the docs', () => {
    cy.run('help')

    cy.get('[id="outputArea"]', { timeout: 6000 })
      .should('contain', 'Common Cypress commands and examples:')
      .and('contain', 'For more commands and details, visit the official Cypress API documentation.')
      .and('be.visible')
    cy.contains("[id='outputArea'] a", 'official Cypress API documentation')
      .should('have.attr', 'href', 'https://docs.cypress.io/api/table-of-contents')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer')
      .and('be.visible')

    cy.checkA11y("[id='outputArea']") // or cy.checkA11y('#outputArea')
    //check the a11y issues on the output area only, with the class output
  })
  it('maximizes and minimizes a simulation result', () => {
    cy.run('help')

    cy.get('[id="expandIcon"]').click()

    cy.get('[id="outputArea"]', { timeout: 6000 })
      .should('contain', 'Common Cypress commands and examples:')
      .and('contain', 'For more commands and details, visit the official Cypress API documentation.')
      .and('be.visible')

    cy.checkA11y()

    cy.get('[id="collapseIcon"]').should('be.visible').click() // hashtag represent the id: #collapseIcon and dot represent the class: .collapseIcon

    cy.get('[id="expandIcon"]').should('be.visible')
  })
  it('logs out successfully', () => {
    cy.get('[id="sandwich-menu"]').click()
    cy.contains('button', 'Logout').click() //cy.get('[id="logoutButton"]').click()

    cy.contains('button', 'Login').should('be.visible')
    cy.get('[id="sandwich-menu"]').should('not.be.visible')
    // in some aplications you can use should not.exist

    cy.checkA11y()
  })
  it('shows and hides the logout button', () => {
    cy.get('[id="sandwich-menu"]').click()

    cy.contains('button', 'Logout').should('be.visible')

    cy.checkA11y()

    cy.get('[id="sandwich-menu"]').click()

    cy.contains('button', 'Logout').should('not.be.visible')
  })
  it('shows the running state before showing the final result', () => {
    cy.run('help')

    cy.contains('button', 'Running...').should('be.visible')
    cy.get('[id="outputArea"]').should('contain', 'Running... Please wait.').and('be.visible')

    cy.checkA11y()

    cy.contains('button', 'Running...', { timeout: 6000 }).should('not.exist')
    cy.contains('button', 'Run').should('be.visible')

    cy.contains('[id="outputArea"]', 'Running... Please wait.', { timeout: 6000 }).should('not.exist')
    cy.get('[id="outputArea"]')
      .should('contain', 'Common Cypress commands and examples:')
      .and('contain', 'For more commands and details, visit the official Cypress API documentation.')
      .and('be.visible')
  })
})

describe('Cypress Simulator - Cookies consent', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('./src/index.html?skipCaptcha=true')
    cy.injectAxe()
  })
  it('declines on the cookies usage', () => {
    cy.get('[id="cookieConsent"]').should('be.visible')

    cy.checkA11y()

    cy.get('[id="cookieConsent"]').find('button[id="declineCookies"]').click()

    cy.get('[id="cookieConsent"]').should('not.be.visible')
    cy.window().its('localStorage.cookieConsent').should('eq', 'declined')
    //at the localStorage in the window we can make sure that the cookieConsent is declined
  })
})

describe('Cypress Simulator - Captcha', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
    cy.contains('button', 'Login').click()
    cy.injectAxe()
  })
  it('finds no a11y issues on all captcha view states (button enabled/disabled and error)', () => {
    cy.get('[id="verifyCaptcha"]').should('be.disabled')
    //disabled button does not need to check the a11y issues
    //because UI components that are not available for user interaction
    //are not necessary to meet contrast requirements

    cy.get('[placeholder="Enter your answer"]').type('123') //type the wrong answer
    cy.get('[id="verifyCaptcha"]').should('be.enabled')

    cy.checkA11y()

    cy.get('[id="verifyCaptcha"]').click()

    cy.contains('[id="captchaError"]', 'Incorrect answer, please try again.').should('be.visible')

    cy.get('[placeholder="Enter your answer"]').should('have.value', '')
    cy.get('[id="verifyCaptcha"]').should('be.disabled') //cy.contains('button', 'Verify')

    cy.checkA11y()
  })
})
