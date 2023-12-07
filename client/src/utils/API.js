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

const logIn = async (credentials) => {
  return getJson(
    fetch(SERVER_URL + "/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    })
  );
};

/**
 * Retrieves the list of all teachers by sending a GET request to the server's teachers endpoint.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the teachers' list response.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getTeachers = async () => {
  return getJson(fetch(SERVER_URL + "/teachers"));
};

/**
 * Retrieves the list of all degrees by sending a GET request to the server's degrees endpoint.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the degrees list response.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getDegrees = async () => {
  return getJson(fetch(SERVER_URL + "/degrees"));
};

/**
 * Retrieves the list of all groups by sending a GET request to the server's groups endpoint.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the groups list response.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getGroups = async () => {
  return getJson(fetch(SERVER_URL + "/groups"));
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
      body: JSON.stringify(proposal)
    })
  );
};

/**
 * Retrieves the list of all proposals by sending a GET request to the server's proposals endpoint.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the proposals list response.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getProposals = async () => {
  return getJson(fetch(SERVER_URL + "/proposals"));
};

/**
 * Retrieves proposals by degree by sending a GET request to the server's proposals endpoint with a specified degree.
 * @param {string} degree - The degree for which proposals are requested.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the proposals list response for the specified degree.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getProposalsByDegree = async (degree) => {
  return getJson(fetch(SERVER_URL + "/proposals?cds=" + degree));
};

/**
 * Retrieves proposals by teacher by sending a GET request to the server's proposals endpoint with a specified teacher ID.
 * @param {string} teacher_id - The ID of the teacher for whom proposals are requested.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the proposals list response for the specified teacher.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getProposalsByTeacher = async (teacher_id) => {
  return getJson(fetch(SERVER_URL + "/proposals?supervisor=" + teacher_id));
};

/**
 * Inserts an application by sending a POST request to the server's applications endpoint.
 * @param {Object} application - An object containing the application details.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the created application response.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const insertApplication = async (application) => {
  return getJson(
    fetch(SERVER_URL + "/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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
      body: JSON.stringify({ state: application.state })
    })
  );
};

/**
 * Retrieves applications by teacher by sending a GET request to the server's applications endpoint with a specified teacher ID.
 * @param {string} teacher_id - The ID of the teacher for whom applications are requested.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the applications list response for the specified teacher.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getApplicationsByTeacher = async (teacher_id) => {
  return getJson(fetch(SERVER_URL + "/applications?teacher=" + teacher_id));
};

/**
 * Retrieves applications by student by sending a GET request to the server's applications endpoint with a specified student ID.
 * @param {string} student_id - The ID of the student for whom applications are requested.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the applications list response for the specified student.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getApplicationsByStudent = async (student_id) => {
  return getJson(fetch(SERVER_URL + "/applications?student=" + student_id));
};

/**
 * Retrieves notifications by student by sending a GET request to the server's notifications endpoint with a specified student ID.
 * @param {string} student_id - The ID of the student for whom applications are requested.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the applications list response for the specified student.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getNotificationsByStudent = async (student_id) => {
  return getJson(fetch(SERVER_URL + "/notifications?student=" + student_id));
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
      body: JSON.stringify(proposal)
    })
  );
};

/**
 * Deletes a proposal with the specified ID from the server.
 * @param {number} proposal_id - The ID of the proposal to be deleted.
 * @returns {Promise} A promise that resolves with the result of the deletion.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const deleteProposal = async (proposal_id) => {
  return getJson(
    fetch(SERVER_URL + "/proposals/" + proposal_id, {
      method: "DELETE"
    })
  );
};

/**
 * Retrieve the virtual clock.
 * @returns {Promise} A promise that resolves with the actual date.
 * @throws {Object} If there is an issue with the HTTP request or parsing the server response.
 */
const getVirtualClock = async () =>  {
  return getJson(fetch(SERVER_URL + "/virtualClock"));
}

/**
 * Update the virtual clock on the server given the actual date as input.
 * @param {string} date - The new actual date.
 * @returns {Promise} A promise that resolves to the parsed JSON content of the updated virtual clock response.
 * @throws {Error} If there is an issue with the HTTP request or parsing the server response.
 */
const updateVirtualClock = async (date) => {
  return getJson(
    fetch(SERVER_URL + "/virtualClock" , {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(date)
    })
  );
}

const getUserInfo = async () => {
  return getJson(
    fetch(SERVER_URL + "/sessions/current", {
      credentials: "include"
    })
  );
};

const API = {
  createProposal,
  getDegrees,
  getGroups,
  getTeachers,
  getProposals,
  getProposalsByDegree,
  getProposalsByTeacher,
  getUserInfo,
  insertApplication,
  getApplicationsByTeacher,
  getApplicationsByStudent,
  evaluateApplication,
  logIn,
  getNotificationsByStudent,
  updateProposal,
  deleteProposal,
  updateVirtualClock,
  getVirtualClock,
};

export default API;
