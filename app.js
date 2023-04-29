const express = require("express");
const mongoose = require("mongoose");
const app = express();

const uri =
  "mongodb+srv://Shri21G:MRShriji_c%4021TH@shri21cluster.vl8wwej.mongodb.net/?retryWrites=true&w=majority";

// async function connectdb() {
//   try {
//     await mongoose.connect(uri);
//     console.log("connected to mongobd!");
//   } catch (error) {
//     console.error(error);
//   }
// }

// connectdb();

// routes for website

app.get("/", (req, res) => {
  res.send("Hello node APi");
});

app.listen(8080, () => {
  console.log("server running on port 8080");
});
