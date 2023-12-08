"use strict";

const request = require("supertest");
const {app} = require("../src/server");
const {
  getGroups,
  getTeachers,
  getDegrees,
  updateApplication,
  getApplicationById,
  getTeacherByEmail,
  getTeacher,
  getGroup,
  getApplications,
  cancelPendingApplications,
  getProposal,
  getStudent,
  getPendingOrAcceptedApplicationsOfStudent,
  findAcceptedProposal,
  findRejectedApplication,
  getNotificationsOfStudent,
  getDelta,
  setDelta,
  getProposals
} = require("../src/theses-dao");
const dayjs = require("dayjs");

jest.mock("../src/theses-dao");

const application = {
  student: "s309618",
  proposal: 8,
};

beforeEach(() => {
  jest.clearAllMocks();
  application.student = "s309618";
  application.proposal = 8;
});

describe("Application Insertion Tests", () => {
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
    getStudent.mockReturnValue(undefined);
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
          message: `The student ${application.student} has already applied to a proposal`,
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
      expiration_date: dayjs().add(1,'day'),
    });
    getDelta.mockReturnValue(0);
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

describe("Applications retrieval tests", () => {
  test("Return 400 for a teacher that doesn't exist", () => {
    const teacher = 0;
    return request(app)
      .get(`/api/applications?teacher=${teacher}`)
      .set("Content-Type", "application/json")
      .expect(400);
  });
  test("Get all the applications", () => {
    getApplications.mockReturnValue([
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
      {
        id: 37,
        proposal_id: 8,
        student_id: "s309618",
        state: "pending",
        student_name: "Lorenzo",
        student_surname: "Bertetto",
        teacher_name: "Maurizio",
        teacher_surname: "Morisio",
        title:
          "Analisi della qualità del codice e della sicurezza delle librerie software nell ambito dell IoT: un approccio basato sull analisi statica",
      },
    ]);
    return request(app)
      .get("/api/applications")
      .set("Content-Type", "application/json")
      .expect(200);
  });
  test("No applications", () => {
    getApplications.mockReturnValue([]);
    return request(app)
      .get("/api/applications")
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
});

describe('GET /api/notifications', () => {
  it('should return notifications for a valid student', async () => {
    const mockStudent = { id: "s295923"  };
    const mockNotifications = [{ id: 1, message: 'Notification 1' }];
    getStudent.mockReturnValue(mockStudent);
    getNotificationsOfStudent.mockReturnValue(mockNotifications);
    const response = await request(app).get('/api/notifications?student=s295923');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockNotifications);
  });

  it('should return a 404 error for a non-existing student', async () => {
    getStudent.mockReturnValue(undefined);
    const response = await request(app).get('/api/notifications?student=s328186');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Student s328186 not found, cannot get the notifications',
    });
  });

  // Add more test cases for validation errors, server errors, etc.
});

describe('GET /api/virtualClock', () => {
  it('should respond with status 200 and date', async () => {
    getDelta.mockReturnValueOnce({delta:3});
    getProposals.mockReturnValue([
      { id: 1, expiration_date: '2023-01-01' },
      { id: 2, expiration_date: '2023-02-01' },
    ]);
    const response = await request(app).get('/api/virtualClock');
    expect(cancelPendingApplications).toHaveBeenCalledWith(1);
    expect(cancelPendingApplications).toHaveBeenCalledWith(2);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dayjs().add("3",'day').format("YYYY-MM-DD"))
  });
  it('should handle server error and respond with status 500', async () => {
    getDelta.mockImplementation(() => {
      throw new Error('Simulated server error');
    });
    
    const response = await request(app).get('/api/virtualClock');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Internal Server Error');
  });
});

describe('PATCH /api/virtualClock', () => {
  it('should respond with status 200 and success message', async () => {
    setDelta.mockReturnValueOnce({message: 'Date successfully changed'});
    getDelta.mockReturnValueOnce({delta:0});
    getProposals.mockReturnValue([
      { id: 1, expiration_date: '2023-01-01' },
      { id: 2, expiration_date: '2023-02-01' },
    ]);
    const response = await request(app)
      .patch('/api/virtualClock')
      .send({ date: dayjs().add(1,"day").format("YYYY-MM-DD")});
      expect(cancelPendingApplications).toHaveBeenCalledTimes(2);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Date successfully changed');
  });

  it('should handle invalid date content and respond with status 400', async () => {
    const response = await request(app)
      .patch('/api/virtualClock')
      .send({ date: 'invalid-date' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid date content');
  });

  it('should handle going back in the past and respond with status 400', async () => {
    getDelta.mockReturnValueOnce({delta:4});
    const response = await request(app)
      .patch('/api/virtualClock')
      .send({ date: dayjs().add(1,"day").format("YYYY-MM-DD")});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Cannot go back in the past');
  });
});