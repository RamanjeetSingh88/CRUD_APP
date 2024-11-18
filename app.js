const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const configs = require("./configs/globals"); 
require('dotenv').config();
const User = require("./models/user"); 


// Create an instance of the express application
const app = express();

// Set up mongoose connection
mongoose
  .connect(configs.ConnectionStrings.MongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected Successfully!"))
  .catch((error) => console.log(`Error while connecting: ${error}`));

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Register the Handlebars helpers
const hbs = require("hbs");
hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper("toShortDate", (longDateValue) => {
  return new hbs.SafeString(new Date(longDateValue).toLocaleDateString("en-CA"));
});
// Register a custom Handlebars helper to create option elements
hbs.registerHelper('createOptionElement', function(value, selectedValue) {
  const isSelected = value === selectedValue ? 'selected' : '';
  return new hbs.SafeString(`<option value="${value}" ${isSelected}>${value}</option>`);
});


// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set up session and passport
app.use(
  session({
    secret: "s2021pr0j3ctTracker",
    resave: false,
    saveUninitialized: false,
  })
);

const GoogleStrategy = require("passport-google-oauth20").Strategy;


passport.use(
  new GoogleStrategy(
    {
      clientID: configs.Authentication.Google.ClientId,
      clientSecret: configs.Authentication.Google.ClientSecret,
      callbackURL: configs.Authentication.Google.CallbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ oauthId: profile.id });
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            username: profile.displayName,
            oauthId: profile.id,
            oauthProvider: "Google",
            created: Date.now(),
          });
          const savedUser = await newUser.save();
          return done(null, savedUser);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

// Routers
const indexRouter = require("./routes/index");
const projectsRouter = require("./routes/projects");
const coursesRouter = require("./routes/courses");

// Register routers
app.use("/", indexRouter);
app.use("/projects", projectsRouter);
app.use("/courses", coursesRouter);

// Error Handling Middleware
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;


