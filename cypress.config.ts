import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents() {
      // implement node event listeners here
    },
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: true
});
