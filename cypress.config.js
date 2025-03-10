const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportHeight: 1024,
  viewportWidth: 1700,
  e2e: {
    fixturesFolder: false
  }
})
//Com a configuração acima, foi substituida as dimensões de altura e largura padrão do Cypress,
//além de não usarmos a pasta cypress/fixtures/
