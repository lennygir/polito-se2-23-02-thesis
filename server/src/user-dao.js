"use strict";

/* Data Access Object (DAO) module for accessing users */

const { db } = require("./db");

exports.getUser = (email) => {
  const student = db
    .prepare("select * from main.STUDENT where email = ?")
    .get(email);
  const teacher = db
    .prepare("select * from main.TEACHER where email = ?")
    .get(email);
  if (student) {
    student.role = "student";
  } else if (teacher) {
    teacher.role = "teacher";
  }
  return student || teacher;
};
