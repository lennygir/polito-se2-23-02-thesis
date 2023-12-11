"use strict";

const request = require("supertest");
const { app } = require("../src/server");
const {
  getGroups,
  getTeachers,
  getDegrees,
  updateApplication,
  getApplicationById,
  getTeacherByEmail,
  getGroup,
  cancelPendingApplications,
  getProposal,
  getStudent,
  getPendingOrAcceptedApplicationsOfStudent,
  findAcceptedProposal,
  findRejectedApplication,
  getNotifications,
  getApplicationsOfTeacher,
  getApplicationsOfStudent,
} = require("../src/theses-dao");
const isLoggedIn = require("../src/protect-routes");

jest.mock("../src/theses-dao");
jest.mock("../src/protect-routes");

const application = {
  proposal: 8,
};

beforeEach(() => {
  jest.clearAllMocks();
  application.proposal = 8;
});

describe("Application Insertion Tests", () => {
  beforeEach(() => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });
  });
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
  test("Insertion of an application with a proposal that does not exist", () => {
    getProposal.mockReturnValue(undefined);
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
  test("Insertion of an application with a student that does not exist", () => {
    getProposal.mockReturnValue({
      proposal: "proposal",
    });
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "wrong.student@studenti.it",
      };
      next();
    });
    return request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send(application)
      .expect(401)
      .then((response) => {
        expect(response.body).toStrictEqual({
          message: "Only a student can apply for a proposal",
        });
      });
  });
  test("There is already a pending or accepted application for the student", () => {
    getProposal.mockReturnValue({
      proposal: "something",
    });
    getStudent.mockReturnValue({
      student: "something",
    });
    getPendingOrAcceptedApplicationsOfStudent.mockReturnValue([
      {
        student_id: "s309618",
        proposal_id: "4",
        state: "pending",
      },
    ]);
    return request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send(application)
      .expect(400)
      .then((response) => {
        expect(response.body).toStrictEqual({
          message: `The student s309618 has already applied to a proposal`,
        });
      });
  });
  test("The proposal of the application is accepted for another student", () => {
    getProposal.mockReturnValue({
      proposal: "something",
    });
    getStudent.mockReturnValue({
      student: "something",
    });
    getPendingOrAcceptedApplicationsOfStudent.mockReturnValue([]);
    findAcceptedProposal.mockReturnValue({
      proposal: "proposal",
    });
    return request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send(application)
      .expect(400)
      .then((response) => {
        expect(response.body).toStrictEqual({
          message: `The proposal ${application.proposal} is already accepted for another student`,
        });
      });
  });
  test("There same application was already rejected for the student", () => {
    getProposal.mockReturnValue({
      proposal: "something",
    });
    getStudent.mockReturnValue({
      student: "something",
    });
    getPendingOrAcceptedApplicationsOfStudent.mockReturnValue([]);
    findAcceptedProposal.mockReturnValue(undefined);
    findRejectedApplication.mockReturnValue({
      student: "s309618",
      proposal: 8,
      state: "rejected",
    });
    return request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send(application)
      .expect(400)
      .then((response) => {
        expect(response.body).toStrictEqual({
          message:
            "The student has already applied for this application and it was rejected",
        });
      });
  });
  test("Correct insertion of a right application", () => {
    getProposal.mockReturnValue({
      proposal: "something",
    });
    getStudent.mockReturnValue({
      student: "something",
    });
    getPendingOrAcceptedApplicationsOfStudent.mockReturnValue([]);
    findAcceptedProposal.mockReturnValue(undefined);
    findRejectedApplication.mockReturnValue(undefined);
    return request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send(application)
      .expect(200);
  });
});

test("Proposal insertion ", () => {
  isLoggedIn.mockImplementation((req, res, next) => {
    req.user = {
      email: "luigi.derussis@polito.it",
    };
    next();
  });
  const proposal = {
    title: "Proposta di tesi fighissima",
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
    .send(proposal);
});

describe("Applications retrieval tests", () => {
  test("Return 500 for user that doesn't exist", () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "wrong.teacher@teacher.it",
      };
      next();
    });
    return request(app)
      .get(`/api/applications`)
      .set("Content-Type", "application/json")
      .expect(500);
  });
  test("Get all the applications of student", async () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s317743@studenti.polito.it",
      };
      next();
    });
    const expectedApplications = [
      {
        id: 1,
        proposal_id: 1,
        student_id: "s317743",
        state: "rejected",
        student_name: "Francesco",
        student_surname: "Baracco",
        teacher_name: "Marco",
        teacher_surname: "Torchiano",
        title: "Gamification di attività di modellazione UML",
      },
      {
        id: 2,
        proposal_id: 2,
        student_id: "s317743",
        state: "pending",
        student_name: "Francesco",
        student_surname: "Baracco",
        teacher_name: "Marco",
        teacher_surname: "Torchiano",
        title: "Analisi empirica dei difetti in R Markdown",
      },
      {
        id: 3,
        proposal_id: 3,
        student_id: "s317743",
        state: "pending",
        student_name: "Francesco",
        student_surname: "Baracco",
        teacher_name: "Marco",
        teacher_surname: "Torchiano",
        title:
          "Data-centric AI: Dataset augmentation techniques for bias and data quality improvement",
      },
      {
        id: 4,
        proposal_id: 4,
        student_id: "s317743",
        state: "pending",
        student_name: "Francesco",
        student_surname: "Baracco",
        teacher_name: "Marco",
        teacher_surname: "Torchiano",
        title:
          "Detecting the risk discrimination in classifiers with imbalance measures",
      },
    ];
    getApplicationsOfStudent.mockReturnValue(expectedApplications);
    const applications = (
      await request(app)
        .get("/api/applications")
        .set("Content-Type", "application/json")
        .expect(200)
    ).body;
    expect(applications).toEqual(expectedApplications);
  });
  test("No applications", async () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "marco.torchiano@teacher.it",
      };
      next();
    });
    getApplicationsOfTeacher.mockReturnValue([]);
    await request(app)
      .get("/api/applications")
      .set("Content-Type", "application/json")
      .expect(200);
    expect(getApplicationsOfTeacher).toBeCalledWith(
      "s123456", //"marco.torchiano@teacher.it",
    );
  });
});
describe("Get All Teachers Test", () => {
  beforeEach(() => {
    isLoggedIn.mockImplementation((req, res, next) => {
      next();
    });
  });
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
        expect(Array.isArray(response.body)).toBe(true);
        // todo: Add more specific checks on the response body if needed
      });
  });
  test("Get 200 for an empty group table db", () => {
    getTeachers.mockReturnValue([]);
    return request(app)
      .get("/api/teachers")
      .expect("Content-Type", /json/)
      .expect(200);
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
  beforeEach(() => {
    isLoggedIn.mockImplementation((req, res, next) => next());
  });
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
  beforeEach(() => {
    isLoggedIn.mockImplementation((req, res, next) => next());
  });
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
  beforeEach(() => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "marco.torchiano@teacher.it",
      };
      next();
    });
  });
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
    expect(cancelPendingApplications).toHaveBeenCalledWith(2);
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
    expect(cancelPendingApplications).toHaveBeenCalledTimes(0);
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

describe("GET /api/notifications", () => {
  beforeEach(() => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });
  });
  it("should return notifications for a valid student", async () => {
    const mockNotifications = [{ id: 1, message: "Notification 1" }];
    getNotifications.mockReturnValue(mockNotifications);
    const response = await request(app).get("/api/notifications");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockNotifications);
  });

  it("should return notifications for a valid teacher", async () => {
    const mockNotifications = [{ id: 1, message: "Notification 1" }];
    getNotifications.mockReturnValue(mockNotifications);
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "marco.torchiano@teacher.it",
      };
      next();
    });
    const response = await request(app).get("/api/notifications");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockNotifications);
  });

  // Add more test cases for validation errors, server errors, etc.
});

describe("POST /api/start-requests", () => {
  test("Valid start request - returns 200", () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });
    return request(app)
      .post(`/api/start-requests`)
      .send({
        title: "test",
        description: "desc test",
        supervisor: "s123456",
        co_supervisors: [
          "maurizio.morisio@teacher.it",
          "luigi.derussis@teacher.it",
        ],
      })
      .set("Content-Type", "application/json")
      .expect(200);
  });
  test("Logged in as a teacher - returns 401", async () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "maurizio.morisio@teacher.it",
      };
      next();
    });
    return request(app)
      .post(`/api/start-requests`)
      .send({
        title: "test",
        description: "desc test",
        supervisor: "s123456",
        co_supervisors: [
          "maurizio.morisio@teacher.it",
          "luigi.derussis@teacher.it",
        ],
      })
      .set("Content-Type", "application/json")
      .expect(401);
  });
  test("Valid start request without co-supervisors", () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });
    return request(app)
      .post(`/api/start-requests`)
      .send({
        title: "test",
        description: "desc test",
        supervisor: "s123456",
      })
      .set("Content-Type", "application/json")
      .expect(200);
  });
});
