"use strict";

/* Data Access Object (DAO) module for accessing users */

const { db } = require("./db");

// todo: FAKE AUTHENTICATION. MUST BE SUBSTITUTED BY SAML2.0
exports.checkUser = (email, password) => {
  const user = db.prepare("select * from users where email = ?").get(email);
  if (user === undefined) {
    return false;
  } else {
    return user.password === password;
  }
};

exports.getTeacher = (id) => {
  return db.prepare("select * from TEACHER where email = ?").get(id);
};

exports.getStudent = (id) => {
  return db.prepare("select * from STUDENT where email = ?").get(id);
};
