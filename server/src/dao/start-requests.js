"use strict";

const { db } = require("../db");

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

exports.getStartedThesisRequest = (student_id) => {
  return db
    .prepare(
      "select * from main.START_REQUESTS where student_id = ? and status = 'started'",
    )
    .get(student_id);
};

/**
 * NOTE: Sets also the status of the request to `changed`
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
