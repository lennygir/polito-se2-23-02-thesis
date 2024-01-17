"use strict";

const request = require("supertest");
const { app } = require("../src/server");

const {
  getGroups,
  getTeachers,
  getTeacher,
  getDegrees,
  updateApplication,
  getApplicationById,
  getTeacherByEmail,
  getGroup,
  cancelPendingApplications,
  getProposal,
  findAcceptedProposal,
  findRejectedApplication,
  getNotifications,
  getDelta,
  setDelta,
  getApplicationsOfTeacher,
  getApplicationsOfStudent,
  getExamsOfStudent,
  getNotRejectedStartRequest,
  getPendingApplicationsOfStudent,
  getAcceptedApplicationsOfStudent,
  getRequestsForClerk,
  getProposalsThatExpireInXDays,
  notifyRemovedCosupervisors,
} = require("../src/theses-dao");

const dayjs = require("dayjs");
const isLoggedIn = require("../src/protect-routes");
const { runCronjob, cronjobNames } = require("../src/cronjobs");

jest.mock("../src/theses-dao");
jest.mock("../src/protect-routes");

const application = {
  proposal: 8,
};

beforeEach(() => {
  jest.clearAllMocks();
  application.proposal = 8;
});

describe('GET /api/sessions/current', () => {
  test('should return user details if authenticated', async () => {
    const mockedUser = {  email: "s309618@studenti.polito.it", };
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = mockedUser;
      next();
    });
    const response = await request(app).get('/api/sessions/current');
    expect(response.status).toBe(200);
  });

  test('should handle database error', async () => {
    const mockedUser = {  email: "s000000@studenti.polito.it", };
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = mockedUser;
      next();
    });
    const response = await request(app).get('/api/sessions/current');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'database error' });
  });
});

describe("Career retrieval tests", () => {
  test("Get career of student", async () => {
    const studentId = "s309618";
    const career = [
      {
        id: studentId,
        cod_course: "01SQMOV",
        title_course: "Data Science and Database Technologies",
        cfu: 8,
        grade: 28,
        date: "2023-01-23",
      },
      {
        id: studentId,
        cod_course: "02KPNOV",
        title_course: "Network Services and Technologies",
        cfu: 6,
        grade: 25,
        date: "2023-01-30",
      },
    ];
    isLoggedIn.mockImplementation((req, res, next) => next());
    getExamsOfStudent.mockReturnValue(career);
    const returnedCareer = (
      await request(app).get(`/api/students/${studentId}/exams`).expect(200)
    ).body;
    expect(returnedCareer).toEqual(career);
  });
  test("Error in the database", async () => {
    const studentId = "s309618";
    isLoggedIn.mockImplementation((req, res, next) => next());
    getExamsOfStudent.mockImplementation(() => {
      throw "ERROR: SQL_SOMETHING";
    });
    await request(app).get(`/api/students/${studentId}/exams`).expect(500);
  });
  test("Wrong student", async () => {
    const studentId = "wrong student";
    isLoggedIn.mockImplementation((req, res, next) => next());
    await request(app).get(`/api/students/${studentId}/exams`).expect(400);
  });
  test("Finding an empty career is ok", async () => {
    const studentId = "s309618";
    isLoggedIn.mockImplementation((req, res, next) => next());
    getExamsOfStudent.mockReturnValue([]);
    await request(app).get(`/api/students/${studentId}/exams`).expect(200);
  });
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
    getProposal.mockReturnValueOnce({
      proposal: "something",
    });
    getAcceptedApplicationsOfStudent.mockReturnValue([]);
    getPendingApplicationsOfStudent.mockReturnValue([
      {
        student_id: "s309618",
        proposal_id: "4",
        state: "pending",
      },
    ]);
    getProposal.mockReturnValueOnce({
      expiration_date: "2025-05-05",
    });
    getDelta.mockReturnValue({
      delta: 0,
    });
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
    getProposal.mockReturnValueOnce({
      proposal: "something",
    });
    getAcceptedApplicationsOfStudent.mockReturnValue([]);
    getPendingApplicationsOfStudent.mockReturnValue([]);
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
    getProposal.mockReturnValueOnce({
      proposal: "something",
    });
    getAcceptedApplicationsOfStudent.mockReturnValue([]);
    getPendingApplicationsOfStudent.mockReturnValue([]);
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
      expiration_date: dayjs().add(1, "day"),
    });
    getDelta.mockReturnValue({ delta: 0 });
    getAcceptedApplicationsOfStudent.mockReturnValue([]);
    getPendingApplicationsOfStudent.mockReturnValue([]);
    findAcceptedProposal.mockReturnValue(undefined);
    findRejectedApplication.mockReturnValue(undefined);
    return request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send(application)
      .expect(200);
  });
});

describe("Attached-file retrieval", () => {
  isLoggedIn.mockImplementation((req, res, next) => next());
  test("Wrong application", async () => {
    const applicationId = "wrong parameter";
    await request(app)
      .get(`/api/applications/${applicationId}/attached-file`)
      .expect(400);
  });
  test("Application not existent", async () => {
    isLoggedIn.mockImplementation((req, res, next) => next());
    const applicationId = 20;
    getApplicationById.mockReturnValue(undefined);
    const response = await request(app)
      .get(`/api/applications/${applicationId}/attached-file`)
      .expect(404);
    expect(response.body).toEqual({ message: "Application not found" });
  });
  test("Error in the database", async () => {
    isLoggedIn.mockImplementation((req, res, next) => next());
    const applicationId = 20;
    getApplicationById.mockImplementation(() => {
      throw new Error("SQLITE_ERROR_SOMETHING");
    });
    const response = await request(app)
      .get(`/api/applications/${applicationId}/attached-file`)
      .expect(500);
    expect(response.body).toEqual({
      message: "Internal Server Error",
    });
  });
  test("Correct retrieval", async () => {
    isLoggedIn.mockImplementation((req, res, next) => next());
    const applicationId = 20;
    getApplicationById.mockReturnValue({
      application_id: applicationId,
      state: "pending",
      student_id: "s309618",
      proposal_id: 8,
      attached_file: "mocked file",
    });
    const response = await request(app)
      .get(`/api/applications/${applicationId}/attached-file`)
      .expect(200);
    expect(response.text).toBe("mocked file");
  });
  test("Application exists, but has not any attached file", async () => {
    isLoggedIn.mockImplementation((req, res, next) => next());
    const applicationId = 20;
    getApplicationById.mockReturnValue({
      application_id: applicationId,
      state: "pending",
      student_id: "s309618",
      proposal_id: 8,
    });
    const response = await request(app)
      .get(`/api/applications/${applicationId}/attached-file`)
      .expect(404);
    expect(response.body).toEqual({
      message: "The application has not any attached files",
    });
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
    getDelta.mockReturnValue({ delta: 0 });
    getProposal.mockReturnValue({
      expiration_date: dayjs().add(2, "day").format("YYYY-MM-DD"),
    });
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
      throw new Error("SQLITE_ERROR_SOMETHING");
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
  test("Get 200 for an empty group table db", () => {
    getGroups.mockReturnValue([]);
    return request(app)
      .get("/api/groups")
      .expect("Content-Type", /json/)
      .expect(200);
  });
  test("Get 500 for an internal server error", () => {
    getGroups.mockImplementation(() => {
      throw new Error("SQLITE_ERROR_SOMETHING");
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
  test("Get 200 for an empty degree table db", () => {
    getDegrees.mockReturnValue([]);
    return request(app)
      .get("/api/degrees")
      .expect("Content-Type", /json/)
      .expect(200);
  });
  test("Get 500 for an internal server error", () => {
    getDegrees.mockImplementation(() => {
      throw new Error("SQLITE_ERROR_SOMETHING");
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
    expect(response.body).toEqual({ message: "Invalid content" });
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
      throw new Error("SQLITE_ERROR_SOMETHING");
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
  test("The teacher tries to attach a file", async () => {
    const response = await request(app)
      .patch("/api/applications/1")
      .send(Buffer.alloc(5))
      .expect(400);
    expect(response.body).toEqual({
      message:
        "You have to tell if you want to accept or reject the application",
    });
  });
  test("Attach a file to an application not pending", async () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });
    getApplicationById.mockReturnValue({
      state: "accepted",
    });
    const response = await request(app)
      .patch("/api/applications/1")
      .send(Buffer.alloc(5))
      .expect(401);
    expect(response.body).toEqual({
      message: "You cannot attach a file to a request not pending",
    });
  });
  test("Correct upload", async () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });
    getApplicationById.mockReturnValue({
      state: "pending",
    });
    const response = await request(app)
      .patch("/api/applications/1")
      .send(Buffer.alloc(5))
      .expect(200);
    expect(response.body).toEqual({
      message: "File uploaded correctly",
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

describe("GET /api/virtualClock", () => {
  it("should respond with status 200 and date", async () => {
    getDelta.mockReturnValueOnce({ delta: 3 });
    const response = await request(app).get("/api/virtualClock");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dayjs().add("3", "day").format("YYYY-MM-DD"));
  });
  it("should handle server error and respond with status 500", async () => {
    getDelta.mockImplementation(() => {
      throw new Error("Simulated server error");
    });

    const response = await request(app).get("/api/virtualClock");
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});

describe("PATCH /api/virtualClock", () => {
  it("should respond with status 200 and success message", async () => {
    setDelta.mockReturnValueOnce({ message: "Date successfully changed" });
    getDelta.mockReturnValueOnce({ delta: 0 });
    const response = await request(app)
      .patch("/api/virtualClock")
      .send({ date: dayjs().add(1, "day").format("YYYY-MM-DD") });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Date successfully changed",
    );
  });

  it("should handle invalid date content and respond with status 400", async () => {
    const response = await request(app)
      .patch("/api/virtualClock")
      .send({ date: "invalid-date" });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid date content");
  });

  it("should handle going back in the past and respond with status 400", async () => {
    getDelta.mockReturnValueOnce({ delta: 4 });
    const response = await request(app)
      .patch("/api/virtualClock")
      .send({ date: dayjs().add(1, "day").format("YYYY-MM-DD") });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Cannot go back in the past",
    );
  });
});

describe("POST /api/start-requests", () => {
  test("Valid start request - returns 200", () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });
    getTeacher.mockReturnValue({ email: "fake@fake.com" });
    getNotRejectedStartRequest.mockReturnValue([]);
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
    getTeacher.mockReturnValue({ email: "fake@fake.com" });
    getNotRejectedStartRequest.mockReturnValue([]);
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
  test("Valid start request without co-supervisors - returns 200", () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });
    getTeacher.mockReturnValue({ email: "fake@fake.com" });
    getNotRejectedStartRequest.mockReturnValue([]);
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
  test("Valid start request by a student that already has a start request - returns 409", () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });
    getTeacher.mockReturnValue({ email: "fake@fake.com" });
    getNotRejectedStartRequest.mockReturnValue([
      {
        title: "fake start request",
        description: "fake description",
        supervisor: "s123456",
        status: "requested",
      },
    ]);
    return request(app)
      .post(`/api/start-requests`)
      .send({
        title: "test",
        description: "desc test",
        supervisor: "s123456",
      })
      .set("Content-Type", "application/json")
      .expect(409);
  });
});

describe("GET /api/start-requests", () => {
  test("Get all the start thesis request to be approved", async () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "laura.ferrari@example.com",
      };
      next();
    });

    const expectedRequests = [
      {
        id: 1,
        status: "requested",
      },
      {
        id: 2,
        status: "requested",
      },
    ];
    getRequestsForClerk.mockReturnValue(expectedRequests);
    const requests = (
      await request(app)
        .get("/api/start-requests")
        .set("Content-Type", "application/json")
        .expect(200)
    ).body;
    expect(requests).toEqual(expectedRequests);
  });
  test("No requests", async () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "laura.ferrari@example.com",
      };
      next();
    });
    getRequestsForClerk.mockReturnValue([]);
    await request(app)
      .get("/api/start-requests")
      .set("Content-Type", "application/json")
      .expect(200);
  });
});

describe("Cronjobs", () => {
  test("Notify on thesis expiration (7 days before)", async () => {
    const expectedDate = dayjs().add(7 + 2, "day");
    getDelta.mockReturnValue({ delta: 2 });
    getProposalsThatExpireInXDays.mockReturnValue([
      {
        supervisor: "s234567", 
        teacher_surname: "Torchiano",
        teacher_email: "marco.torchiano@teacher.it",
        teacher_name: "Marco",
        expiration_date: expectedDate.format("YYYY-MM-DD"),
        title: "Test proposal"
      }
    ]);
    await runCronjob(cronjobNames.THESIS_EXPIRED);
  });
});

describe("PUT /api/proposals/:id", () => {
  test("Remove a co supervisor", async () => {

    const originalModule = jest.requireActual("../src/theses-dao");
    notifyRemovedCosupervisors.mockImplementation(originalModule.notifyRemovedCosupervisors);

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "maurizio.morisio@teacher.it",
      };
      next();
    });

    const proposal = {
      id: 1,
      title: "test",
      description: "desc test",
      supervisor: "s234567",
      co_supervisors: "marco.torchiano@teacher.it",
      keywords: ["keyword1", "keyword2"],
      groups: ["SOFTENG"],
      types: ["EXPERIMENTAL"],
      required_knowledge: "required knowledge",
      notes: "notes",
      expiration_date: "2021-01-01",
      level: "MSC",
      cds: "LM-32 (DM270)",
      manually_archived: 0,
      deleted: 0
    };

    const modifiedProposal = {
      id: 1,
      title: "test",
      description: "desc test",
      co_supervisors: [],
      keywords: ["keyword1", "keyword2"],
      groups: [],
      types: ["EXPERIMENTAL"],
      required_knowledge: "required knowledge",
      notes: "notes",
      expiration_date: "2021-01-01",
      level: "MSC",
      cds: "LM-32 (DM270)"
    };

    getProposal.mockReturnValue(proposal);

    const requests = (
      await request(app)
        .put("/api/proposals/1")
        .set("Content-Type", "application/json")
        .send(modifiedProposal)
        .expect(200)
    );
    expect(requests.body).toEqual({ message: "Proposal updated successfully" });
  });
});
