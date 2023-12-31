"use strict";

/* Data Access Object (DAO) module for accessing users */

const { db } = require("./db");
const { nodemailer } = require("./smtp");
const { applicationDecisionTemplate } = require("./mail/application-decision");
const { newApplicationTemplate } = require("./mail/new-application");
const { supervisorStartRequestTemplate } = require("./mail/supervisor-start-request");

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

exports.insertProposal = (proposal) => {
  const {
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
  } = proposal;
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
};

exports.insertPDFInApplication = (file, applicationId) => {
  return db
    .prepare(
      "update APPLICATIONS set attached_file = ? where main.APPLICATIONS.id = ?",
    )
    .run(file, applicationId);
};

exports.getExamsOfStudent = (id) => {
  return db.prepare("select * from main.CAREER where id = ?").all(id);
};

exports.insertStartRequest = (startRequest) => {
  const { title, description, supervisor, co_supervisors, studentId } =
    startRequest;
  return db
    .prepare(
      "insert into START_REQUESTS(title, description, supervisor, co_supervisors, student_id) values(?,?,?,?,?)",
    )
    .run(title, description, supervisor, co_supervisors, studentId)
    .lastInsertRowid;
};

exports.getNotRejectedStartRequest = (userId) => {
  return db
    .prepare(
      "SELECT * FROM START_REQUESTS WHERE student_id = ? AND status != 'rejected'",
    )
    .all(userId);
};

exports.updateStatusStartRequest = (new_status, request_id) => {
  return db
    .prepare("update START_REQUESTS set status = ? where id = ?")
    .run(new_status, request_id);
};

exports.getStatusStartRequest = (id) => {
  return db.prepare("SELECT status FROM START_REQUESTS WHERE id = ?").get(id);
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
  return db.prepare("select * from PROPOSALS where supervisor = ? and deleted = 0").all(id);
};

exports.getTeacher = (id) => {
  return db.prepare("select * from TEACHER where id = ?").get(id);
};

exports.getCds = (cds) => {
  return db.prepare("select * from DEGREE where cod_degree = ?").get(cds);
};

exports.getTeacherByEmail = (email) => {
  return db.prepare("select * from TEACHER where email = ?").get(email);
};

exports.getTeacherEmailById = (id) => {
  return db.prepare("select email from TEACHER where id = ?").get(id);
};

exports.getTeachers = () => {
  return db.prepare("select * from TEACHER").all();
};

exports.getProposal = (id) => {
  return db.prepare("select * from PROPOSALS where id = ?").get(id);
};

exports.getStudent = (id) => {
  return db.prepare("select * from STUDENT where id = ?").get(id);
};

exports.getStudentByEmail = (email) => {
  return db.prepare("select * from STUDENT where email = ?").get(email);
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
};

exports.deleteApplication = (student_id, proposal_id) => {
  db.prepare(
    "delete from APPLICATIONS where student_id = ? and proposal_id = ?",
  ).run(student_id, proposal_id);
};

exports.deleteApplicationsOfStudent = (student_id) => {
  db.prepare("delete from APPLICATIONS where student_id = ?").run(student_id);
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
      WHERE cds = ? AND deleted = 0 AND id NOT IN (
        SELECT proposal_id
        FROM APPLICATIONS
        WHERE state = 'accepted' AND proposal_id IS NOT NULL
      )`,
    )
    .all(cds);
};

exports.cancelPendingApplications = (of_proposal) => {
  db.prepare(
    "update APPLICATIONS set state = 'canceled' where proposal_id = ? AND state = 'pending'",
  ).run(of_proposal);
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

exports.findAcceptedProposal = (proposal_id) => {
  return db
    .prepare(
      `select * from APPLICATIONS where proposal_id = ? and state = 'accepted'`,
    )
    .get(proposal_id);
};

exports.findRejectedApplication = (proposal_id, student_id) => {
  return db
    .prepare(
      `select * from APPLICATIONS where proposal_id = ? and student_id = ? and state = 'rejected'`,
    )
    .get(proposal_id, student_id);
};

exports.notifyApplicationDecision = async (applicationId, decision) => {
  // Send email to a student
  const applicationJoined = db
    .prepare(
      `SELECT S.id, P.title, S.email, S.surname, S.name
    FROM APPLICATIONS A
    JOIN PROPOSALS P ON P.id = A.proposal_id
    JOIN STUDENT S ON S.id = A.student_id
    WHERE A.id = ?`,
    )
    .get(applicationId);
  const mailBody = applicationDecisionTemplate({
    name: applicationJoined.surname + " " + applicationJoined.name,
    thesis: applicationJoined.title,
    decision: decision,
  });
  try {
    await nodemailer.sendMail({
      to: applicationJoined.email,
      subject: "New decision on your thesis application",
      text: mailBody.text,
      html: mailBody.html,
    });
  } catch (e) {
    console.log("[mail service]", e);
  }

  // Save email in DB
  db.prepare(
    "INSERT INTO NOTIFICATIONS(student_id, object, content) VALUES(?,?,?)",
  ).run(
    applicationJoined.id,
    "New decision on your thesis application",
    mailBody.text,
  );
};

exports.notifyNewStartRequest = async (requestId) => {
  // Send email to the supervisor
  const requestJoined = db
    .prepare(
      `SELECT S.student_id, S.supervisor, T.name, T.surname
      FROM START_REQUESTS S
      JOIN TEACHER T ON T.id = S.supervisor
      WHERE S.id = ?`,
    ).get(requestId);
  console.log(requestJoined);
  const mailBody = supervisorStartRequestTemplate({
    name: requestJoined.surname + " " + requestJoined.name,
    student: requestJoined.student_id,
  });
  try {
    await nodemailer.sendMail({
      to: requestJoined.email,
      subject: "New start request",
      text: mailBody.text,
      html: mailBody.html,
    });
  } catch (e) {
    console.log("[mail service]", e);
  }

  // Save email in DB
  db.prepare(
    "INSERT INTO NOTIFICATIONS(teacher_id, object, content) VALUES(?,?,?)",
  ).run(requestJoined.supervisor, "New start request", mailBody.text);
};

exports.notifyNewApplication = async (proposalId) => {
  // Send email to the supervisor
  const proposalJoined = db
    .prepare(
      `SELECT P.title, T.id, T.email, T.surname, T.name
      FROM PROPOSALS P
      JOIN TEACHER T ON T.id = P.supervisor
      WHERE P.id = ?`,
    )
    .get(proposalId);
  const mailBody = newApplicationTemplate({
    name: proposalJoined.surname + " " + proposalJoined.name,
    thesis: proposalJoined.title,
  });
  try {
    await nodemailer.sendMail({
      to: proposalJoined.email,
      subject: "New application on your thesis proposal",
      text: mailBody.text,
      html: mailBody.html,
    });
  } catch (e) {
    console.log("[mail service]", e);
  }

  // Save email in DB
  db.prepare(
    "INSERT INTO NOTIFICATIONS(teacher_id, object, content) VALUES(?,?,?)",
  ).run(
    proposalJoined.id,
    "New application on your thesis proposal",
    mailBody.text,
  );
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

exports.getProposals = () => {
  return db.prepare("select * from PROPOSALS").all();
};

exports.getNotifications = (user_id) => {
  return db
    .prepare(
      "SELECT * FROM NOTIFICATIONS WHERE student_id = ? OR teacher_id = ?",
    )
    .all(user_id, user_id);
};

exports.deleteProposal = (proposal_id) => {
  db.prepare("update PROPOSALS set deleted = 1 WHERE id = ?").run(proposal_id);
};

exports.updateArchivedStateProposal = (new_archived_state, proposal_id) => {
  db.prepare("update PROPOSALS set manually_archived = ? where id = ?").run(
    new_archived_state,
    proposal_id,
  );
};

exports.getDelta = () => {
  return db.prepare("select delta from VIRTUAL_CLOCK where id = 1").get();
};

exports.setDelta = (delta) => {
  return db
    .prepare("UPDATE VIRTUAL_CLOCK SET delta = ? WHERE id = 1")
    .run(delta);
};

exports.updateProposal = (proposal) => {
  const {
    proposal_id,
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
  } = proposal;
  return db
    .prepare(
      "UPDATE PROPOSALS SET title = ?, supervisor = ?, co_supervisors = ?, keywords = ?, type = ?, groups = ?, description = ?, required_knowledge = ?, notes = ?, expiration_date = ?, level = ?, cds = ? WHERE id = ?",
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
      proposal_id,
    );
};

exports.getRequestForClerk = () => {
  return db.prepare("select * from START_REQUESTS").all();
};
