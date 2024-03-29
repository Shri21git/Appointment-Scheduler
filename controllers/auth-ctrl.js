// import libraries required
const bcrypt = require("bcryptjs");
const Swal = require("sweetalert2");

// import necessary files
const compAccount = require("../models/accounts");

// for /login => GET
exports.getLogin = (req, res, next) => {
  res.render("login", {
    pageTitle: "Login",
    isAuthenticated: false,
    login: "notyet",
  });
};

// for /login => POST
exports.postLogin = (req, res, next) => {
  const name = req.body.name;
  const pass = req.body.password;

  // find the account with name
  compAccount
    .findOne({ name: name })
    .then((account) => {
      // if name was found, redirect to /login
      if (!account) {
        console.log("No account found!");
        return res.render("login", {
          pageTitle: "Login",
          isAuthenticated: false,
          login: "notfound",
        });
      }
      // compare the password if account found
      bcrypt
        .compare(pass, account.password)
        .then((isMatch) => {
          // if the passwords match, set up the session
          if (isMatch) {
            req.session.isLoggedIn = true;
            // req.session.org = org;
            return req.session.save((err) => {
              console.log(err);
              // if the user is successfully authenticated,
              // redirect them to the schedule app
              res.redirect("/schedule");
            });
          }
          // if the passwords do not match, redirect to /login
          console.log("Invalid credentials!");
          return res.render("login", {
            pageTitle: "Login",
            isAuthenticated: false,
            login: "invalid",
          });
        })
        .catch((err) => {
          // catch any errors
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/login");
    });
};

// for /signup => GET
exports.getSignup = (req, res, next) => {
  res.render("signup", {
    pageTitle: "Sign-Up",
    isAuthenticated: false,
    signup: "doing",
  });
};

// for /signup => POST
exports.postSignup = (req, res, next) => {
  // get signup details from form
  const name = req.body.name;
  const pass = req.body.password;
  const confirmPass = req.body.confirmPassword;

  // create a new account only if the passwords match
  if (pass !== confirmPass) {
    console.log("Passwords mismatch!");
    return res.render("signup", {
      pageTitle: "Sign-Up",
      isAuthenticated: false,
      signup: "mismatch",
    });
  }

  // encrypt the password and create the account
  bcrypt
    .hash(pass, 10)
    .then((result) => {
      // create new account with the hashed password
      const account = new compAccount({
        name: name,
        password: result,
      });
      return account.save();
    })
    .then((result) => {
      return res.render("signup", {
        pageTitle: "Sign-Up",
        isAuthenticated: false,
        signup: "success",
      });
    })
    .catch((err) => {
      return res.render("signup", {
        pageTitle: "Sign-Up",
        isAuthenticated: false,
        signup: "already",
      });
    });
};

// for /logout => POST
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/"); // home page
  });
};
