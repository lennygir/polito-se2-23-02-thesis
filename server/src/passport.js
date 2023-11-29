"use strict";

const passport = require("passport");
const { Strategy } = require("passport-saml");
const fs = require("fs");

const users = [];
passport.serializeUser((user, done) => {
  console.log(user);
  console.log("serialize user");
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log(user);
  console.log("deserialize user");
  done(null, user);
});

const strategy = new Strategy(
  {
    issuer: "http://localhost:3000",
    protocol: "http://",
    path: "/login/callback",
    entryPoint:
      "https://dev-b1bmu6tyqbve3iwg.us.auth0.com/samlp/OhrX6zAdWHcVxRMXFfkK2MBarmyzzMf0",
    cert: fs.readFileSync("./src/saml.pem", "utf-8"),
  },
  (user, done) => {
    if (!users.includes(user)) {
      users.push(user);
    }

    return done(null, user);
  },
);

passport.use(strategy);

exports.strategy = strategy;
