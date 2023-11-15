"use strict";

/* Data Access Object (DAO) module for accessing users */

const { db } = require("./db");

exports.insertApplication = (proposal, student, state) => {
  return new Promise((resolve, reject) => {
    db.run(
      "insert into APPLICATIONS(proposal_id, student_id, state) values(?,?,?)",
      [proposal, student, state],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ proposal_id: proposal, student_id: student, state: state });
        }
      },
    );
  });
};

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

exports.getApplication = (student_id, proposal_id) => {
  return new Promise((resolve, reject) => {
    db.get(
      "select * from APPLICATIONS where student_id = ? and proposal_id = ?",
      student_id,
      proposal_id,
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

exports.getProposalsBySupervisor = (id) => {
  return new Promise((resolve, reject) => {
    db.all("select * from PROPOSALS where supervisor = ?", id, (err, row) => {
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

exports.getTeachers = () => {
  return new Promise((resolve, reject) => {
    db.all("select id, surname, name, email from TEACHER", (err, row) => {
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

exports.getProposal = (id) => {
  return new Promise((resolve, reject) => {
    db.get("select * from PROPOSALS where id = ?", id, (err, row) => {
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

exports.getStudent = (id) => {
  return new Promise((resolve, reject) => {
    db.get("select * from STUDENT where id = ?", id, (err, row) => {
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

exports.deleteApplication = (student_id, proposal_id) => {
  return new Promise((resolve, reject) => {
    db.run(
      "delete from APPLICATIONS where student_id = ? and proposal_id = ?",
      [student_id, proposal_id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      },
    );
  });
};

exports.getGroups = () => {
  return new Promise((resolve, reject) => {
    db.all("select cod_group from GROUPS", (err, row) => {
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

exports.getDegrees = () => {
  return new Promise((resolve, reject) => {
    db.all("select cod_degree, title_degree from DEGREE", (err, row) => {
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

exports.getProposalsByDegree = (cds) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM PROPOSALS
      WHERE cds = ? AND id NOT IN (
        SELECT proposal_id
        FROM APPLICATIONS
        WHERE state = 'accepted' AND proposal_id IS NOT NULL
      )`,
      cds,
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      },
    );
  });
};
