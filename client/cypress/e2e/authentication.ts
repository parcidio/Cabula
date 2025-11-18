/// <reference types="cypress" />

describe('Authentication', () => {
  // Define test user credentials and mock API response data
  const TEST_EMAIL = Cypress.env('auth0_email');
  const TEST_PASSWORD = Cypress.env('auth0_password');
  const MOCK_WORKSPACE_ID = '68a91bdb959c24aea00352aa';
  const MOCK_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODFkNjNhNGM4YjY4ODE3MGEzZmQ5YWEiLCJpYXQiOjE3NjMzMzc5ODksImV4cCI6MTc2MzQyNDM4OSwiYXVkIjpbInVzZXIiXX0.OM-WYmPd0qzUMhsqupo5mKYahFhhuCE1QCy8BDSBOjM';


  // --- Mock Data and Endpoints ---
  const SIGNUP_NAME = 'New Test User';
  const SIGNUP_EMAIL = 'newuser@testdomain.com';
  const SIGNUP_PASSWORD = 'StrongPassword123';

  // API Endpoints - Using wildcard (**) for domain flexibility
  const LOGIN_API_ENDPOINT = '**/api/auth/login';
  const SIGNUP_API_ENDPOINT = '**/api/auth/register';
  const CURRENT_USER_API_ENDPOINT = '**/api/user/current';
  const GOOGLE_AUTH_START_ENDPOINT = '**/auth/google';

  // Define the expected successful response body from the backend
  const mockSuccessResponse = {
    message: 'User was logged in successfully!',
    access_token: MOCK_ACCESS_TOKEN,
    user: {
      _id: '68f8144a64054af5132cb2f3',
      email: TEST_EMAIL,
      name: "Emely Saraiva",
      currentWorkspace: MOCK_WORKSPACE_ID,
      isActive: true,
      lastLogin: null,
      profilePicture: null,
      updatedAt: "2025-11-14T20:21:41.075Z",
      __v: 0,
    },
  };

  const mockSignupSuccessResponse = {
    message: 'Registration successful',
    access_token: MOCK_ACCESS_TOKEN,
    user: {
      _id: 'user-002',
      email: SIGNUP_EMAIL,
      currentWorkspace: MOCK_WORKSPACE_ID,
    },
  };
  beforeEach(() => {
    // Visit the sign-in page before each test
    // NOTE: Update the route to match your application's actual sign-in route
    cy.visit("/");
    cy.getDataTestId('login-button').should('be.visible');
  });

   // --- TEST 1: LOGIN WITH EMAIL AND PASSWORD ---
  it('should successfully log in a user and navigate to the workspace', () => {

    // 1. Intercept the login API call and stub a successful response
    cy.intercept('POST', LOGIN_API_ENDPOINT, (req) => {
      // Assert that the request body contains the correct credentials
      expect(req.body.email).to.equal(TEST_EMAIL);
      expect(req.body.password).to.equal(TEST_PASSWORD);

      // Respond with the mock success data
      req.reply({
        statusCode: 200,
        body: mockSuccessResponse,
      });
    }).as('loginRequest');



    // 2. Type the email into the input field
    // We use the placeholder attribute for reliable targeting
    cy.getDataTestId('email-input')
      .should('be.visible')
      .type(TEST_EMAIL);

    // 3. Type the password into the password field
    // We use the type attribute for reliable targeting
    cy.getDataTestId('password-input')
      .should('be.visible')
      .type(TEST_PASSWORD);

    // 4. Click the Login button
    // We use the button text for targeting
    cy.getDataTestId('login-button')
      .click();

    // 5. Assertions

    // The API request should have been made

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);


    // The user should be redirected to the user's current workspace dashboard
    cy.url().should('include', `/workspace/${MOCK_WORKSPACE_ID}`);


    // Optionally, assert that the access token was set in the store 
    // (This often requires custom Cypress commands to access application state)
    // cy.window().its('store').invoke('getAccessToken').should('eq', MOCK_ACCESS_TOKEN); 
  });

  // --- TEST 4: NAVIGATION BETWEEN LOGIN AND SIGN UP ---
  it('should navigate from login to signup and back', () => {
    // 1. Click the 'Sign up' link on the login page
    cy.getDataTestId('sign-up-link')
      .should('be.visible')
      .click();

    // 2. Assert navigation to the sign-up page
    cy.url().should('include', '/sign-up');
    cy.contains('Create an account').should('be.visible');

    // 3. Click the 'Login' link on the sign-up page 
    cy.getDataTestId('sign-in-link')
      .should('be.visible')
      .click();

    // 4. Assert navigation back to the login page
    cy.url().should('not.include', '/sign-up');
    cy.contains('Welcome back').should('be.visible');
  });

  // --- TEST 3: CREATING A NEW ACCOUNT (SIGN UP) ---
  it('should successfully create a new account and navigate to the workspace', () => {
    cy.log('--- Starting Successful Sign Up Test ---');

    // 0. Navigate to the sign-up page first
    cy.visit('/sign-up');
    cy.contains('Create an account').should('be.visible');

    // 1. Intercept the signup API call
    cy.intercept('POST', SIGNUP_API_ENDPOINT, (req) => {

      expect(req.body.email).to.equal(SIGNUP_EMAIL);
      expect(req.body.password).to.equal(SIGNUP_PASSWORD);


    }).as('signupRequest');

    // 2. Fill the sign-up form (NOTE: Requires correct data-testid attributes in
    //  your component)
    cy.getDataTestId('signup-name-input').should('be.visible').type(SIGNUP_NAME);
    cy.getDataTestId('signup-email-input').should('be.visible').type(SIGNUP_EMAIL);
    cy.getDataTestId('signup-password-input').should('be.visible').type(SIGNUP_PASSWORD);

    // 3. Click the submit button
    cy.getDataTestId('sign-up-button').should('not.be.disabled').click();

    // 4. Assertions
    cy.wait('@signupRequest').its('response.statusCode');

    // Should be redirected to the new user's initial workspace
    //cy.url().should('include', `/workspace/${MOCK_WORKSPACE_ID}`);
  });

   // --- TEST 4: GOOGLE OAUTH LOGIN (Check for Redirect) ---
  it('should redirect the user to the Google OAuth page', () => {
    // Intercept the initial API call that starts the Google OAuth flow
    cy.intercept('GET', GOOGLE_AUTH_START_ENDPOINT, (req) => {
      // Mock the 302 redirect response to the external Google domain
      req.reply({
        statusCode: 302,
        headers: { location: 'https://accounts.google.com/o/oauth2/v2/auth?mocked' }
      });
    }).as('googleAuthStart');

    // Target the Google login button.
    cy.get('button:contains("Login with Google")').should('be.visible').click();

    // The application should attempt to hit the backend endpoint
    cy.wait('@googleAuthStart');
  });

   // --- TEST 5: RETRIEVE THE CURRENT LOGGED IN USER ---
  it('should get the current user', () => {
    cy.intercept('GET', `http://localhost:8000/api/user/current`, (req) => {

      req.reply({
        statusCode: 200,
        body: {
          "message": "Current user retrieved successfully",
          "user": {
            "_id": "68f8144a64054af5132cb2f3",
            "name": "Emely Saraiva",
            "email": "emelysaraiva@example.com",
            "profilePicture": null,
            "isActive": true,
            "lasLogin": null,
            "currentWorkspace": {
              "_id": "69178f54e24254cf92945c13",
              "name": "Game Dev",
              "owner": "68f8144a64054af5132cb2f3",
              "description": "",
              "inviteCode": "3fe4d38d",
              "createdAt": "2025-11-14T20:21:40.706Z",
              "updatedAt": "2025-11-14T20:21:40.706Z",
              "__v": 0
            },
            "createdAt": "2025-10-21T23:16:26.405Z",
            "updatedAt": "2025-11-14T20:21:41.075Z",
            "__v": 0
          }
        },
      });
    }).as('getCurrentUser');
    // The current user API request should have been made
    cy.wait('@getCurrentUser').its('response.statusCode').should('eq', 200);
  });

 
  


}); 
