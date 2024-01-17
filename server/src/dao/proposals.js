"use strict";

const { db } = require("../db");
const dayjs = require("dayjs");
const { getDelta } = require("./virtual-clock");

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

exports.getProposalsForTeacher = (id, email) => {
  return db
    .prepare(
      "select * from PROPOSALS where (supervisor = ? or co_supervisors like '%' || ? || '%') and deleted = 0",
    )
    .all(id, email);
};

exports.getProposal = (id) => {
  return db.prepare("select * from PROPOSALS where id = ?").get(id);
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

exports.deleteProposal = (proposal_id) => {
  db.prepare("update PROPOSALS set deleted = 1 WHERE id = ?").run(proposal_id);
};

exports.updateArchivedStateProposal = (new_archived_state, proposal_id) => {
  db.prepare("update PROPOSALS set manually_archived = ? where id = ?").run(
    new_archived_state,
    proposal_id,
  );
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

exports.findAcceptedProposal = (proposal_id) => {
  return db
    .prepare(
      `select * from APPLICATIONS where proposal_id = ? and state = 'accepted'`,
    )
    .get(proposal_id);
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
