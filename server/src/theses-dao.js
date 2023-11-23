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

exports.searchAcceptedApplication = (student_id) => {
  db.prepare(
    "select * from APPLICATIONS where student_id = ? and state = 'accepted'",
  ).get(student_id);
}

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

exports.getApplicationById = (id) => {
  return db.prepare("select * from APPLICATIONS where id = ?").get(id);
};

exports.getApplication = (student_id, proposal_id) => {
  return db
    .prepare(
      "select * from APPLICATIONS where student_id = ? and proposal_id = ?",
    )
    .get(student_id, proposal_id);
};

exports.getProposalsBySupervisor = (id) => {
  return db.prepare("select * from PROPOSALS where supervisor = ?").all(id);
};

exports.getTeacher = (id) => {
  return db.prepare("select * from TEACHER where id = ?").get(id);
};

exports.getTeachers = () => {
  return db.prepare("select id, surname, name, email from TEACHER").all();
};

exports.getProposal = (id) => {
  return db.prepare("select * from PROPOSALS where id = ?").get(id);
};

exports.getStudent = (id) => {
  return db.prepare("select * from STUDENT where id = ?").get(id);
};

exports.getGroup = (cod_group) => {
  return db.prepare("select * from GROUPS where cod_group = ?").get(cod_group);
};

exports.deleteApplication = (student_id, proposal_id) => {
  db.prepare(
    "delete from APPLICATIONS where student_id = ? and proposal_id = ?",
  ).run(student_id, proposal_id);
};

exports.getGroups = () => {
  return db.prepare("select cod_group from GROUPS").all();
};

exports.getDegrees = () => {
  return db.prepare("select cod_degree, title_degree from DEGREE").all();
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
};

exports.rejectPendingApplications = (of_proposal, except_for_student) => {
  db.prepare(
    "update APPLICATIONS set state = 'rejected' where proposal_id = ? AND state = 'pending' AND student_id != ?",
  ).run(of_proposal, except_for_student);
};

exports.deletePendingApplications = (of_student, except_proposal) => {
  db.prepare(
    "delete from APPLICATIONS where student_id = ? and proposal_id != ? and state = 'pending'",
  ).run(of_student, except_proposal);
};

exports.updateApplication = (id, state) => {
  db.prepare("update APPLICATIONS set state = ? where id = ?").run(state, id);
};

/**
 * todo: I think it's ugly to return student's info and teacher's info
 * @param teacher_id
 * @returns {[
 *   {
 *     application_id,
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
      `select APPLICATIONS.id, 
                  APPLICATIONS.proposal_id, 
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
};

exports.getApplicationsOfStudent = (student_id) => {
  return db
    .prepare(
      `select APPLICATIONS.id, 
                  APPLICATIONS.proposal_id, 
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
};

exports.getProposals = () => {
  return db.prepare("select * from PROPOSALS").all();
};
