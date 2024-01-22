"use strict";

const { db } = require("../db");
const { nodemailer } = require("../smtp");
const { applicationDecisionTemplate } = require("../mail/application-decision");
const { newApplicationTemplate } = require("../mail/new-application");
const dayjs = require("dayjs");
const { proposalExpirationTemplate } = require("../mail/proposal-expiration");
const {
  supervisorStartRequestTemplate,
} = require("../mail/supervisor-start-request");
const {
  cosupervisorApplicationDecisionTemplate,
} = require("../mail/cosupervisor-application-decision");
const {
  cosupervisorStartRequestTemplate,
} = require("../mail/cosupervisor-start-request");
const { removedCosupervisorTemplate } = require("../mail/removed-cosupervisor");
const { getTeacherByEmail, getTeacherEmailById } = require("./user");
const {
  getCosupervisorsFromProposal,
  getArrayDifference,
} = require("./dao_utils/utils");
const {
  changesStartRequestStudentTemplate,
} = require("../mail/changes-start-request-student");
const { addedCosupervisorTemplate } = require("../mail/added-cosupervisor");

/**
 * @typedef {Object} Notification
 * @property {number} id - the id of the notification
 * @property {string} date - timestamp
 * @property {string} object - object of the notification
 * @property {string} content - the body of the notification
 * @property {string} student_id - id of the user (student)
 * @property {string} teacher_id - id of the user (teacher)
 * @property {boolean} read - if the notification is read or not
 */

exports.getExamsOfStudent = (id) => {
  return db.prepare("select * from main.CAREER where id = ?").all(id);
};

exports.getGroup = (cod_group) => {
  return db.prepare("select * from GROUPS where cod_group = ?").get(cod_group);
};

exports.getGroups = () => {
  return db.prepare("select cod_group from GROUPS").all();
};

exports.getDegrees = () => {
  return db.prepare("select cod_degree, title_degree from DEGREE").all();
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
    "INSERT INTO NOTIFICATIONS(student_id, object, content, date) VALUES(?,?,?, DATETIME(DATETIME('now'), '+' || (select delta from VIRTUAL_CLOCK where id = 1) || ' days'))",
  ).run(
    applicationJoined.id,
    "New decision on your thesis application",
    mailBody.text,
  );
  // Notify the co-supervisors
  if (applicationJoined.co_supervisors) {
    for (const cosupervisor of applicationJoined.co_supervisors.split(", ")) {
      const fullCosupervisor = getTeacherByEmail(cosupervisor);
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
        "INSERT INTO NOTIFICATIONS(teacher_id, object, content, date) VALUES(?,?,?, DATETIME(DATETIME('now'), '+' || (select delta from VIRTUAL_CLOCK where id = 1) || ' days'))",
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
  const teacher = getTeacherEmailById(requestJoined.supervisor);
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
    "INSERT INTO NOTIFICATIONS(teacher_id, object, content, date) VALUES(?,?,?, DATETIME(DATETIME('now'), '+' || (select delta from VIRTUAL_CLOCK where id = 1) || ' days'))",
  ).run(requestJoined.supervisor, "New start request", mailBody.text);

  // Send email to the co-supervisors
  if (requestJoined.co_supervisors) {
    const coSupervisors = requestJoined.co_supervisors.split(", ");
    for (const coSupervisorEmail of coSupervisors) {
      const coSupervisor = getTeacherByEmail(coSupervisorEmail);
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
        "INSERT INTO NOTIFICATIONS(teacher_id, object, content, date) VALUES(?,?,?, DATETIME(DATETIME('now'), '+' || (select delta from VIRTUAL_CLOCK where id = 1) || ' days'))",
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

  // Save email in DB
  db.prepare(
    "INSERT INTO NOTIFICATIONS(teacher_id, object, content, date) VALUES(?,?,?, DATETIME(DATETIME('now'), '+' || (select delta from VIRTUAL_CLOCK where id = 1) || ' days'))",
  ).run(
    proposalJoined.id,
    "New application on your thesis proposal",
    mailBody.text,
  );

  // Send email to the supervisor
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
};

exports.notifyChangesRequestedOnStartRequest = async (
  message,
  startRequestId,
) => {
  // Send email to the supervisor
  const startRequestJoined = db
    .prepare(
      `SELECT SR.title, S.id, S.email, S.surname, S.name
      FROM START_REQUESTS SR
      JOIN STUDENT S ON S.id = SR.student_id
      WHERE SR.id = ?`,
    )
    .get(startRequestId);
  const mailBody = changesStartRequestStudentTemplate({
    name: startRequestJoined.surname + " " + startRequestJoined.name,
    startRequest: startRequestJoined.title,
    changes: message,
  });
  try {
    await nodemailer.sendMail({
      to: startRequestJoined.email,
      subject: "Your start request requires changes",
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
    startRequestJoined.id,
    "Your start request requires changes",
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

exports.getNotifications = (user_id) => {
  return db
    .prepare(
      "SELECT * FROM NOTIFICATIONS WHERE student_id = ? OR teacher_id = ?",
    )
    .all(user_id, user_id);
};

/**
 * Gets the notifications with the provided id
 * @param {number} id id of the notification
 * @returns {Notification} - the notification with the id
 */
exports.getNotification = (id) => {
  return db.prepare("select * from main.NOTIFICATIONS where id = ?").get(id);
};

/**
 * Sets the notification to read
 * @param {number} id - the notification's id
 */
exports.readNotification = (id) => {
  db.prepare(
    "update NOTIFICATIONS set read = ? where main.NOTIFICATIONS.id = ?",
  ).run(1, id);
};

exports.notifyRemovedCosupervisors = async (oldProposal, newProposal) => {
  const oldCosupervisors = getCosupervisorsFromProposal(oldProposal);
  const newCosupervisors = getCosupervisorsFromProposal(newProposal);
  if (oldCosupervisors && newCosupervisors) {
    const removedCosupervisors = getArrayDifference(
      oldCosupervisors,
      newCosupervisors,
    );
    for (let cosupervisorEmail of removedCosupervisors) {
      const teacher = getTeacherByEmail(cosupervisorEmail);
      if (teacher) {
        // -- Email
        const mailBody = removedCosupervisorTemplate({
          name: teacher.surname + " " + teacher.name,
          proposal: newProposal,
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
          "INSERT INTO NOTIFICATIONS(teacher_id, object, content, date) VALUES(?,?,?, DATETIME(DATETIME('now'), '+' || (select delta from VIRTUAL_CLOCK where id = 1) || ' days'))",
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
  if (oldCosupervisors && newCosupervisors) {
    const addedCosupervisors = getArrayDifference(
      newCosupervisors,
      oldCosupervisors,
    );
    for (let cosupervisorEmail of addedCosupervisors) {
      const teacher = getTeacherByEmail(cosupervisorEmail);
      if (teacher) {
        // -- Email
        const mailBody = addedCosupervisorTemplate({
          name: teacher.surname + " " + teacher.name,
          proposal: newProposal,
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
          "INSERT INTO NOTIFICATIONS(teacher_id, object, content, date) VALUES(?,?,?, DATETIME(DATETIME('now'), '+' || (select delta from VIRTUAL_CLOCK where id = 1) || ' days'))",
        ).run(
          teacher.id,
          "You have been added to a thesis proposal",
          mailBody.text,
        );
      }
    }
  }
};
