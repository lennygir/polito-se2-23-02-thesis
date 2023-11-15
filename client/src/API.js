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

const getProposalsByDegree = async (degree) => {
  return getJson(fetch(SERVER_URL + "/proposals?cds=" + degree));
};

const getProposalsByTeacher = async(teacher_id) =>{
  return getJson(fetch(SERVER_URL + "/proposals?supervisor=" + teacher_id))
}


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

const getApplications = async(teacher_id) => {
  return getJson(fetch(SERVER_URL + "/applications?teacher=" + teacher_id));
}

const API = {
  logIn,
  getTeachers,
  createProposal,
  getDegrees,
  getGroups,
  getProposalsByDegree,
  getProposalsByTeacher,
  insertApplication,
  getApplications
};

export default API;
