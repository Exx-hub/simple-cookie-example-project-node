const express = require("express");
const bodyParser = require("body-parser");
const { createReadStream } = require("fs");
const cookieParser = require("cookie-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false })); // to parse the data sent by the client

app.use(cookieParser());

// temporary database for users
const USERS = {
  user1: "password1",
  user2: "password2",
};

const BALANCES = {
  user1: 500,
  user2: 1000,
};

// hompage route
// routing for  the homepage
app.get("/", (req, res) => {
  console.log(req.cookies);
  const username = req.cookies?.username; // getting stored username from the browser cookies
  const balance = BALANCES[username];
  // checks for the username if it exists
  if (username) {
    res.send(`Hi ${username}! Your balance is $${balance}.`);
  } else {
    createReadStream("index.html").pipe(res);
  }
});

// routing for the login page
app.post("/login", (req, res) => {
  const username = req.body.username; // get username from the client form data
  const password = USERS[username];

  // only if the passwords are equal
  if (password === req.body.password) {
    res.cookie("username", username);
    return res.send("Logged in successfully!");
  }
  res.send("Failed to login!"); //   else condition
});

// routing for logout
app.get("/logout", (req, res) => {
  res.clearCookie("username");
  return res.redirect("/");
});

app.listen(process.env.port || 3000, () => console.log("Server running")); // Server lisening to localhost and port 3000
