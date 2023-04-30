// import libraries required for the app
const express = require("express");

// import necessary files
const authCtrl = require("../controllers/auth-ctrl");

// handle HTTP requests
const router = express.Router();

// router for all '/login' routes

// /login => GET
router.get("/login", authCtrl.getLogin);

// /login => POST
router.post("/login", authCtrl.postLogin);

// /signup => GET
router.get("/signup", authCtrl.getSignup);

// /signup => POST
router.post("/signup", authCtrl.postSignup);

// /logout => POST
router.post("/logout", authCtrl.postLogout);

module.exports = router;
