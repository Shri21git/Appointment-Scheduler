// Routes for /schedule req to corresponding controller

// import libraries required for the app
const express = require("express");

// import necessary files
const schCtrl = require("../controllers/schedule-ctrl");

// handle HTTP requests
const router = express.Router();

// routing for all /schedule requests

router.get("/profile/:profileId", schCtrl.getEditProfile);

router.post("/profile/update", schCtrl.postEditProfile);

// /schedule/profile => GET
router.get("/profile", schCtrl.getProfile);

// /schedule/profile => POST
router.post("/profile", schCtrl.postProfile);

// /schedule/add-appointment => POST
router.post("/add-appointment", schCtrl.postAppointment);

router.get("/load/:profileId/:date", schCtrl.getScheduleData);

router.post("/delete/:profileId/:schId", schCtrl.deleteAppointment);

// /schedule => GET
router.get("/", schCtrl.getSchedule);

module.exports = router;
