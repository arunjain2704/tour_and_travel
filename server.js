const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const { MongoClient } = require("mongodb");

app.use(express.static(path.join(__dirname, "frontend")));
app.use(bodyParser.urlencoded({ extended: true }));

const connectionString =
  "mongodb+srv://root:root@cluster0.yk1jl.mongodb.net/tour_and_travel?retryWrites=true&w=majority";

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("tour_and_travel");
    const userInfoCollection = db.collection("userInfo");
    const contactFormCollection = db.collection("contactInfo");
    const bookFormCollection = db.collection("bookingInfo");

    // Sign Up form
    app.post("/formSubmit", function (req, res) {
      userInfoCollection
        .findOne({ email: req.body.email })
        .then(function (result) {
          if (result === null) {
            userInfoCollection
              .insertOne(req.body)
              .then((result) => {
                res.redirect("/");
              })
              .catch((error) => console.error(error));
          } else {
            console.log("Already Existing user");
          }
        });
    });

    // Login Form
    app.post("/checkLogin", function (req, res) {
      userInfoCollection
        .findOne({ email: req.body.email })
        .then(function (result) {
          if (
            result &&
            result.password &&
            req.body.password === result.password
          ) {
            console.log("Valid User");
          } else {
            // return { error: "Not a valid User" };
            console.log("Not a Valid User");
          }
        });
    });

    // Booking  Form
    app.post("/bookForm", function (req, res) {
      bookFormCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    // Contact  Form
    app.post("/contactForm", function (req, res) {
      contactFormCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });
  })
  .catch((error) => console.error(error));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/frontend/index.html");
});

app.listen(3000, function () {
  console.log("listening on 3000");
});
