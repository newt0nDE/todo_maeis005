const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Setzen Sie dies auf die URL Ihrer Anwendung
    supportFile: false, // Falls Sie keine spezielle support/index.js Datei verwenden möchten
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}' // Passen Sie dies an Ihre Struktur an
  },
});