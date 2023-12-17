"use strict";

/* Data Access Object (DAO) module for accessing users */

const { db } = require("./db");

exports.getUser = (reqUser) => {
  const { email } = reqUser;
  const student = db
    .prepare("select * from main.STUDENT where email = ?")
    .get(email);
  const teacher = db
    .prepare("select * from main.TEACHER where email = ?")
    .get(email);
  const secretary_clerk = db
    .prepare("select * from main.SECRETARY_CLERK where email = ?")
    .get(email);
  if (student) {
    student.role = "student";
  } else if (teacher) {
    teacher.role = "teacher";
  } else if (secretary_clerk) {
    secretary_clerk.role = "secretary_clerk";
  }
  return student || teacher || secretary_clerk;
};
