// Schema for profile with appointment scheduling

// import necessary libraries
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  fname: {
    type: String,
    reqired: true,
  },
  lname: {
    type: String,
    reqired: true,
  },
  phone: {
    type: String,
    required: true,
  },
  availability: {
    days: {
      sun: {
        type: Boolean,
        required: true,
      },
      mon: {
        type: Boolean,
        required: true,
      },
      tue: {
        type: Boolean,
        required: true,
      },
      wed: {
        type: Boolean,
        required: true,
      },
      thu: {
        type: Boolean,
        required: true,
      },
      fri: {
        type: Boolean,
        required: true,
      },
      sat: {
        type: Boolean,
        required: true,
      },
    },
  },
  position: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
