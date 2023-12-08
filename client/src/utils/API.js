import { SERVER_URL } from "./constants";

/**
 * Parses the JSON content of an HTTP response.
 * @param {Promise} httpResponsePromise - A promise representing an HTTP response.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the response.
 * @throws {Object} If the HTTP response is not successful and does not contain a JSON-formatted error message.
 * @throws {Object} If there is an issue parsing the server response.
 */
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> }
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {
          // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
          response
            .json()
            .then((json) => resolve(json))
            .catch((err) => reject({ error: "Cannot parse server response" }));
        } else {
          // analyzing the cause of error
          response
            .json()
            .then((obj) => reject(obj)) // error msg in the response body
            .catch((err) => reject({ error: "Cannot parse server response" })); // something else
        }
      })
      .catch((err) => reject({ error: "Cannot communicate" })); // connection error
  });
}

/**
 * Retrieves the list of all teachers by sending a GET request to the server's teachers endpoint.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the teachers' list response.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getTeachers = async () => {
  return getJson(
    fetch(SERVER_URL + "/teachers", {
      credentials: "include"
    })
  );
};

/**
 * Retrieves the list of all degrees by sending a GET request to the server's degrees endpoint.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the degrees list response.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getDegrees = async () => {
  return getJson(
    fetch(SERVER_URL + "/degrees", {
      credentials: "include"
    })
  );
};

/**
 * Retrieves the list of all groups by sending a GET request to the server's groups endpoint.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the groups list response.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getGroups = async () => {
  return getJson(
    fetch(SERVER_URL + "/groups", {
      credentials: "include"
    })
  );
};

/**
 * Creates a proposal by sending a POST request to the server's proposals endpoint.
 * @param {Object} proposal - An object containing the proposal details.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the created proposal response.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const createProposal = async (proposal) => {
  return getJson(
    fetch(SERVER_URL + "/proposals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(proposal)
    })
  );
};

/**
 * Retrieves the list of proposals based on logged in user by sending a GET request to the server's proposals endpoint.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the proposals list response.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getProposals = async () => {
  return getJson(
    fetch(SERVER_URL + "/proposals", {
      credentials: "include"
    })
  );
};

/**
 * Retrieves the list of applications based on logged in user by sending a GET request to the server's proposals endpoint.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the proposals list response.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getApplications = async () => {
  return getJson(
    fetch(SERVER_URL + "/applications", {
      credentials: "include"
    })
  );
};

/**
 * Inserts an application by sending a POST request to the server's applications endpoint.
 * @param {Object} application - An object containing the application details.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the created application response.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const createApplication = async (application) => {
  return getJson(
    fetch(SERVER_URL + "/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(application)
    })
  );
};

/**
 * Evaluates an application by sending a PATCH request to the server's applications endpoint with updated application state.
 * @param {Object} application - An object containing the application ID and the updated state.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the updated application response.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const evaluateApplication = async (application) => {
  return getJson(
    fetch(SERVER_URL + "/applications/" + application.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ state: application.state })
    })
  );
};

/**
 * Retrieves notifications based on logged in user by sending a GET request to the server's notifications endpoint with a specified student ID.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the applications list response for the specified student.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getNotifications = async () => {
  return getJson(
    fetch(SERVER_URL + "/notifications", {
      credentials: "include"
    })
  );
};

/**
 * Update a proposal by sending a PATCH request to the server's proposals endpoint with only fields to change.
 * @param {Object} proposal - An object containing the proposal_id and the fields that need to be updated for the proposal.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the updated proposal response.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const updateProposal = async (proposal) => {
  return getJson(
    fetch(SERVER_URL + "/proposals/" + proposal.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(proposal)
    })
  );
};

/**
 * Deletes a proposal with the specified ID from the server.
 * @param {number} proposal_id - The ID of the proposal to be deleted.
 * @returns {Promise} - A promise that resolves with the result of the deletion.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const deleteProposal = async (proposal_id) => {
  return getJson(
    fetch(SERVER_URL + "/proposals/" + proposal_id, {
      method: "DELETE",
      credentials: "include"
    })
  );
};

/**
 * Get currently logged in user information.
 * @returns {Promise} - A promise that resolves with the result of the deletion.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getUserInfo = async () => {
  return getJson(
    fetch(SERVER_URL + "/sessions/current", {
      credentials: "include"
    })
  );
};

const API = {
  createProposal,
  createApplication,
  getDegrees,
  getGroups,
  getTeachers,
  getProposals,
  getApplications,
  getNotifications,
  getUserInfo,
  evaluateApplication,
  updateProposal,
  deleteProposal,
};

export default API;
