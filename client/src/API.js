const SERVER_URL = "http://localhost:3000/api";

/**
 * A utility function for parsing the HTTP response.
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

const getTeachers = async () => {
  return getJson(fetch(SERVER_URL + "/teachers"));
};

const getDegrees = async () => {
  return getJson(fetch(SERVER_URL + "/degrees"));
};

const getGroups = async () => {
  return getJson(fetch(SERVER_URL + "/groups"));
};

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

const getProposals = async () => {
  return getJson(fetch(SERVER_URL + "/proposals"));
};

const getProposalsByDegree = async (degree) => {
  return getJson(fetch(SERVER_URL + "/proposals?cds=" + degree));
};

const evaluateApplication = async (application) => {
  return getJson(
    fetch(SERVER_URL + "/applications/" + application.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(application),
      //{id:"id_incrementale",proposal_id:"proposal_id", student_id:"student_id", state"accepted/rejected"}
    })
  );
};

const getProposalsByTeacher = async (teacher_id) => {
  return getJson(fetch(SERVER_URL + "/proposals?supervisor=" + teacher_id));
};

const insertApplication = async (application) => {
  return getJson(
    fetch(SERVER_URL + "/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(application), //request body: {proposal: "proposal_id",student:"student_id"}
    })
  );
};

const getApplicationsByTeacher = async (teacher_id) => {
  return getJson(fetch(SERVER_URL + "/applications?teacher=" + teacher_id));
};

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
  logIn,
  evaluateApplication,
};

export default API;
