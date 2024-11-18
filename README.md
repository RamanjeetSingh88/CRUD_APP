# Instructions

### Part 1 Improving our Login functionality

- In Layout.hbs
    - Add if-else statement to:
        - Show the Login/Register links when user is anonymous
        - Display a logout link and the current user's email address
    - We still need to pass the User object back to the view
- In Routes/Project.js
    - Modify every method that renders a view and add user object
        - Every GET handler except delete because it's a redirect
- In Routes/Courses.js
    - Modify every method that renders a view and add user object
        - Every GET handler
-  Try out to verify the navbar changes accordingly
- In Routes/Index.js
    - Modify every method that renders a view and add user object
    - Add GET handler for logout
        - Call logout() using the request object
        - Redirect to login

### Part 2 Adding Authorization to protect sections of my website

- While logged out, navigate to /Project and /Courses
    - Verify that I can still perform CRUD operations
- There are generally two approaches for securing views
    - Have 1 view for authenticated users and 1 for anonymous users
    - Or have 1 view for both but hide/show links and buttons that perform actions such as CRUD operations
    - However, this only covers what they can see. Better authorization has to be written at the controller level.
- In Views/Projects/Index.hbs
    - Use if-else statements to hide the Add button and the Actions column
- In Views/Courses/Index.hbs
    - Use a if-else statement to hide the Add button 
- Navigate to /Projects/Add while anonymous
    - This view is still visible if somebody knows or guesses the URL, which is a security flaw
- In Routes/Project.js
    - Create a new middleware function called IsLoggedIn()
        - Check user is authenticated by calling isAuthenticated() method in the request object
        - If User is authenticated execute next
        - Else send back to login
    - Inject this middleware in each handler in the controller
    - Verify that everything is locked now
- Make this middleware function reusable
    - Create a new folder called Extensions
    - Add a file named authentication.js
    - Copy over the function
    - Export the function
- Now we can import this middleware in any router as needed
- Apply the same functionality for Course
    - Routes/Course.js
    - Inject authentication middleware function in GET and POST handlers for '/Courses/Add'

### Part 3 Set Up a Project in Google Cloud Console
Go to Google Cloud Console.
Click on Select a project → New Project.
Name your project and click Create.
Enable OAuth Consent Screen:
Navigate to APIs & Services → OAuth consent screen.
Select External (for public access).
Fill in the details.
Create OAuth 2.0 Credentials:
Go to APIs & Services → Credentials → Create credentials → OAuth 2.0 Client IDs.
Choose Web application as the application type.
Add your app’s Authorized redirect URIs (e.g., http://localhost:3000/google/callback).
Click Create, and copy the Client ID and Client Secret.
    - Generate the clientId and clientSecret values and copy them over to your .env file
    - Add three new keys named as below
        - GOOGLE_CLIENT_ID
        - GOOGLE_CLIENT_SECRET
        - GOOGLE_CALLBACK_URL
    - Add the corresponding configuration values in globals.js
        - Create a new section called Authentication
        - Add an inner section called GOOGLE
        - Add the following keys:
            - ClientId > use process.env to access GOOGLE_CLIENT_ID
            - ClientSecret > use process.env to access GOOGLE_CLIENT_SECRET
            - CallbackUrl > use process.env to access GOOGLE_CALLBACK_URL
- Make sure the application is not running and install the following npm package:
    - npm i passport-google-oauth20
    - https://www.npmjs.com/package/passport-google20
- In Models/User.js
    - Add oauthId: String to record the ID that's received from the login provider
    - Add oauthProvider: String to record the provider type 
    - Add created: Date to record the time when the user is created in the DB
    - Note: When creating a local user, these will be blank.
- Add a Config folder and create a globals.js file
    - Add a new section called google and then the following variables:
        - clientId and clientSecret which is used by the authentication
        - callbackUrl which is the url in our application that users will be sent back to after logging in with the external provider
- In App.js
    - Import the globals.js file at the top of the document
    - Import the Strategy class in the passport-google20 package just after importing passport and session
    - Call passport.use() to configure the github strategy and pass the required API keys and User model
    - Add a callback function to handle two scenarios
        - new user
        - returning user
- In Views/Login.hbs
    - Add another login button with href="/github"
- In Routes/Index.js
    - Add a two GET handlers as specified in the documentation
    - One handles when the user clicks "Login with GitHub" on the login page
    - Second one handles when github.com sends the user back to us after an authentication attempt
- Try it out and verify new users in the database
