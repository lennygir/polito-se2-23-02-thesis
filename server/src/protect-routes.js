"use strict";

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(400).json({ message: "Unauthorized" });
};

module.exports = isLoggedIn;
