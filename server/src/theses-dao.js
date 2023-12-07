"use strict";

/* Data Access Object (DAO) module for accessing users */

const { db } = require("./db");
const { nodemailer } = require("./smtp");
const { applicationDecisionTemplate } = require("./mail/application-decision");

exports.insertApplication = (proposal, student, state) => {
  db.prepare(
    "insert into APPLICATIONS(proposal_id, student_id, state) values (?,?,?)"
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
  return db
    .prepare(
      "select * from APPLICATIONS where student_id = ? and state = 'accepted'"
    )
    .get(student_id);
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
  cds
) => {
  return db
    .prepare(
      "insert into PROPOSAlS(title, supervisor, co_supervisors, keywords, type, groups, description, required_knowledge, notes, expiration_date, level, cds) values(?,?,?,?,?,?,?,?,?,?,?,?)"
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
      cds
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
      "select * from APPLICATIONS where student_id = ? and proposal_id = ?"
    )
    .get(student_id, proposal_id);
};

exports.getProposalsBySupervisor = (id) => {
  return db.prepare("select * from PROPOSALS where supervisor = ?").all(id);
};

exports.getTeacher = (id) => {
  return db.prepare("select * from TEACHER where id = ?").get(id);
};

exports.getTeacherByEmail = (email) => {
  return db.prepare("select * from TEACHER where email = ?").get(email);
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
      `select * from APPLICATIONS where proposal_id = ? and state = 'accepted'`
    )
    .get(proposal_id);
};

exports.getGroup = (cod_group) => {
  return db.prepare("select * from GROUPS where cod_group = ?").get(cod_group);
};

exports.deleteApplication = (student_id, proposal_id) => {
  db.prepare(
    "delete from APPLICATIONS where student_id = ? and proposal_id = ?"
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
      WHERE cds = ? AND id NOT IN (
        SELECT proposal_id
        FROM APPLICATIONS
        WHERE state = 'accepted' AND proposal_id IS NOT NULL
      )`
    )
    .all(cds);
};

exports.cancelPendingApplications = (of_proposal) => {
  db.prepare(
    "update APPLICATIONS set state = 'canceled' where proposal_id = ? AND state = 'pending'"
  ).run(of_proposal);
};

exports.updateApplication = (id, state) => {
  db.prepare("update APPLICATIONS set state = ? where id = ?").run(state, id);
};

exports.getPendingOrAcceptedApplicationsOfStudent = (student_id) => {
  return db
    .prepare(
      `select * from APPLICATIONS where student_id = ? and (state = 'accepted' or state = 'pending')`
    )
    .all(student_id);
};

exports.findAcceptedProposal = (proposal_id) => {
  return db
    .prepare(
      `select * from APPLICATIONS where proposal_id = ? and state = 'accepted'`
    )
    .get(proposal_id);
};

exports.findRejectedApplication = (proposal_id, student_id) => {
  return db
    .prepare(
      `select * from APPLICATIONS where proposal_id = ? and student_id = ? and state = 'rejected'`
    )
    .get(proposal_id, student_id);
};

exports.notifyApplicationDecision = async (applicationId, decision) => {
  // Send email to student
  const applicationJoined = db
    .prepare(
      "SELECT S.id, P.title, S.email, S.surname, S.name \
    FROM APPLICATIONS A \
    JOIN PROPOSALS P ON P.id = A.proposal_id \
    JOIN STUDENT S ON S.id = A.student_id \
    WHERE A.id = ?"
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
    "INSERT INTO NOTIFICATIONS(student_id, object, content) VALUES(?,?,?)"
  ).run(
    applicationJoined.id,
    "New decision on your thesis application",
    mailBody.text
  );
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
         and PROPOSALS.supervisor = ?`
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
                  TEACHER.surname as teacher_surname,
                  PROPOSALS.title as title
       from APPLICATIONS,
            PROPOSALS,
            STUDENT,
            TEACHER
       where APPLICATIONS.proposal_id = PROPOSALS.id
         and PROPOSALS.supervisor = TEACHER.id
         and APPLICATIONS.student_id = STUDENT.id
         and APPLICATIONS.student_id = ?`
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
         and APPLICATIONS.student_id = STUDENT.id`
    )
    .all();
};

exports.getProposals = () => {
  return db.prepare("select * from PROPOSALS").all();
};

exports.getNotificationsOfStudent = (student_id) => {
  return db
    .prepare("SELECT * FROM NOTIFICATIONS WHERE student_id = ?")
    .all(student_id);
};

exports.deleteProposal = (proposal_id) => {
  db.prepare("DELETE FROM PROPOSALS WHERE id = ?").run(proposal_id);
};

/*exports.updateProposal = (id, setValues) => {

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
}*/

exports.updateProposal = (
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
  cds
) => {
  return db
    .prepare(
      "UPDATE PROPOSALS SET title = ?, supervisor = ?, co_supervisors = ?, keywords = ?, type = ?, groups = ?, description = ?, required_knowledge = ?, notes = ?, expiration_date = ?, level = ?, cds = ? WHERE id = ?"
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
      proposal_id
    );
};

exports.getDelta = () => {
  return db.prepare("select delta from VIRTUAL_CLOCK where id = 1").get();
};

exports.setDelta = (delta) => {
  return db.prepare("UPDATE VIRTUAL_CLOCK SET delta = ? WHERE id = 1").run(delta);
};

