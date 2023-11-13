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

beforeEach(() => jest.resetAllMocks());

describe("Proposal Insertion Tests", () => {
  test("Insertion of a correct proposal", () => {
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
  test("Insertion of a proposal with no notes", () => {
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
  test("Insertion of a proposal with a non existent supervisor", () => {
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
  test("Insertion with an invalid date", () => {
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
  test("Insertion of a proposal with wrong level format", () => {
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
  test("Insertion of a proposal with an invalid group", () => {
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
  test("Insertion of a proposal with a single keyword (no array)", () => {
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

  test("Get all the proposals from a field of study that doesn't exists", () => {
    const cds = "aaaaaaaaaaaaaaaaaaaaaaaaa";
    return request(app)
      .get(`/api/proposals?cds=${cds}`)
      .set("Content-Type", "application/json")
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(0);
      });
  });
});

describe("Get All Teachers Test", () => {
  test("Correct get of all teachers from db", () => {
    getTeachers.mockResolvedValue([
      { id: "s123456", surname: "Torchiano", name: "Marco" },
      { id: "s234567", surname: "Morisio", name: "Maurizio" },
    ]);
    return request(app)
      .get("/api/teachers")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        // Assuming the response body is an array
        expect(Array.isArray(response.body)).toBe(true);
        // todo: Add more specific checks on the response body if needed
      });
  });

  test("Get 404 for an empty group table db", () => {
    getTeachers.mockResolvedValue([]);
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
    getGroups.mockResolvedValue([
      { cod_group: "SOFTENG" },
      { cod_group: "ELITE" },
    ]);
    return request(app)
      .get("/api/groups")
      .expect("Content-Type", /json/)
      .expect(200);
  });

  test("Get 404 for an empty group table db", () => {
    getGroups.mockResolvedValue([]);
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
    getDegrees.mockResolvedValue([
      { cod_degree: "LM-32 (DM270)", title_degree: "Computer Engineering" },
      { cod_degree: "LM-23 (DM270)", title_degree: "Civil Engineering" },
    ]);
    return request(app)
      .get("/api/degrees")
      .expect("Content-Type", /json/)
      .expect(200);
  });

  test("Get 404 for an empty degree table db", () => {
    getDegrees.mockResolvedValue([]);
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
