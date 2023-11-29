"use strict";

/* Data Access Object (DAO) module for accessing users */

const { db } = require("./db");

exports.insertApplication = (proposal, student, state) => {
  db.prepare(
    "insert into APPLICATIONS(proposal_id, student_id, state) values (?,?,?)",
  ).run(proposal, student, state);
  return { proposal_id: proposal, student_id: student, state: state };
  //  return new Promise((resolve, reject) => {
  //    db.run(
  //      "insert into APPLICATIONS(proposal_id, student_id, state) values(?,?,?)",
  //      [proposal, student, state],
  //      function (err) {
  //        if (err) {
  //          reject(err);
  //        } else {
  //          resolve({ proposal_id: proposal, student_id: student, state: state });
  //        }
  //      },
  //    );
  //  });
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
  return db
    .prepare(
      "insert into PROPOSAlS(title, supervisor, co_supervisors, keywords, type, groups, description, required_knowledge, notes, expiration_date, level, cds) values(?,?,?,?,?,?,?,?,?,?,?,?)",
    )
    .run(
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
    ).lastInsertRowid;
  //  return new Promise((resolve, reject) => {
  //    db.run(
  //      "insert into PROPOSAlS(title, supervisor, co_supervisors, keywords, type, groups, description, required_knowledge, notes, expiration_date, level, cds) values(?,?,?,?,?,?,?,?,?,?,?,?)",
  //      [
  //        title,
  //        supervisor,
  //        co_supervisors,
  //        keywords,
  //        types,
  //        groups,
  //        description,
  //        required_knowledge,
  //        notes,
  //        expiration_date,
  //        level,
  //        cds,
  //      ],
  //      function (err) {
  //        if (err) {
  //          reject(err);
  //        } else {
  //          resolve(this.lastID);
  //        }
  //      },
  //    );
  //  });
};

exports.getApplication = (student_id, proposal_id) => {
  return db
    .prepare(
      "select * from APPLICATIONS where student_id = ? and proposal_id = ?",
    )
    .get(student_id, proposal_id);
  // return new Promise((resolve, reject) => {
  //   db.get(
  //     "select * from APPLICATIONS where student_id = ? and proposal_id = ?",
  //     student_id,
  //     proposal_id,
  //     (err, row) => {
  //       if (err) {
  //         reject(err);
  //       } else if (row === undefined) {
  //         resolve(false);
  //       } else {
  //         resolve(row);
  //       }
  //     },
  //   );
  // });
};

exports.getProposalsBySupervisor = (id) => {
  return db.prepare("select * from PROPOSALS where supervisor = ?").all(id);

  // return new Promise((resolve, reject) => {
  //   db.all("select * from PROPOSALS where supervisor = ?", id, (err, row) => {
  //     if (err) {
  //       reject(err);
  //     } else if (row === undefined) {
  //       resolve(false);
  //     } else {
  //       resolve(row);
  //     }
  //   });
  // });
};

exports.getTeacher = (id) => {
  return db.prepare("select * from TEACHER where id = ?").get(id);
  //  return new Promise((resolve, reject) => {
  //    db.get("select * from TEACHER where id = ?", id, (err, row) => {
  //      if (err) {
  //        reject(err);
  //      } else if (row === undefined) {
  //        resolve(false);
  //      } else {
  //        resolve(row);
  //      }
  //    });
  //  });
};

exports.getTeachers = () => {
  return db.prepare("select id, surname, name, email from TEACHER").all();
  //  return new Promise((resolve, reject) => {
  //    db.all("select id, surname, name, email from TEACHER", (err, row) => {
  //      if (err) {
  //        reject(err);
  //      } else if (row === undefined) {
  //        resolve(false);
  //      } else {
  //        resolve(row);
  //      }
  //    });
  //  });
};

exports.getProposal = (id) => {
  return db.prepare("select * from PROPOSALS where id = ?").get(id);
  //  return new Promise((resolve, reject) => {
  //    db.get("select * from PROPOSALS where id = ?", id, (err, row) => {
  //      if (err) {
  //        reject(err);
  //      } else if (row === undefined) {
  //        resolve(false);
  //      } else {
  //        resolve(row);
  //      }
  //    });
  //  });
};

exports.getStudent = (id) => {
  return db.prepare("select * from STUDENT where id = ?").get(id);
  //  return new Promise((resolve, reject) => {
  //    db.get("select * from STUDENT where id = ?", id, (err, row) => {
  //      if (err) {
  //        reject(err);
  //      } else if (row === undefined) {
  //        resolve(false);
  //      } else {
  //        resolve(row);
  //      }
  //    });
  //  });
};

//to delete
exports.findAcceptedProposal = (proposal_id) => {
  return db
    .prepare(
      `select * from APPLICATIONS where proposal_id = ? and state = 'accepted'`,
    )
    .get(proposal_id);
};



exports.getGroup = (cod_group) => {
  return db.prepare("select * from GROUPS where cod_group = ?").get(cod_group);
  //  return new Promise((resolve, reject) => {
  //    db.get(
  //      "select * from GROUPS where cod_group = ?",
  //      cod_group,
  //      (err, row) => {
  //        if (err) {
  //          reject(err);
  //        } else if (row === undefined) {
  //          resolve(false);
  //        } else {
  //          resolve(row);
  //        }
  //      },
  //    );
  //  });
};

exports.deleteApplication = (student_id, proposal_id) => {
  db.prepare(
    "delete from APPLICATIONS where student_id = ? and proposal_id = ?",
  ).run(student_id, proposal_id);
  //return new Promise((resolve, reject) => {
  //  db.run(
  //    "delete from APPLICATIONS where student_id = ? and proposal_id = ?",
  //    [student_id, proposal_id],
  //    function (err) {
  //      if (err) {
  //        reject(err);
  //      } else {
  //        resolve(true);
  //      }
  //    },
  //  );
  //});
};

exports.getGroups = () => {
  return db.prepare("select cod_group from GROUPS").all();
  //  return new Promise((resolve, reject) => {
  //    db.all("select cod_group from GROUPS", (err, row) => {
  //      if (err) {
  //        reject(err);
  //      } else if (row === undefined) {
  //        resolve(false);
  //      } else {
  //        resolve(row);
  //      }
  //    });
  //  });
};

exports.getDegrees = () => {
  return db.prepare("select cod_degree, title_degree from DEGREE").all();
  //  return new Promise((resolve, reject) => {
  //    db.all("select cod_degree, title_degree from DEGREE", (err, row) => {
  //      if (err) {
  //        reject(err);
  //      } else if (row === undefined) {
  //        resolve(false);
  //      } else {
  //        resolve(row);
  //      }
  //    });
  //  });
};

exports.getProposalsByDegree = (cds) => {
  return db
    .prepare(
      `
      SELECT *
      FROM PROPOSALS
      WHERE cds = ? AND id NOT IN (
        SELECT proposal_id
        FROM APPLICATIONS
        WHERE state = 'accepted' AND proposal_id IS NOT NULL
      )`,
    )
    .all(cds);
  //return new Promise((resolve, reject) => {
  //  db.all(
  //    `
  //    SELECT *
  //    FROM PROPOSALS
  //    WHERE cds = ? AND id NOT IN (
  //      SELECT proposal_id
  //      FROM APPLICATIONS
  //      WHERE state = 'accepted' AND proposal_id IS NOT NULL
  //    )`,
  //    cds,
  //    (err, rows) => {
  //      if (err) {
  //        reject(err);
  //      } else {
  //        resolve(rows);
  //      }
  //    },
  //  );
  //});
};

/**
 * todo: I think it's ugly to return student's info and teacher's info
 * @param teacher_id
 * @returns {[
 *   {
 *     proposal_id,
 *     teacher_id,
 *     state,
 *     student_name,
 *     student_surname,
 *     teacher_name,
 *     teacher_surname
 *   }
 * ]}
 */
exports.getApplicationsOfTeacher = (teacher_id) => {
  return db
    .prepare(
      `select APPLICATIONS.proposal_id, 
                  APPLICATIONS.student_id, 
                  APPLICATIONS.state, 
                  STUDENT.name as student_name, 
                  STUDENT.surname as student_surname, 
                  TEACHER.name as teacher_name, 
                  TEACHER.surname as teacher_surname
       from APPLICATIONS,
            PROPOSALS,
            STUDENT,
            TEACHER
       where APPLICATIONS.proposal_id = PROPOSALS.id
         and PROPOSALS.supervisor = TEACHER.id
         and APPLICATIONS.student_id = STUDENT.id
         and PROPOSALS.supervisor = ?`,
    )
    .all(teacher_id);
  //return new Promise((resolve, reject) => {
  //  db.all(
  //    `select APPLICATIONS.proposal_id,
  //                APPLICATIONS.student_id,
  //                APPLICATIONS.state,
  //                STUDENT.name as student_name,
  //                STUDENT.surname as student_surname,
  //                TEACHER.name as teacher_name,
  //                TEACHER.surname as teacher_surname
  //     from APPLICATIONS,
  //          PROPOSALS,
  //          STUDENT,
  //          TEACHER
  //     where APPLICATIONS.proposal_id = PROPOSALS.id
  //       and PROPOSALS.supervisor = TEACHER.id
  //       and APPLICATIONS.student_id = STUDENT.id
  //       and PROPOSALS.supervisor = ?`,
  //    teacher_id,
  //    (err, rows) => {
  //      if (err) {
  //        reject(err);
  //      } else {
  //        resolve(rows);
  //      }
  //    },
  //  );
  //});
};

exports.getApplicationsOfStudent = (student_id) => {
  return db
    .prepare(
      `select APPLICATIONS.proposal_id, 
                  APPLICATIONS.student_id, 
                  APPLICATIONS.state, 
                  STUDENT.name as student_name, 
                  STUDENT.surname as student_surname, 
                  TEACHER.name as teacher_name, 
                  TEACHER.surname as teacher_surname
       from APPLICATIONS,
            PROPOSALS,
            STUDENT,
            TEACHER
       where APPLICATIONS.proposal_id = PROPOSALS.id
         and PROPOSALS.supervisor = TEACHER.id
         and APPLICATIONS.student_id = STUDENT.id
         and APPLICATIONS.student_id = ?`,
    )
    .all(student_id);
  //return new Promise((resolve, reject) => {
  //  db.all(
  //    `select APPLICATIONS.proposal_id,
  //                APPLICATIONS.student_id,
  //                APPLICATIONS.state,
  //                STUDENT.name as student_name,
  //                STUDENT.surname as student_surname,
  //                TEACHER.name as teacher_name,
  //                TEACHER.surname as teacher_surname
  //     from APPLICATIONS,
  //          PROPOSALS,
  //          STUDENT,
  //          TEACHER
  //     where APPLICATIONS.proposal_id = PROPOSALS.id
  //       and PROPOSALS.supervisor = TEACHER.id
  //       and APPLICATIONS.student_id = STUDENT.id
  //       and APPLICATIONS.student_id = ?`,
  //    student_id,
  //    (err, rows) => {
  //      if (err) {
  //        reject(err);
  //      } else {
  //        resolve(rows);
  //      }
  //    },
  //  );
  //});
};

exports.getProposals = () => {
  return db.prepare("select * from PROPOSALS").all();
  //return new Promise((resolve, reject) => {
  //  db.all(
  //    `
  //    SELECT *
  //    FROM PROPOSALS`,
  //    (err, rows) => {
  //      if (err) {
  //        reject(err);
  //      } else {
  //        resolve(rows);
  //      }
  //    },
  //  );
  //});
};

exports.deleteProposal = (proposal_id) => {
  try {
    // Check if proposal_id exists in APPLICATIONS table
    const checkApplications = db.prepare("SELECT COUNT(*) AS count FROM APPLICATIONS WHERE proposal_id = ?");
    const applicationsCount = checkApplications.get(proposal_id).count;

    if (applicationsCount === 0) {
      throw { status: 404, message: "Proposal ID not found in APPLICATIONS table. Deletion unsuccessful." };
    }

    // Check if proposal_id exists in PROPOSALS table
    const checkProposals = db.prepare("SELECT COUNT(*) AS count FROM PROPOSALS WHERE id = ?");
    const proposalsCount = checkProposals.get(proposal_id).count;

    if (proposalsCount === 0) {
      throw { status: 404, message: "Proposal ID not found in PROPOSALS table. Deletion unsuccessful." };
    }

    const deleteProposals = db.prepare("DELETE FROM PROPOSALS WHERE id = ?");
    const proposalsResult = deleteProposals.run([proposal_id]);

    if (proposalsResult.changes === 0) {
      throw { status: 404, message: "No rows were deleted. Deletion unsuccessful." };
    } else {
      console.log("Deletions were successful");
    }

    db.prepare(
      "UPDATE applications SET state = 'canceled' WHERE proposal_id IS NULL;",
    ).run();

    
  } catch (err) {
    console.error("Error deleting:", err);
    // Re-throw the error to propagate it to the caller
    throw err;
  }
};

exports.updateProposal = (id, setValues) => {

  const params = [];
  const sqlParams = [];
  for (const key in setValues) {
    const value = setValues[key];
    // Check if the value is of a supported type for SQLite3 bindings
    if (
      typeof value === 'number' ||
      typeof value === 'string' ||
      value instanceof Buffer ||
      value === null
    ) {
      sqlParams.push(`${key} = ?`);
      params.push(value);
    } else {
      sqlParams.push(`${key} = ?`);
      params.push(JSON.stringify(value)); 
    }
  }

  const sqlQuery = `UPDATE PROPOSALS SET ${sqlParams.join(', ')} WHERE id = ?`;
  params.push(id);

  const stmt = db.prepare(sqlQuery);
  stmt.run(params)
}




