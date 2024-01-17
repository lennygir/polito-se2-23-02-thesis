"use strict";

/* Data Access Object (DAO) module for accessing users */

const { db } = require("./db");
const { nodemailer } = require("./smtp");
const { applicationDecisionTemplate } = require("./mail/application-decision");
const { newApplicationTemplate } = require("./mail/new-application");

const dayjs = require("dayjs");
const { proposalExpirationTemplate } = require("./mail/proposal-expiration");
const { supervisorStartRequestTemplate } = require("./mail/supervisor-start-request");
const { cosupervisorApplicationDecisionTemplate } = require("./mail/cosupervisor-application-decision");
const { cosupervisorStartRequestTemplate } = require("./mail/cosupervisor-start-request");
const { removedCosupervisorTemplate } = require("./mail/removed-cosupervisor");
const { addedCosupervisorTemplate } = require("./mail/added-cosupervisor");

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
      "SELECT * FROM START_REQUESTS WHERE student_id = ? AND status != 'secretary_rejected' and status != 'teacher_rejected'",
    )
    .all(userId);
};

exports.updateStatusOfStartRequest = (new_status, request_id) => {
  return db
    .prepare("update START_REQUESTS set status = ? where id = ?")
    .run(new_status, request_id);
};

exports.setChangesRequestedOfStartRequest = (new_changes, request_id) => {
  return db
    .prepare("update START_REQUESTS set changes_requested = ? where id = ?")
    .run(new_changes, request_id);
};

exports.setApprovalDateOfRequest = (new_date, request_id) => {
  return db
    .prepare("update START_REQUESTS set approval_date = ? where id = ?")
    .run(new_date, request_id);
};

exports.getStatusStartRequest = (id) => {
  return db.prepare("SELECT status FROM START_REQUESTS WHERE id = ?").get(id);
};

exports.getSupervisorStartRequest = (id) => {
  return db
    .prepare("SELECT supervisor FROM START_REQUESTS WHERE id = ?")
    .get(id);
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

exports.getProposalsForTeacher = (id, email) => {
  return db
    .prepare(
      "select * from PROPOSALS where (supervisor = ? or co_supervisors like '%' || ? || '%') and deleted = 0",
    )
    .all(id, email);
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

exports.getAcceptedProposal = (student_id) => {
  return db
    .prepare(
      `select PROPOSALS.id, PROPOSALS.title, PROPOSALS.supervisor, PROPOSALS.co_supervisors, PROPOSALS.keywords, PROPOSALS.type, PROPOSALS.groups, PROPOSALS.description, PROPOSALS.required_knowledge, PROPOSALS.notes, PROPOSALS.expiration_date, PROPOSALS.level, PROPOSALS.cds, PROPOSALS.manually_archived, PROPOSALS.deleted
                     from main.PROPOSALS, main.APPLICATIONS 
                     where APPLICATIONS.proposal_id = PROPOSALS.id and 
                         APPLICATIONS.student_id = ? and 
                         APPLICATIONS.state = 'accepted'`,
    )
    .get(student_id);
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

exports.getStartedThesisRequest = (student_id) => {
  return db
    .prepare(
      "select * from main.START_REQUESTS where student_id = ? and status = 'started'",
    )
    .get(student_id);
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
  // Retrieve the data
  const applicationJoined = db
    .prepare(
      `SELECT S.id, P.title, P.co_supervisors, S.email, S.surname, S.name
    FROM APPLICATIONS A
    JOIN PROPOSALS P ON P.id = A.proposal_id
    JOIN STUDENT S ON S.id = A.student_id
    WHERE A.id = ?`,
    )
    .get(applicationId);
  let mailBody;
  // Notify the student
  // -- Email
  mailBody = applicationDecisionTemplate({
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
  // -- Website notification
  db.prepare(
    "INSERT INTO NOTIFICATIONS(student_id, object, content) VALUES(?,?,?)",
  ).run(
    applicationJoined.id,
    "New decision on your thesis application",
    mailBody.text,
  );
  // Notify the co-supervisors
  if (applicationJoined.co_supervisors) {
    for (const cosupervisor of applicationJoined.co_supervisors.split(", ")) {
      const fullCosupervisor = this.getTeacherByEmail(cosupervisor);
      // -- Email
      mailBody = cosupervisorApplicationDecisionTemplate({
        name: fullCosupervisor.surname + " " + fullCosupervisor.name,
        thesis: applicationJoined.title,
        decision: decision,
      });
      try {
        await nodemailer.sendMail({
          to: cosupervisor,
          subject: "New decision for a thesis you co-supervise",
          text: mailBody.text,
          html: mailBody.html,
        });
      } catch (e) {
        console.log("[mail service]", e);
      }
      // -- Website notification
      db.prepare(
        "INSERT INTO NOTIFICATIONS(teacher_id, object, content) VALUES(?,?,?)",
      ).run(
        fullCosupervisor.id,
        "New decision for a thesis you co-supervise",
        mailBody.text,
      );
    }
  }
};

exports.notifyNewStartRequest = async (requestId) => {
  const requestJoined = db
    .prepare(
      `SELECT S.student_id, S.supervisor, S.co_supervisors, T.name, T.surname
      FROM START_REQUESTS S
      JOIN TEACHER T ON T.id = S.supervisor
      WHERE S.id = ?`,
    )
    .get(requestId);
  // Send email to the supervisor
  let mailBody = supervisorStartRequestTemplate({
    name: requestJoined.surname + " " + requestJoined.name,
    student: requestJoined.student_id,
  });
  const teacher = this.getTeacherEmailById(requestJoined.supervisor);
  try {
    await nodemailer.sendMail({
      to: teacher.email,
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

  // Send email to the co-supervisors
  if (requestJoined.co_supervisors) {
    const coSupervisors = requestJoined.co_supervisors.split(", ");
    for (const coSupervisorEmail of coSupervisors) {
      const coSupervisor = this.getTeacherByEmail(coSupervisorEmail);
      mailBody = cosupervisorStartRequestTemplate({
        name: coSupervisor.surname + " " + coSupervisor.name,
        student: requestJoined.student_id,
      });
      try {
        await nodemailer.sendMail({
          to: coSupervisorEmail,
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
      ).run(coSupervisor.id, "New start request", mailBody.text);
    }
  }
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

exports.notifyProposalExpiration = async (proposal) => {
  // Send email to the supervisor
  const mailBody = proposalExpirationTemplate({
    name: proposal.teacher_surname + " " + proposal.teacher_name,
    thesis: proposal.title,
    nbOfDays: 7,
    date: dayjs(proposal.expiration_date).format("DD/MM/YYYY"),
  });
  try {
    await nodemailer.sendMail({
      to: proposal.teacher_email,
      subject: "Your proposal expires in 7 days",
      text: mailBody.text,
      html: mailBody.html,
    });
  } catch (e) {
    console.log("[mail service]", e);
  }

  // Save email in DB
  db.prepare(
    "INSERT INTO NOTIFICATIONS(teacher_id, object, content, date) VALUES(?,?,?, DATETIME(DATETIME('now'), '+' || (select delta from VIRTUAL_CLOCK where id = 1) || ' days'))",
  ).run(proposal.supervisor, "Your proposal expires in 7 days", mailBody.text);
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

/**
 * @param nbOfDaysBeforeExpiration
 * @returns {[
 *   {
 *     supervisor,
 *     expiration_date,
 *     title
 *   }
 * ]}
 */
exports.getProposalsThatExpireInXDays = (nbOfDaysBeforeExpiration) => {
  const currentDate = dayjs().add(getDelta().delta, "day");
  const notificationDateFormatted = currentDate
    .add(nbOfDaysBeforeExpiration, "day")
    .format("YYYY-MM-DD");
  return db
    .prepare(
      `select supervisor, 
          t.surname as teacher_surname,
          t.email as teacher_email,
          t.name as teacher_name,
          expiration_date,
          title
        from PROPOSALS p
          join TEACHER t on p.supervisor = t.id
        where expiration_date = ?`,
    )
    .all(notificationDateFormatted);
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

const getDelta = () => {
  return db.prepare("select delta from VIRTUAL_CLOCK where id = 1").get();
};
exports.getDelta = getDelta;

exports.setDelta = (delta) => {
  return db
    .prepare("UPDATE VIRTUAL_CLOCK SET delta = ? WHERE id = 1")
    .run(delta);
};

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

function getCosupervisorsFromProposal(proposal) {
  return proposal.co_supervisors ? proposal.co_supervisors.split(", ") : [];
}

function getArrayDifference(arrayIn, arrayNotIn) {
  return arrayIn.filter((el) => !arrayNotIn.includes(el));
}

exports.notifyRemovedCosupervisors = async (oldProposal, newProposal) => {
  const oldCosupervisors = getCosupervisorsFromProposal(oldProposal);
  const newCosupervisors = getCosupervisorsFromProposal(newProposal);
  if(oldCosupervisors && newCosupervisors) {
    const removedCosupervisors = getArrayDifference(oldCosupervisors, newCosupervisors);
    for(let cosupervisorEmail of removedCosupervisors) {
      const teacher = this.getTeacherByEmail(cosupervisorEmail);
      if(teacher) {
        // -- Email
        const mailBody = removedCosupervisorTemplate({
          name: teacher.surname + " " + teacher.name,
          proposal: newProposal
        });
        try {
          await nodemailer.sendMail({
            to: cosupervisorEmail,
            subject: "You have been removed from a thesis proposal",
            text: mailBody.text,
            html: mailBody.html,
          });
        } catch (e) {
          console.log("[mail service]", e);
        }
        // -- Website notification
        db.prepare(
          "INSERT INTO NOTIFICATIONS(teacher_id, object, content) VALUES(?,?,?)",
        ).run(
          teacher.id,
          "You have been removed from a thesis proposal",
          mailBody.text,
        );
      }
    }
  }
};

exports.notifyAddedCosupervisors = async (oldProposal, newProposal) => {
  const oldCosupervisors = getCosupervisorsFromProposal(oldProposal);
  const newCosupervisors = getCosupervisorsFromProposal(newProposal);
  if(oldCosupervisors && newCosupervisors) {
    const addedCosupervisors = getArrayDifference(newCosupervisors, oldCosupervisors);
    for(let cosupervisorEmail of addedCosupervisors) {
      const teacher = this.getTeacherByEmail(cosupervisorEmail);
      if(teacher) {
        // -- Email
        const mailBody = addedCosupervisorTemplate({
          name: teacher.surname + " " + teacher.name,
          proposal: newProposal
        });
        try {
          await nodemailer.sendMail({
            to: cosupervisorEmail,
            subject: "You have been added to a thesis proposal",
            text: mailBody.text,
            html: mailBody.html,
          });
        } catch (e) {
          console.log("[mail service]", e);
        }
        // -- Website notification
        db.prepare(
          "INSERT INTO NOTIFICATIONS(teacher_id, object, content) VALUES(?,?,?)",
        ).run(
          teacher.id,
          "You have been added to a thesis proposal",
          mailBody.text,
        );
      }
    }
  }
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

/**
 * NOTE: Sets also the status of the request to `changed` and the field `changes_requested` to `NULL`
 * @param id
 * @param new_fields
 * @returns {Database.RunResult}
 */
exports.updateStartRequest = (id, new_fields) => {
  const { title, description, supervisor, co_supervisors } = new_fields;
  return db
    .prepare(
      "UPDATE START_REQUESTS SET title = ?, description = ?, supervisor = ?, co_supervisors = ?, status = 'changed' WHERE id = ?",
    )
    .run(title, description, supervisor, co_supervisors, id);
};

exports.getRequests = () => {
  return db.prepare("select * from START_REQUESTS").all();
};

exports.getRequestById = (id) => {
  return db.prepare("SELECT * FROM START_REQUESTS WHERE id=?").get(id);
};

exports.getRequestsForTeacher = (id, email) => {
  return db
    .prepare(
      `select * from START_REQUESTS 
      where (supervisor = ? or co_supervisors LIKE '%' || ? || '%') 
        and status != 'secretary_rejected' 
        and status != 'requested'`,
    )
    .all(id, email);
};

exports.getRequestsForClerk = () => {
  return db.prepare("select * from main.START_REQUESTS").all();
};

exports.getRequestsForStudent = (id) => {
  return db
    .prepare("select * from main.START_REQUESTS where student_id = ?")
    .all(id);
};
