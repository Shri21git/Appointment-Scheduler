// import libraries required for the app
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
require("dotenv").config();

// import the exported files
const authRoutes = require("./routes/auth-routes");
const scheduleRoutes = require("./routes/schedule-routes");
const compAccount = require("./models/accounts");
const isAuth = require("./middleware/is-auth");

// Server set up
const MONGODB_URL = process.env.MONGODB_URL;
// defined in .env (default port is 8080)
const PORT = process.env.PORT || 8080;
// define options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
};

const app = express();
// connect to db
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
});

const csrfProtection = csrf({});

// set up for views folder and engine
app.set("view engine", "ejs");
app.set("views", "views");

// set up for body parser
app.use(bodyParser.urlencoded({ extended: false }));

// set up for public static files
app.use(express.static(path.join(__dirname, "public")));

// set up for session
app.use(
  session({
    secret: "Shri-secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// set up for csrf protection
app.use(csrfProtection);

// server variables
app.use((req, res, next) => {
  res.locals.isAuth = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.compId) {
    return next();
  }
  compAccount
    .findById(req.session.compId._id)
    .then((comp) => {
      // if comp exists
      if (!comp) {
        return next();
      }
      req.comp = comp;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// set up routes
app.get("/", (req, res, next) => {
  res.render("home", {
    pageTitle: "Home",
    msg: "Welcome to Appointment Scheduler!",
    isAuthenticated: req.session.isLoggedIn,
  });
});

app.use("/schedule", isAuth, scheduleRoutes);
app.use(authRoutes);

// server start up, then listen for requests and catch any errors
mongoose
  .connect(MONGODB_URL, options)
  .then((result) => {
    console.log(`Listening on ${PORT}`);
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
