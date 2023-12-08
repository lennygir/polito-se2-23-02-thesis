"use strict";

/* Data Access Object (DAO) module for accessing users */

const { db } = require("./db");

exports.getTeacher = (id) => {
  return db.prepare("select * from TEACHER where email = ?").get(id);
};

exports.getStudent = (id) => {
  return db.prepare("select * from STUDENT where email = ?").get(id);
};
