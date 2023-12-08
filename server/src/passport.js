"use strict";

const passport = require("passport");
const { Strategy } = require("passport-saml");
const fs = require("fs");

const users = [];
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
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
    let customUser = {
      email:
        user[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ],
    };
    if (!users.includes(customUser)) {
      users.push(customUser);
    }

    return done(null, customUser);
  },
);

passport.use(strategy);

exports.strategy = strategy;
