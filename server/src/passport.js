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

passport.use(
  new Strategy(
    {
      issuer: "http://localhost:3000",
      protocol: "http://",
      path: "/login/callback",
      entryPoint:
        "https://dev-26427425.okta.com/app/dev-26427425_thesesmanagement_1/exkdiotop7RPuz9yv5d7/sso/saml",
      cert: fs.readFileSync("./src/saml.pem", "utf-8"),
    },
    (user, done) => {
      if (!users.includes(user)) {
        users.push(user);
      }

      return done(null, user);
    },
  ),
);
