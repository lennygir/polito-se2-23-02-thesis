"use strict";

/* Data Access Object (DAO) module for accessing users */

const { db } = require("./db");

exports.insertProposal = (
  title,
  supervisor,
  co_supervisors,
  groups,
  keywords,
  types,
  description,
  required_knowledge,
  notes,
  expiration_date,
  level,
  cds,
) => {
  return new Promise((resolve, reject) => {
    db.run(
      "insert into PROPOSAlS(title, supervisor, co_supervisors, keywords, type, groups, description, required_knowledge, notes, expiration_date, level, cds) values(?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        title,
        supervisor,
        co_supervisors,
        keywords,
        types,
        groups,
        description,
        required_knowledge,
        notes,
        expiration_date,
        level,
        cds,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      },
    );
  });
};

exports.getTeacher = (id) => {
  return new Promise((resolve, reject) => {
    db.get("select * from TEACHER where id = ?", id, (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        resolve(row);
      }
    });
  });
};

exports.getGroup = (cod_group) => {
  return new Promise((resolve, reject) => {
    db.get(
      "select * from GROUPS where cod_group = ?",
      cod_group,
      (err, row) => {
        if (err) {
          reject(err);
        } else if (row === undefined) {
          resolve(false);
        } else {
          resolve(row);
        }
      },
    );
  });
};
