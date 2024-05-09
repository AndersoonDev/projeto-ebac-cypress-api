module.exports = {
  projectId: 'f5kcw6',
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1440,
    viewportHeight: 900,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'mochawesome-report',
      overwrite: false,
      html: true,
      json: false
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
