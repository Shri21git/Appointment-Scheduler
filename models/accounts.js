//Schema for the organizating accounts

// import necessary libraries
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // tokens for reseting passwords
  resetToken: String,
  resetTokenExpire: Date,
});

module.exports = mongoose.model("Organization", accSchema);
