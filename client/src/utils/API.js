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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proposal),
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(application),
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state: application.state }),
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

const API = {
  createProposal,
  getDegrees,
  getGroups,
  getTeachers,
  getProposals,
  getProposalsByDegree,
  getProposalsByTeacher,
  insertApplication,
  getApplicationsByTeacher,
  getApplicationsByStudent,
  evaluateApplication,
  logIn,
};

export default API;
