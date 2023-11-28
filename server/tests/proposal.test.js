"use strict";

const request = require("supertest");
const app = require("../src/server");
const { getGroups, getTeachers, getDegrees } = require("../src/theses-dao");

jest.mock("../src/theses-dao.js", () => {
  const theses_dao = jest.requireActual("../src/theses-dao.js");
  return {
    ...theses_dao,
    getTeachers: jest.fn(),
    getGroups: jest.fn(),
    getDegrees: jest.fn(),
  };
});

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});
const { deleteApplication } = require("../src/theses-dao");

describe("Application Insertion Tests", () => {
  const application = {
    student: "s309618",
    proposal: 8,
  };
  it("Insertion of a correct application", async () => {
    await deleteApplication(application.student, application.proposal);
    return request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send(application)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual({
          student_id: "s309618",
          proposal_id: 8,
          state: "pending",
        });
      });
  });
  it("Insertion of an application already existent", async () => {
    await deleteApplication(application.student, application.proposal);
    await request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send(application);
    return request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send(application)
      .expect(400)
      .then((response) => {
        expect(response.body).toStrictEqual({
          message: "Application already present",
        });
      });
  });
  it("Insertion of an application from a wrong student", () => {
    application.student = "s000000";
    return request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send(application)
      .expect(400)
      .then((response) => {
        expect(response.body).toStrictEqual({
          message: "Invalid application content",
        });
      });
  });
  it("Insertion of an application with a wrong proposal", () => {
    application.proposal = -5;
    return request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send(application)
      .expect(400)
      .then((response) => {
        expect(response.body).toStrictEqual({
          message: "Invalid application content",
        });
      });
  });
});
describe("Proposal Insertion Tests", () => {
  it("Insertion of a correct proposal", () => {
    const proposal = {
      title: "Proposta di tesi fighissima",
      supervisor: "s345678",
      co_supervisors: ["s122349@gmail.com", "s298399@outlook.com"],
      groups: ["ELITE", "SOFTENG"],
      keywords: ["SOFTWARE ENGINEERING", "SOFTWARE DEVELOPMENT"],
      types: ["EXPERIMENTAL", "RESEARCH"],
      description: "Accetta questa tesi che e' una bomba",
      required_knowledge: "non devi sapere nulla",
      notes: "Bella raga",
      expiration_date: "2019-01-25T02:00:00.000Z",
      level: "MSC",
      cds: "LM-32 (DM270)",
    };
    return request(app)
      .post("/api/proposals")
      .set("Content-Type", "application/json")
      .send(proposal)
      .expect(200);
  });
  it("Insertion of a proposal with no notes", () => {
    const proposal = {
      title: "Proposta di tesi fighissima",
      supervisor: "s345678",
      co_supervisors: ["s122349@gmail.com", "s298399@outlook.com"],
      groups: ["ELITE", "SOFTENG"],
      keywords: ["SOFTWARE ENGINEERING", "SOFTWARE DEVELOPMENT"],
      types: ["EXPERIMENTAL", "RESEARCH"],
      description: "Accetta questa tesi che e' una bomba",
      required_knowledge: "non devi sapere nulla",
      expiration_date: "2019-01-25T02:00:00.000Z",
      level: "MSC",
      cds: "LM-32 (DM270)",
    };
    return request(app)
      .post("/api/proposals")
      .set("Content-Type", "application/json")
      .send(proposal)
      .expect(200);
  });
  it("Insertion of a proposal with a non existent supervisor", () => {
    const proposal = {
      title: "Proposta di tesi fighissima",
      supervisor: "s000000",
      co_supervisors: ["s122349@gmail.com", "s298399@outlook.com"],
      groups: ["ELITE", "SOFTENG"],
      keywords: ["SOFTWARE ENGINEERING", "SOFTWARE DEVELOPMENT"],
      types: ["EXPERIMENTAL", "RESEARCH"],
      description: "Accetta questa tesi che e' una bomba",
      required_knowledge: "non devi sapere nulla",
      expiration_date: "2019-01-25T02:00:00.000Z",
      level: "MSC",
      cds: "LM-32 (DM270)",
    };
    return request(app)
      .post("/api/proposals")
      .set("Content-Type", "application/json")
      .send(proposal)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid proposal content");
      });
  });
  it("Insertion with an invalid date", () => {
    const proposal = {
      title: "Proposta di tesi fighissima",
      supervisor: "s345678",
      co_supervisors: ["s122349@gmail.com", "s298399@outlook.com"],
      groups: ["ELITE", "SOFTENG"],
      keywords: ["SOFTWARE ENGINEERING", "SOFTWARE DEVELOPMENT"],
      types: ["EXPERIMENTAL", "RESEARCH"],
      description: "Accetta questa tesi che e' una bomba",
      required_knowledge: "non devi sapere nulla",
      expiration_date: "0",
      level: "MSC",
      cds: "LM-32 (DM270)",
    };
    return request(app)
      .post("/api/proposals")
      .set("Content-Type", "application/json")
      .send(proposal)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid proposal content");
      });
  });
  it("Insertion of a proposal with wrong level format", () => {
    const proposal = {
      title: "Proposta di tesi fighissima",
      supervisor: "s345678",
      co_supervisors: ["s122349@gmail.com", "s298399@outlook.com"],
      groups: ["ELITE", "SOFTENG"],
      keywords: ["SOFTWARE ENGINEERING", "SOFTWARE DEVELOPMENT"],
      types: ["EXPERIMENTAL", "RESEARCH"],
      description: "Accetta questa tesi che e' una bomba",
      required_knowledge: "non devi sapere nulla",
      expiration_date: "2019-01-25",
      level: "wrong-level",
      cds: "LM-32 (DM270)",
    };
    return request(app)
      .post("/api/proposals")
      .set("Content-Type", "application/json")
      .send(proposal)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid proposal content");
      });
  });
  it("Insertion of a proposal with an invalid group", () => {
    const proposal = {
      title: "Proposta di tesi fighissima",
      supervisor: "s345678",
      co_supervisors: ["s122349@gmail.com", "s298399@outlook.com"],
      groups: ["ELITE", "SOFTENG", "WRONG GROUP"],
      keywords: ["SOFTWARE ENGINEERING", "SOFTWARE DEVELOPMENT"],
      types: ["EXPERIMENTAL", "RESEARCH"],
      description: "Accetta questa tesi che e' una bomba",
      required_knowledge: "non devi sapere nulla",
      expiration_date: "2019-01-25",
      level: "MSC",
      cds: "LM-32 (DM270)",
    };
    return request(app)
      .post("/api/proposals")
      .set("Content-Type", "application/json")
      .send(proposal)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid proposal content");
      });
  });
  it("Insertion of a proposal with a single keyword (no array)", () => {
    const proposal = {
      title: "Proposta di tesi fighissima",
      supervisor: "s345678",
      co_supervisors: ["s122349@gmail.com", "s298399@outlook.com"],
      groups: ["ELITE", "SOFTENG"],
      keywords: "SOFTWARE ENGINEERING",
      types: ["EXPERIMENTAL", "RESEARCH"],
      description: "Accetta questa tesi che e' una bomba",
      required_knowledge: "non devi sapere nulla",
      expiration_date: "2019-01-25",
      level: "MSC",
      cds: "LM-32 (DM270)",
    };
    return request(app)
      .post("/api/proposals")
      .set("Content-Type", "application/json")
      .send(proposal)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid proposal content");
      });
  });
});

describe("Proposal Retrieval Tests", () => {
  test("Get all the proposals from a specific field of study", () => {
    const cds = "LM-32 (DM270)";
    return request(app)
      .get(`/api/proposals?cds=${cds}`)
      .set("Content-Type", "application/json")
      .expect(200)
      .then((response) => {
        response.body.forEach((proposal) => {
          expect(proposal.cds).toBe(cds);
        });
      });
  });

  test("Get all the proposals from a specific supervisor", () => {
    const supervisor = "s123456";
    return request(app)
      .get(`/api/proposals?supervisor=${supervisor}`)
      .set("Content-Type", "application/json")
      .expect(200);
  });

  test("Return 404 for a non-existing supervisor", () => {
    const supervisor = "s000000";
    return request(app)
      .get(`/api/proposals?supervisor=${supervisor}`)
      .set("Content-Type", "application/json")
      .expect(404);
  });

  test("Return 400 for a invalid format of supervisor", () => {
    const supervisor = 0;
    return request(app)
      .get(`/api/proposals?supervisor=${supervisor}`)
      .set("Content-Type", "application/json")
      .expect(404);
  });

  test("Get all the proposals from a field of study that doesn't exists", () => {
    const cds = "aaaaaaaaaaaaaaaaaaaaaaaaa";
    return request(app)
      .get(`/api/proposals?cds=${cds}`)
      .set("Content-Type", "application/json")
      .expect(404);
  });
});

describe("Get Application From Teacher", () => {
  test("Return 404 for a teacher that doesn't exist", () => {
    const teacher = 0;
    return request(app)
      .get(`/api/applications?teacher=${teacher}`)
      .set("Content-Type", "application/json")
      .expect(404);
  });

  test("Return 404 for emply list of application of that teacher", () => {
    const teacher = "s789012";
    return request(app)
      .get(`/api/applications?teacher=${teacher}`)
      .set("Content-Type", "application/json")
      .expect(404);
  });

  test("Return 200 correct get of all application of a selected teacher", () => {
    const teacher = "s123456";
    return request(app)
      .get(`/api/applications?teacher=${teacher}`)
      .set("Content-Type", "application/json")
      .expect(200);
  });

  test("Return 200 correct get of all application of a selected teacher", () => {
    const teacher = "s123456";
    return request(app)
      .get(`/api/applications?teacher=${teacher}`)
      .set("Content-Type", "application/json")
      .expect(200);
  });

  test("Return 404 for emply list of application of that student", () => {
    const student = "s319823";
    return request(app)
      .get(`/api/applications?student=${student}`)
      .set("Content-Type", "application/json")
      .expect(404);
  });

  test("Return 404 for no student found", () => {
    const student = "s999999";
    return request(app)
      .get(`/api/applications?student=${student}`)
      .set("Content-Type", "application/json")
      .expect(404);
  });

  test("Return 200 correct get of all application of a selected student", () => {
    const student = "s317743";
    return request(app)
      .get(`/api/applications?student=${student}`)
      .set("Content-Type", "application/json")
      .expect(200);
  });
});
describe("Get All Teachers Test", () => {
  test("Correct get of all teachers from db", () => {
    getTeachers.mockReturnValue([
      {
        id: "s123456",
        surname: "Torchiano",
        name: "Marco",
        email: "marco.torchiano@polito.it",
      },
      {
        id: "s234567",
        surname: "Morisio",
        name: "Maurizio",
        email: "maurizio.morisio@polito.it",
      },
    ]);
    return request(app)
      .get("/api/teachers")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        // Assuming the response body is an array
        console.log(response.body);
        expect(Array.isArray(response.body)).toBe(true);
        // todo: Add more specific checks on the response body if needed
      });
  });

  test("Get 404 for an empty group table db", () => {
    getTeachers.mockReturnValue([]);
    return request(app)
      .get("/api/teachers")
      .expect("Content-Type", /json/)
      .expect(404);
  });

  test("Get 500 for an internal server error", () => {
    getTeachers.mockImplementation(() => {
      throw "SQLITE_ERROR_SOMETHING";
    });
    return request(app)
      .get("/api/teachers")
      .expect("Content-Type", /json/)
      .expect(500);
  });
});

describe("Get All Groups Test", () => {
  test("Correct get of all groups from db", () => {
    getGroups.mockReturnValue([
      { cod_group: "SOFTENG" },
      { cod_group: "ELITE" },
    ]);
    return request(app)
      .get("/api/groups")
      .expect("Content-Type", /json/)
      .expect(200);
  });

  test("Get 404 for an empty group table db", () => {
    getGroups.mockReturnValue([]);
    return request(app)
      .get("/api/groups")
      .expect("Content-Type", /json/)
      .expect(404);
  });

  test("Get 500 for an internal server error", () => {
    getGroups.mockImplementation(() => {
      throw "SQLITE_ERROR_SOMETHING";
    });
    return request(app)
      .get("/api/groups")
      .expect("Content-Type", /json/)
      .expect(500);
  });
});

describe("Get All Degrees Test", () => {
  test("Correct get of all degrees from db", () => {
    getDegrees.mockReturnValue([
      { cod_degree: "LM-32 (DM270)", title_degree: "Computer Engineering" },
      { cod_degree: "LM-23 (DM270)", title_degree: "Civil Engineering" },
    ]);
    return request(app)
      .get("/api/degrees")
      .expect("Content-Type", /json/)
      .expect(200);
  });

  test("Get 404 for an empty degree table db", () => {
    getDegrees.mockReturnValue([]);
    return request(app)
      .get("/api/degrees")
      .expect("Content-Type", /json/)
      .expect(404);
  });

  test("Get 500 for an internal server error", () => {
    getDegrees.mockImplementation(() => {
      throw "SQLITE_ERROR_SOMETHING";
    });
    return request(app)
      .get("/api/degrees")
      .expect("Content-Type", /json/)
      .expect(500);
  });
});

describe("Delete proposals", () => {
  test("Correct elimination of a proposal", () => {
    const id = 2;
    return request(app)
      .delete(`/api/proposals?id=${id}`)
      .expect(200);
  });

  test("Get 404 error for no rows eliminated", () => {
   const id = 10000;
    return request(app)
      .delete(`/api/proposals?id=${id}`)
      .expect(404);
  });

});

describe("Update proposals", () => {
  test("Correct update of a proposal", async () => {
    const proposalId = 1; // Replace with the proposal ID you want to update
    const updatedFields = {
      // Specify the fields and their updated values
      title: "Updated Title",
      supervisor: "Updated Supervisor",
      // Add other fields to update
    };

    // Send the PATCH request to update the proposal
    const response = await request(app)
      .patch(`/api/proposal/${proposalId}`)
      .send(updatedFields);

    // Check if the response status is successful (e.g., 200 OK)
    expect(response.status).toBe(200);
  });

  

});
