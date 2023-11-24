"use strict";

const request = require("supertest");
const app = require("../src/server");
const {
  getGroups,
  getTeachers,
  getDegrees,
  updateApplication,
  getApplicationById,
  rejectPendingApplications,
  deletePendingApplications,
  getTeacherByEmail,
  getTeacher,
  getGroup,
} = require("../src/theses-dao");

jest.mock("../src/theses-dao");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Application Insertion Tests", () => {
  const application = {
    student: "s309618",
    proposal: 8,
  };
  test("Insertion of an application with a wrong proposal", () => {
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
  test("Insertion of a proposal with groups that are not related to any (co)supervisor", () => {
    const proposal = {
      title: "Proposta di tesi fighissima",
      supervisor: "s345678",
      co_supervisors: [
        "maurizio.morisio@polito.it",
        "s122349@gmail.com",
        "s298399@outlook.com",
      ],
      groups: ["ELITE", "SOFTENG", "FUNDIT"],
      keywords: ["SOFTWARE ENGINEERING", "SOFTWARE DEVELOPMENT"],
      types: ["EXPERIMENTAL", "RESEARCH"],
      description: "Accetta questa tesi che e' una bomba",
      required_knowledge: "non devi sapere nulla",
      notes: "Bella raga",
      expiration_date: "2019-01-25T02:00:00.000Z",
      level: "MSC",
      cds: "LM-32 (DM270)",
    };
    getTeacher.mockReturnValue({
      id: "s345678",
      name: "Luigi",
      surname: "De Russis",
      email: "luigi.derussis@polito.it",
      cod_group: "ELITE",
      cod_department: "DAUIN",
    });
    getGroup.mockReturnValueOnce({
      cod_group: "ELITE",
      name_group: "Intelligent and Interactive Systems",
      cod_department: "DAUIN",
    });
    getGroup.mockReturnValueOnce({
      cod_group: "SOFTENG",
      name_group: "Software Engineering Group",
      cod_department: "DAUIN",
    });
    getGroup.mockReturnValueOnce({
      cod_group: "FUNDIT",
      name_group: "Physics of Fundamental Interactions",
      cod_department: "DISAT",
    });
    getTeacherByEmail.mockReturnValueOnce({
      id: "s234567",
      surname: "Morisio",
      name: "Maurizio",
      email: "maurizio.morisio@polito.it",
      cod_group: "SOFTENG",
      cod_department: "DAUIN",
    });
    return request(app)
      .post("/api/proposals")
      .set("Content-Type", "application/json")
      .send(proposal)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid groups");
      });
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

describe("PATCH /api/applications/:id", () => {
  test("Should return 400 if the application does not exist", async () => {
    getApplicationById.mockReturnValue(undefined);

    const response = await request(app)
      .patch("/api/applications/1")
      .send({ state: "accepted" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Application not existent" });
  });
  test("should return 400 if the state value is not correct", async () => {
    const response = await request(app)
      .patch("/api/applications/1")
      .send({ state: "wrong" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid proposal content" });
  });
  test("Should return 200 if the state is accepted for an existent application", async () => {
    getApplicationById.mockReturnValue({
      id: 1,
      proposal_id: 2,
      student_id: "s123456",
      state: "pending",
    });
    const response = await request(app)
      .patch("/api/applications/1")
      .send({ state: "accepted" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Application accepted" });

    expect(updateApplication).toHaveBeenCalledWith(1, "accepted");
    expect(rejectPendingApplications).toHaveBeenCalledWith(2, "s123456");
    expect(deletePendingApplications).toHaveBeenCalledWith("s123456", 2);
  });
  test("Should return 200 if the state is rejected for an existent application", async () => {
    getApplicationById.mockReturnValue({
      id: 1,
      proposal_id: 2,
      student_id: "s123456",
      state: "pending",
    });
    const response = await request(app)
      .patch("/api/applications/1")
      .send({ state: "rejected" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Application rejected" });

    expect(updateApplication).toHaveBeenCalledWith(1, "rejected");
    expect(rejectPendingApplications).toHaveBeenCalledTimes(0);
    expect(deletePendingApplications).toHaveBeenCalledTimes(0);
  });
  test("It should return 500 in case of database error", () => {
    getApplicationById.mockImplementation(() => {
      throw "SQLITE_ERROR_SOMETHING";
    });
    return request(app)
      .patch("/api/applications/1")
      .send({ state: "accepted" })
      .expect(500)
      .then((response) => {
        expect(response.body).toStrictEqual({
          message: "Internal Server Error",
        });
      });
  });
  test("It should not modify an application not pending", () => {
    getApplicationById.mockReturnValue({
      id: 1,
      student_id: "s309618",
      proposal_id: 3,
      state: "accepted",
    });
    return request(app)
      .patch("/api/applications/1")
      .send({ state: "rejected" })
      .expect(400)
      .then((response) => {
        expect(response.body).toStrictEqual({
          message:
            "You cannot modify an application already accepted or rejected",
        });
      });
  });
});
