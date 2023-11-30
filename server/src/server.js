"use strict";
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("./passport");

const app = new express();

// --- Console requests
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost", "http://localhost:80"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(
  session({
    secret: "Alright, then, keep your secrets.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  console.log(
    `[${new Date().toLocaleTimeString("it-IT")}] - ${req.method} ${req.url}`
  );
  next();
});
app.use(express.json());

app.use(require("./routes.js"));

module.exports = app;
