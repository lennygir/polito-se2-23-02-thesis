"use strict";

/* Data Access Object (DAO) module for accessing users */

const { db } = require("./db");

// todo: FAKE AUTHENTICATION. MUST BE SUBSTITUTED BY SAML2.0
exports.checkUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if (err) {
        // sql error
        reject(err);
      } else if (row === undefined) {
        // there is not a user with this ID
        resolve(false);
      } else {
        resolve(row.password === password);
      }
    });
  });
};

exports.getTeacher = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM teacher WHERE email = ?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        // the id is not a teacherID
        resolve(false);
      } else {
        resolve(row);
      }
    });
  });
};

exports.getStudent = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM student WHERE email = ?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        // the id is not a studentID
        resolve(false);
      } else {
        resolve(row);
      }
    });
  });
};
