require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Database connection

mongoose.connect("mongodb+srv://kingkhan:KHan1122@cluster0.ag9ptld.mongodb.net/userDB");

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

////////Encrypt Schema//////////

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);


app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      username: req.body.username,
      password: hash
    });
    newUser.save((err) => {
      if (!err) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });

});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    username: username
  }, (err, foundUser) => {
    if (!err) {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result === true) {
            res.render("secrets");
          }
        });

      }
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000.");
});
