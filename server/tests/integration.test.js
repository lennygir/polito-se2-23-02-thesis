const request = require("supertest");
const app = require("../src/server");
it("Insertion of a correct proposal", () => {
  const proposal = {
    title: "Proposta di tesi fighissima",
    supervisor: "s345678",
    co_supervisors: ["s122349@gmail.com", "s298399@outlook.com"],
    groups: ["ELITE"],
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
    groups: ["ELITE"],
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
    groups: ["ELITE"],
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
    groups: ["ELITE"],
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
    groups: ["ELITE", "WRONG GROUP"],
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
    groups: ["ELITE"],
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
it("Return 200 correct get of all application of a selected teacher", () => {
  const teacher = "s123456";
  return request(app)
    .get(`/api/applications?teacher=${teacher}`)
    .set("Content-Type", "application/json")
    .expect(200);
});

it("Return 200 correct get of all application of a selected teacher", () => {
  const teacher = "s123456";
  return request(app)
    .get(`/api/applications?teacher=${teacher}`)
    .set("Content-Type", "application/json")
    .expect(200);
});
