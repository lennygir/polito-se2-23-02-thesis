"use strict";

const request = require("supertest");
const app = require("../src/server");
const { deleteApplication } = require("../src/theses-dao");

describe("Application Insertion Tests", () => {
  const application = {
    student: "s309618",
    proposal: 8,
  };
  test("Insertion of a correct application", async () => {
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
  test("Insertion of an application already existent", async () => {
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
  test("Insertion of an application from a wrong student", () => {
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
