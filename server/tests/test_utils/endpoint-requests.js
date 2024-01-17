// noinspection UnnecessaryLocalVariableJS

"use strict";

const isLoggedIn = require("../../src/routes_utils/protect-routes");
const request = require("supertest");
const { app } = require("../../src/server");
const dayjs = require("dayjs");

/**
 * Mocks the login system of the application
 * @param email
 */
exports.logIn = function (email) {
  isLoggedIn.mockImplementation((req, res, next) => {
    req.user = {
      email: email,
    };
    next();
  });
};

/**
 * Mocks the login system of the application;
 * specifically, it simulates a wrong login attempt
 */
exports.unauthorizedLogIn = function () {
  isLoggedIn.mockImplementation((req, res) => {
    return res.status(401).json({ message: "Unauthorized" });
  });
};

/**
 * Calls the POST "/api/proposals"
 * @param proposal the body of the request
 * @returns {Promise<Response>}
 */
exports.insertProposal = async function (proposal) {
  const response = await request(app)
    .post("/api/proposals")
    .set("Content-Type", "application/json")
    .send(proposal);
  return response;
};

/**
 * Calls the GET "/api/proposals"
 * @returns {Promise<Response>}
 */
exports.getProposals = async function () {
  const response = await request(app).get("/api/proposals");
  return response;
};

/**
 * Calls the PATCH "/api/proposals/proposal_id"
 * @param proposal_id the id of the proposal to be archived
 * @returns {Promise<Response>}
 */
exports.archiveProposal = async function (proposal_id) {
  const response = await request(app)
    .patch(`/api/proposals/${proposal_id}`)
    .set("Content-Type", "application/json")
    .send({
      archived: true,
    });
  return response;
};

/**
 * Calls the POST "/api/applications"
 * @param proposal_id the id of the proposal to be archived
 * @returns {Promise<Response>}
 */
exports.applyForProposal = async function (proposal_id) {
  const response = await request(app)
    .post("/api/applications")
    .set("Content-Type", "application/json")
    .send({
      proposal: proposal_id,
    });
  return response;
};

/**
 * Calls the GET "/api/applications"
 * @returns {Promise<Response>}
 */
exports.getApplications = async function () {
  const response = await request(app).get("/api/applications");
  return response;
};

/**
 * Calls the PATCH "/api/application/application_id"
 * @param application_id the application to be rejected
 * @returns {Promise<Response>} the response of the request
 */
exports.rejectApplication = async function (application_id) {
  const response = await request(app)
    .patch(`/api/applications/${application_id}`)
    .set("Content-Type", "application/json")
    .send({
      state: "rejected",
    });
  return response;
};

/**
 * Calls the PATCH "/api/application/application_id"
 * @param application_id
 * @returns {Promise<Response>}
 */
exports.acceptApplication = async function (application_id) {
  const response = await request(app)
    .patch(`/api/applications/${application_id}`)
    .set("Content-Type", "application/json")
    .send({
      state: "accepted",
    });
  return response;
};

/**
 * Calls the PUT "/api/proposals/proposal_id"
 * @param proposal_id
 * @param content
 * @returns {Promise<Response>}
 */
exports.modifyProposal = async function (proposal_id, content) {
  const response = await request(app)
    .put(`/api/proposals/${proposal_id}`)
    .set("Content-Type", "application/json")
    .send(content);
  return response;
};

/**
 * Calls PATCH "/api/applications/application_id"
 * @param pdf the raw pdf to be uploaded
 * @param application_id the application you want to upload your pdf to
 * @returns {Promise<Response>} the response of the request
 */
exports.uploadPDFToApplication = async function (pdf, application_id) {
  const response = await request(app)
    .patch(`/api/applications/${application_id}`)
    .set("Content-Type", "application/pdf")
    .send(pdf);
  return response;
};

/**
 * Calls GET "/api/applications/application_id/attached-file
 * @param application_id the application you want to retrieve the pdf from
 * @returns {Promise<Response>} the response of the request
 */
exports.retrievePDFFromApplication = async function (application_id) {
  const response = await request(app).get(
    `/api/applications/${application_id}/attached-file`,
  );
  return response;
};

/**
 * Calls DELETE "/api/proposals/proposal_id"
 * @param proposal_id the proposal to be deleted
 * @returns {Promise<Response>} the response of the request
 */
exports.deleteProposal = async function (proposal_id) {
  const response = await request(app).delete(`/api/proposals/${proposal_id}`);
  return response;
};

/**
 * Calls GET "/api/notifications"
 * @returns {Promise<Response>} the response of the request
 */
exports.getNotifications = async function () {
  const response = await request(app).get(`/api/notifications`);
  return response;
};

/**
 * Calls PATCH "/api/virtualClock"
 * @param days the number of days to add to the clock
 * @returns {Promise<Response>} the response of the request
 */
exports.setClock = async function (days) {
  const response = await request(app)
    .patch(`/api/virtualClock`)
    .set("Content-Type", "application/json")
    .send({
      date: dayjs().add(days, "day").format("YYYY-MM-DD"),
    });
  return response;
};

/**
 * Calls POST "/api/start-requests"
 * @param request_details the fields of the start request
 * @returns {Promise<Response>} the response of the request
 */
exports.startRequest = async function (request_details) {
  const response = await request(app)
    .post("/api/start-requests")
    .set("Content-Type", "application/json")
    .send(request_details);
  return response;
};

/**
 * Calls PUT "/api/start-requests/request_id"
 * @param request_id the id of the request to be changed
 * @param request_details the fields of the start request
 * @returns {Promise<Response>} the response of the request
 */
exports.modifyRequest = async function (request_id, request_details) {
  const response = await request(app)
    .put(`/api/start-requests/${request_id}`)
    .set("Content-Type", "application/json")
    .send(request_details);
  return response;
};

/**
 * Calls GET "/api/start-requests"
 * @returns {Promise<Response>} the response of the request
 */
exports.getRequests = async function () {
  const response = await request(app).get("/api/start-requests");
  return response;
};

/**
 * Calls PATCH "/api/start-requests/request_id"
 * @param request_id the request to be accepted
 * @returns {Promise<Response>} the response of the request
 */
exports.approveRequest = async function (request_id) {
  const response = await request(app)
    .patch(`/api/start-requests/${request_id}`)
    .set("Content-Type", "application/json")
    .send({
      decision: "approved",
    });
  return response;
};

/**
 * Calls PATCH "/api/start-requests/request_id"
 * @param request_id the request to be rejected
 * @returns {Promise<Response>} the response of the request
 */
exports.rejectRequest = async function (request_id) {
  const response = await request(app)
    .patch(`/api/start-requests/${request_id}`)
    .set("Content-Type", "application/json")
    .send({
      decision: "rejected",
    });
  return response;
};

/**
 * Calls PATCH "/api/start-requests/request_id"
 * @param request_id the request to be evaluated
 * @returns {Promise<Response>} the response of the request
 */
exports.requestChangesForRequest = async function (request_id) {
  const response = await request(app)
    .patch(`/api/start-requests/${request_id}`)
    .set("Content-Type", "application/json")
    .send({
      decision: "changes_requested",
      message: "You have to change this, that, whatever I want",
    });
  return response;
};
