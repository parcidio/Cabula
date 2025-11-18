import { defineConfig } from "cypress";
// Populate process.env with values from .env file

export default defineConfig({
  projectId: 's5kkzz',
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  env: {
    auth0_email: "emelysaraiva@example.com",
    auth0_password: "emelysaraiva",
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
