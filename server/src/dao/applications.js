"use strict";

const { db } = require("../db");

exports.insertApplication = (proposal, student, state) => {
  const result = db
    .prepare(
      "insert into APPLICATIONS(proposal_id, student_id, state) values (?,?,?)",
    )
    .run(proposal, student, state);
  const applicationId = result.lastInsertRowid;
  return {
    application_id: applicationId,
    proposal_id: proposal,
    student_id: student,
    state: state,
  };
};

exports.searchAcceptedApplication = (student_id) => {
  return db
    .prepare(
      "select * from APPLICATIONS where student_id = ? and state = 'accepted'",
    )
    .get(student_id);
};

exports.insertPDFInApplication = (file, applicationId) => {
  return db
    .prepare(
      "update APPLICATIONS set attached_file = ? where main.APPLICATIONS.id = ?",
    )
    .run(file, applicationId);
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

exports.deleteApplication = (student_id, proposal_id) => {
  db.prepare(
    "delete from APPLICATIONS where student_id = ? and proposal_id = ?",
  ).run(student_id, proposal_id);
};

exports.deleteApplicationsOfStudent = (student_id) => {
  db.prepare("delete from APPLICATIONS where student_id = ?").run(student_id);
};

exports.cancelPendingApplications = (of_proposal) => {
  db.prepare(
    "update APPLICATIONS set state = 'canceled' where proposal_id = ? AND state = 'pending'",
  ).run(of_proposal);
};

exports.cancelPendingApplicationsOfStudent = (student_id) => {
  db.prepare(
    "update APPLICATIONS set state = 'canceled' where main.APPLICATIONS.student_id = ? and state = 'pending'",
  ).run(student_id);
};

exports.updateApplication = (id, state) => {
  db.prepare("update APPLICATIONS set state = ? where id = ?").run(state, id);
};

exports.getAcceptedApplicationsOfStudent = (student_id) => {
  return db
    .prepare(
      `select * from APPLICATIONS where student_id = ? and state = 'accepted'`,
    )
    .all(student_id);
};

exports.getPendingApplicationsOfStudent = (student_id) => {
  return db
    .prepare(
      `select * from APPLICATIONS where student_id = ? and state = 'pending'`,
    )
    .all(student_id);
};

exports.findRejectedApplication = (proposal_id, student_id) => {
  return db
    .prepare(
      `select * from APPLICATIONS where proposal_id = ? and student_id = ? and state = 'rejected'`,
    )
    .get(proposal_id, student_id);
};

/**
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
 *     title
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
                  APPLICATIONS.attached_file, 
                  STUDENT.name as student_name, 
                  STUDENT.surname as student_surname, 
                  TEACHER.name as teacher_name, 
                  TEACHER.surname as teacher_surname,
                  PROPOSALS.title as title
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
                  APPLICATIONS.attached_file,
                  STUDENT.name as student_name, 
                  STUDENT.surname as student_surname, 
                  TEACHER.name as teacher_name, 
                  TEACHER.surname as teacher_surname,
                  PROPOSALS.title as title
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

exports.getApplications = () => {
  return db
    .prepare(
      `select APPLICATIONS.id,
              APPLICATIONS.proposal_id,
              APPLICATIONS.student_id,
              APPLICATIONS.state,
              STUDENT.name as student_name,
              STUDENT.surname as student_surname,
              TEACHER.name as teacher_name,
              TEACHER.surname as teacher_surname,
              PROPOSALS.title as title
       from APPLICATIONS,
            PROPOSALS,
            STUDENT,
            TEACHER
       where APPLICATIONS.proposal_id = PROPOSALS.id
         and PROPOSALS.supervisor = TEACHER.id
         and APPLICATIONS.student_id = STUDENT.id`,
    )
    .all();
};

/**
 * Is the given application accepted?
 * @param proposal_id the proposal of the application
 * @param student_id the student who applied
 * @returns {boolean} accepted or not
 */
exports.isAccepted = (proposal_id, student_id) => {
  const accepted_proposal = db
    .prepare(
      `select * from main.APPLICATIONS 
      where APPLICATIONS.proposal_id = ?
        and APPLICATIONS.student_id = ?
        and APPLICATIONS.state = 'accepted'`,
    )
    .get(proposal_id, student_id);
  return accepted_proposal !== undefined;
};
