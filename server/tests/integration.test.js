"use strict";
const request = require("supertest");
const { app } = require("../src/server");
const dayjs = require("dayjs");
const { db } = require("../src/db");
const isLoggedIn = require("../src/protect-routes");

jest.mock("../src/db");
jest.mock("../src/protect-routes");

let proposal;
let application;

beforeEach(() => {
  proposal = {
    title: "Proposta di tesi fighissima",
    co_supervisors: ["s122349@gmail.com", "s298399@outlook.com"],
    groups: ["SOFTENG"],
    keywords: ["SOFTWARE ENGINEERING", "SOFTWARE DEVELOPMENT"],
    types: ["EXPERIMENTAL", "RESEARCH"],
    description: "Accetta questa tesi che e' una bomba",
    required_knowledge: "non devi sapere nulla",
    notes: "Bella raga",
    expiration_date: "2025-01-25",
    level: "MSC",
    cds: "LM-32-D",
  };
  application = {
    proposal: 1,
  };
});

describe("Protected routes", () => {
  it("Sets the logged in user", async () => {
    const email = "marco.torchiano@teacher.it";
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: email,
      };
      next();
    });
    const user = (await request(app).get("/api/sessions/current").expect(200))
      .body;
    expect(user.email).toBe(email);
  });
  it("Insertion of a correct proposal by a professor", async () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "marco.torchiano@teacher.it",
      };
      next();
    });
    await request(app)
      .post("/api/proposals")
      .set("Content-Type", "application/json")
      .send(proposal)
      .expect(200);
  });
});

/*describe("Story 12: Archive Proposals", () => {
  let proposal_body;
  let inserted_proposal;
  const email = "marco.torchiano@teacher.it";
  const future_date = dayjs().add(7, "day").format("YYYY-MM-DD");
  const past_date = dayjs().subtract(7, "day").format("YYYY-MM-DD");
  beforeEach(() => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: email,
      };
      next();
    });
    proposal_body = {
      title: "New proposal",
      co_supervisors: ["s122349@gmail.com", "s298399@outlook.com"],
      groups: ["SOFTENG"],
      keywords: ["SOFTWARE ENGINEERING", "SOFTWARE DEVELOPMENT"],
      types: ["EXPERIMENTAL", "RESEARCH"],
      description: "This proposal is used to test the archiving functionality",
      required_knowledge: "You have to know how to archive the thesis",
      notes: null,
      expiration_date: future_date,
      level: "MSC",
      cds: "L-8-F",
    };
    inserted_proposal = {
      ...proposal_body,
      supervisor: email,
    };
  });
  afterEach(() => {
    db.prepare("delete from main.PROPOSALS").run();
    db.prepare("delete from main.APPLICATIONS").run();
  });
  it("Create a proposal, then archive it", async () => {
    // insert proposal as marco.torchiano
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal_body)
    ).body;

    const archived_proposal = (
      await request(app)
        .patch(`/api/proposals/${inserted_proposal_id}`)
        .set("Content-Type", "application/json")
        .send({
          archived: true,
        })
        .expect(200)
    ).body;

    expect(archived_proposal).toEqual({
      ...inserted_proposal,
      archived: true,
    });
  });
  it("Multiple tries should not trigger any errors (idempotency)", async () => {
    // insert proposal
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal_body)
    ).body;

    // archive the proposal the first time
    await request(app)
      .patch(`/api/proposals/${inserted_proposal_id}`)
      .set("Content-Type", "application/json")
      .send({
        archived: true,
      });

    // archive the proposal for the second time
    const archived_proposal = (
      await request(app)
        .patch(`/api/proposals/${inserted_proposal_id}`)
        .set("Content-Type", "application/json")
        .send({
          archived: true,
        })
        .expect(200)
    ).body;

    expect(archived_proposal).toEqual({
      ...inserted_proposal,
      archived: true,
    });
  });

  it("An expired proposal should be archived", async () => {
    proposal_body.expiration_date = past_date;
    inserted_proposal.expiration_date = past_date;

    // Insert a proposal. It should already be archived
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal_body)
    ).body;

    // get all the proposals
    const proposals = (await request(app).get("/api/proposals")).body;

    expect(
      proposals.find((proposal) => proposal.id === inserted_proposal_id),
    ).toEqual({
      ...inserted_proposal,
      archived: true,
    });
  });
  it("The admitted field on the body should be only 'true'", async () => {
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal_body)
    ).body;

    await request(app)
      .patch(`/api/proposals/${inserted_proposal_id}`)
      .set("Content-Type", "application/json")
      .send({
        archived: "something else",
      })
      .expect(400);

    // get all the proposals
    const proposals = (await request(app).get("/api/proposals")).body;

    // the proposal should remain unarchived
    expect(
      proposals.find((proposal) => proposal.id === inserted_proposal_id),
    ).toEqual({
      ...inserted_proposal,
      archived: false,
    });
  });

  it("The proposal should exist", async () => {
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal_body)
    ).body;

    const wrong_proposal_id = inserted_proposal_id + 1;

    await request(app)
      .patch(`/api/proposals/${wrong_proposal_id}`)
      .set("Content-Type", "application/json")
      .send({
        archived: true,
      })
      .expect(404);
  });

  it("A professor should be able to archive only proposals created by him", async () => {
    // marco.torchiano inserts a proposal
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal_body)
    ).body;

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "luigi.derussis@teacher.it",
      };
      next();
    });

    // luigi.derussis wants to set marco.torchiano's proposal to archived
    await request(app)
      .patch(`/api/proposals/${inserted_proposal_id}`)
      .set("Content-Type", "application/json")
      .send({
        archived: true,
      })
      .expect(401); // unauthorized
  });

  it("Get only active/inactive proposals", async () => {
    // insert 5 not archived proposals
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal_body);
    }

    // insert 5 archived proposals
    proposal_body.expiration_date = past_date;
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal_body);
    }

    // get active proposals just inserted
    const active_proposals = (
      await request(app).get("/api/proposals?archived=false")
    ).body;

    // get archived proposals just inserted
    const archived_proposals = (
      await request(app).get("/api/proposals?archived=true")
    ).body;

    expect(
      active_proposals.every((proposal) => proposal.archived === false),
    ).toBe(true);
    expect(
      archived_proposals.every((proposal) => proposal.archived === true),
    ).toBe(true);
  });
  it("When an application gets accepted, its proposal should become archived", async () => {
    // marco.torchiano inserts a proposal
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal_body)
    ).body;

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });

    // s309618 student inserts an application for the proposal just inserted
    await request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send({
        proposal: inserted_proposal_id,
      });

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "marco.torchiano@teacher.it",
      };
      next();
    });

    // marco.torchiano finds the application id
    const applications = (await request(app).get("/api/applications")).body;

    // the proposal should not be archived
    let proposals = (await request(app).get("/api/proposals")).body;
    expect(
      proposals.find((proposal) => proposal.id === inserted_proposal_id),
    ).toEqual({
      ...inserted_proposal,
      archived: false,
    });

    // accept application
    await request(app)
      .patch(`/api/applications/${applications[0].id}`)
      .set("Content-Type", "application/json")
      .send({
        state: "accepted",
      });

    // now the proposal should be archived
    proposals = (await request(app).get("/api/proposals")).body;
    expect(
      proposals.find((proposal) => proposal.id === inserted_proposal_id),
    ).toEqual({
      ...inserted_proposal,
      archived: true,
    });
  });
});*/

it("prova", async () => {
  const email = "marco.torchiano@teacher.it";
  isLoggedIn.mockImplementation((req, res, next) => {
    req.user = {
      email: email,
    };
    next();
  });
  const proposal_id = (
    await request(app)
      .post("/api/proposals")
      .set("Content-Type", "application/json")
      .send(proposal)
      .expect(200)
  ).body;
  let expected_proposal = {
    ...proposal,
    supervisor: "s123456", // marco.torchiano@teacher.it's id
    type: proposal.types.join(", "),
    id: proposal_id,
    co_supervisors: proposal.co_supervisors.join(", "),
    groups: proposal.groups.join(", "),
    keywords: proposal.keywords.join(", "),
    expiration_date: dayjs(proposal.expiration_date).format("YYYY-MM-DD"),
  };
  delete expected_proposal.types;
  let returned_proposal = db
    .prepare("select * from main.PROPOSALS where id = ?")
    .get(proposal_id);
  expect(returned_proposal).toEqual(expected_proposal);
});

it("CRUD on proposal", async () => {
  const email = "marco.torchiano@teacher.it";
  isLoggedIn.mockImplementation((req, res, next) => {
    req.user = {
      email: email,
    };
    next();
  });
  const proposalId = (
    await request(app)
      .post("/api/proposals")
      .set("Content-Type", "application/json")
      .send(proposal)
      .expect(200)
  ).body;
  const proposals = (await request(app).get("/api/proposals").expect(200)).body;
  let expectedProposal = {
    ...proposal,
    supervisor: "s123456", // marco.torchiano@teacher.it
    type: proposal.types.join(", "),
    id: proposalId,
    co_supervisors: proposal.co_supervisors.join(", "),
    groups: proposal.groups.join(", "),
    keywords: proposal.keywords.join(", "),
    expiration_date: dayjs(proposal.expiration_date).format("YYYY-MM-DD"),
  };
  delete expectedProposal.types;
  expect(proposals.find((proposal) => proposal.id === proposalId)).toEqual(
    expectedProposal,
  );
  const updateMessage = (
    await request(app)
      .put(`/api/proposals/${proposalId}`)
      .send({
        ...proposal,
        title: "Updated title",
      })
      .expect(200)
  ).body;
  expect(updateMessage.message).toBe("Proposal updated successfully");
  expectedProposal.title = "Updated title";
  const updatedProposals = (
    await request(app).get("/api/proposals").expect(200)
  ).body;
  expect(
    updatedProposals.find((proposal) => proposal.id === proposalId),
  ).toStrictEqual(expectedProposal);
  await request(app).delete(`/api/proposals/${proposalId}`).expect(200);
  const deletedProposals = (
    await request(app).get("/api/proposals").expect(200)
  ).body;
  expect(deletedProposals.find((proposal) => proposal.id === proposalId)).toBe(
    undefined,
  );
});
it("Insertion of a proposal with no notes", () => {
  const email = "marco.torchiano@teacher.it";
  isLoggedIn.mockImplementation((req, res, next) => {
    req.user = {
      email: email,
    };
    next();
  });
  proposal.notes = null;
  return request(app)
    .post("/api/proposals")
    .set("Content-Type", "application/json")
    .send(proposal)
    .expect(200);
});
/*it("Update of a proposal", () => {
  proposal.title='update';
  return request(app)
    .put("/api/proposals/32")
    .set("Content-Type", "application/json")
    .send(proposal)
    .expect(200);
});*/

it("Insertion with an invalid date", () => {
  const email = "marco.torchiano@teacher.it";
  isLoggedIn.mockImplementation((req, res, next) => {
    req.user = {
      email: email,
    };
    next();
  });
  proposal.expiration_date = "0";
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
  const email = "marco.torchiano@teacher.it";
  isLoggedIn.mockImplementation((req, res, next) => {
    req.user = {
      email: email,
    };
    next();
  });
  proposal.level = "wrong-level";
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
  const email = "marco.torchiano@teacher.it";
  isLoggedIn.mockImplementation((req, res, next) => {
    req.user = {
      email: email,
    };
    next();
  });
  proposal.groups.push("WRONG GROUP");
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
  const email = "marco.torchiano@teacher.it";
  isLoggedIn.mockImplementation((req, res, next) => {
    req.user = {
      email: email,
    };
    next();
  });
  proposal.keywords = "SOFTWARE ENGINEERING";
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
  const email = "marco.torchiano@teacher.it";
  isLoggedIn.mockImplementation((req, res, next) => {
    req.user = {
      email: email,
    };
    next();
  });
  const teacher = "s123456";
  return request(app)
    .get(`/api/applications?teacher=${teacher}`)
    .set("Content-Type", "application/json")
    .expect(200);
});

describe("Get Application From Teacher", () => {
  it("Return 200 correct get of all application of a selected student", () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });
    return request(app)
      .get(`/api/applications`)
      .set("Content-Type", "application/json")
      .expect(200);
  });
});

describe("Proposal Retrieval Tests", () => {
  it("Get all the proposals from a specific teacher", () => {
    const email = "marco.torchiano@teacher.it";
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: email,
      };
      next();
    });
    return request(app)
      .get(`/api/proposals`)
      .set("Content-Type", "application/json")
      .expect(200);
  });

  it("Return 404 for a non-existing teacher", () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      return res.status(401).json({ message: "Unauthorized" });
    });
    return request(app)
      .get(`/api/proposals`)
      .set("Content-Type", "application/json")
      .expect(401);
  });
});

describe("Application Insertion Tests", () => {
  it("Insertion of an application from a wrong student", () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "wrong.student@student.it",
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
  it("Insertion of a correct application", async () => {
    db.prepare(
      "delete from main.APPLICATIONS where main.APPLICATIONS.student_id = ?",
    ).run("s309618");
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "marco.torchiano@teacher.it",
      };
      next();
    });
    const proposalId = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal)
    ).body;
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });
    application = {
      proposal: proposalId,
    };
    return request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send(application)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual({
          student_id: "s309618",
          proposal_id: proposalId,
          state: "pending",
        });
      });
  });
  it("Insertion of an application for a student who already applied to a proposal", async () => {
    db.prepare(
      "delete from main.APPLICATIONS where main.APPLICATIONS.student_id = ?",
    ).run("s309618");
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "marco.torchiano@teacher.it",
      };
      next();
    });
    const proposalId = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal)
    ).body;
    const anotherProposalId = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal)
    ).body;
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });
    application = {
      proposal: proposalId,
    };
    await request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send({
        proposal: proposalId,
      });
    return request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send({
        proposal: anotherProposalId,
      })
      .expect(400)
      .then((response) => {
        expect(response.body).toStrictEqual({
          message: "The student s309618 has already applied to a proposal",
        });
      });
  });
});

describe("Notifications Retrieval Tests", () => {
  it("Get all the notifications from a specific student", () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });
    return request(app)
      .get(`/api/notifications`)
      .set("Content-Type", "application/json")
      .expect(200)
      .then((response) => {
        response.body.forEach((notification) => {
          expect(notification.student_id).toBe("s309618");
        });
      });
  });
});

describe("Proposal expiration tests (no virtual clock)", () => {
  beforeEach(() => {
    db.prepare("delete from main.PROPOSALS").run();
    db.prepare("delete from main.APPLICATIONS").run();
    db.prepare("update VIRTUAL_CLOCK set delta = ? where id = ?").run(0, 1);
  });

  it("a pending application for a proposal that expires should be set cancelled", async () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "marco.torchiano@teacher.it",
      };
      next();
    });

    // set expiration date to the future
    proposal.expiration_date = dayjs().add(1, "day").format("YYYY-MM-DD");

    // insert proposal
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal)
    ).body;

    // login as a student
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });

    // insert application for the previously inserted proposal
    await request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send({
        proposal: inserted_proposal_id,
      });

    // change proposal expiration to the past
    const pastDate = dayjs().subtract(2, "day").format("YYYY-MM-DD");
    db.prepare(
      "update main.PROPOSALS set expiration_date = ? where id = ?",
    ).run(pastDate, inserted_proposal_id);

    // now the application should be canceled
    await request(app)
      .get("/api/applications")
      .then((response) => {
        response.body.forEach((application) => {
          expect(application.state).toEqual("canceled");
        });
      });
  });

  it("cannot apply to a proposal expired", async () => {
    // login as professor
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "marco.torchiano@teacher.it",
      };
      next();
    });

    // set the expiration date to tomorrow
    proposal.expiration_date = dayjs().add(1, "day").format("YYYY-MM-DD");

    // insert a proposal that expires tomorrow
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal)
    ).body;

    // change proposal expiration to the past
    const pastDate = dayjs().subtract(2, "day").format("YYYY-MM-DD");
    db.prepare(
      "update main.PROPOSALS set expiration_date = ? where id = ?",
    ).run(pastDate, inserted_proposal_id);

    // login as a student
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });

    // the student should not be able to apply for this proposal since it is expired
    await request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send({
        proposal: inserted_proposal_id,
      })
      .expect(400)
      .then((response) => {
        expect(response.body).toStrictEqual({
          message: `The proposal ${inserted_proposal_id} is expired, cannot apply`,
        });
      });
  });

  it("getProposals for student shouldn't return expired proposals", async () => {
    // login as professor
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "marco.torchiano@teacher.it",
      };
      next();
    });

    // set the proposal's expiration date to tomorrow and insert it
    proposal.expiration_date = dayjs().add(1, "day").format("YYYY-MM-DD");
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal)
    ).body;

    // change proposal expiration to the past
    const pastDate = dayjs().subtract(2, "day").format("YYYY-MM-DD");
    db.prepare(
      "update main.PROPOSALS set expiration_date = ? where id = ?",
    ).run(pastDate, inserted_proposal_id);

    // login as a student
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });

    // the student should not see the proposal since the proposal (for the virtual clock) is expired
    const proposals = (await request(app).get("/api/proposals").expect(200))
      .body;
    expect(
      proposals.find((proposal) => proposal.id === inserted_proposal_id),
    ).toBe(undefined);
  });
  it("If the proposal is expired it can't be deleted", async () => {
    // login as professor
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "marco.torchiano@teacher.it",
      };
      next();
    });

    // set expiration date to the future
    proposal.expiration_date = dayjs().add(1, "day").format("YYYY-MM-DD");

    // insert proposal
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal)
    ).body;

    // change proposal expiration to the past
    const pastDate = dayjs().subtract(2, "day").format("YYYY-MM-DD");
    db.prepare(
      "update main.PROPOSALS set expiration_date = ? where id = ?",
    ).run(pastDate, inserted_proposal_id);

    const response = await request(app)
      .delete(`/api/proposals/${inserted_proposal_id}`)
      .expect(401);
    expect(response.body).toEqual({
      message: "The proposal is expired, so it cannot be deleted",
    });
  });
});

describe("test the correct flow for a proposal expiration (virtual clock)", () => {
  beforeEach(() => {
    db.prepare("delete from main.PROPOSALS").run();
    db.prepare("delete from main.APPLICATIONS").run();
  });

  it("a pending application for a proposal that expires should be set cancelled", async () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "marco.torchiano@teacher.it",
      };
      next();
    });

    // set virtual_clock to now
    db.prepare("UPDATE VIRTUAL_CLOCK SET delta = 0 WHERE id = 1").run();
    const clock = db
      .prepare("select delta from VIRTUAL_CLOCK where id = 1")
      .get();

    // set expiration date to the future
    proposal.expiration_date = dayjs()
      .add(clock.delta + 1, "day")
      .format("YYYY-MM-DD");

    // insert proposal
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal)
    ).body;

    // login as a student
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });

    // insert application for the previously inserted proposal
    await request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send({
        proposal: inserted_proposal_id,
      });

    // change the virtual clock to the future, to make the previously inserted proposal expired
    await request(app)
      .patch(`/api/virtualClock`)
      .set("Content-Type", "application/json")
      .send({
        date: dayjs()
          .add(clock.delta + 2, "day")
          .format("YYYY-MM-DD"),
      })
      .expect(200);

    // now the application should be canceled
    await request(app)
      .get("/api/applications")
      .then((response) => {
        response.body.forEach((application) => {
          expect(application.state).toEqual("canceled");
        });
      });
  });

  it("cannot apply to a proposal expired", async () => {
    // login as professor
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "marco.torchiano@teacher.it",
      };
      next();
    });

    // set the virtual clock to now
    db.prepare("UPDATE VIRTUAL_CLOCK SET delta = 0 WHERE id = 1").run();
    const clock = db
      .prepare("select delta from VIRTUAL_CLOCK where id = 1")
      .get();

    // set the expiration date to tomorrow
    proposal.expiration_date = dayjs()
      .add(clock.delta + 1, "day")
      .format("YYYY-MM-DD");

    // insert a proposal that expires tomorrow
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal)
    ).body;

    // set the virtual clock to two days after
    await request(app)
      .patch(`/api/virtualClock`)
      .set("Content-Type", "application/json")
      .send({
        date: dayjs()
          .add(clock.delta + 2, "day")
          .format("YYYY-MM-DD"),
      })
      .expect(200);

    // login as a student
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });

    // the student should not be able to apply for this proposal since it is expired
    await request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send({
        proposal: inserted_proposal_id,
      })
      .expect(400)
      .then((response) => {
        expect(response.body).toStrictEqual({
          message: `The proposal ${inserted_proposal_id} is expired, cannot apply`,
        });
      });
  });

  it("getProposals for student shouldn't return expired proposals", async () => {
    // login as professor
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "marco.torchiano@teacher.it",
      };
      next();
    });

    // set the clock to now
    db.prepare("UPDATE VIRTUAL_CLOCK SET delta = 0 WHERE id = 1").run();
    const clock = db
      .prepare("select delta from VIRTUAL_CLOCK where id = 1")
      .get();

    // set the proposal's expiration date to tomorrow and insert it
    proposal.expiration_date = dayjs()
      .add(clock.delta + 1, "day")
      .format("YYYY-MM-DD");
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal)
    ).body;

    // set the virtual clock to two days after now
    await request(app)
      .patch(`/api/virtualClock`)
      .set("Content-Type", "application/json")
      .send({
        date: dayjs()
          .add(clock.delta + 2, "day")
          .format("YYYY-MM-DD"),
      })
      .expect(200);

    // login as a student
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });

    // the student should not see the proposal since the proposal (for the virtual clock) is expired
    const proposals = (await request(app).get("/api/proposals").expect(200))
      .body;
    expect(
      proposals.find((proposal) => proposal.id === inserted_proposal_id),
    ).toBe(undefined);
  });
});

describe("Proposal acceptance", () => {
  beforeEach(() => {
    db.prepare("delete from main.PROPOSALS").run();
    db.prepare("delete from main.APPLICATIONS").run();
    db.prepare("update VIRTUAL_CLOCK set delta = ? where id = ?").run(0, 1);
  });
  it("If a proposal gets accepted for a student, other students' applications should become canceled", async () => {
    // login as professor
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "marco.torchiano@teacher.it",
      };
      next();
    });

    // set expiration date to tomorrow
    proposal.expiration_date = dayjs().add(1, "day").format("YYYY-MM-DD");

    // insert proposal
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal)
    ).body;

    // login as student1
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });

    // insert application for the previously inserted proposal
    const application = (
      await request(app)
        .post("/api/applications")
        .set("Content-Type", "application/json")
        .send({
          proposal: inserted_proposal_id,
        })
        .expect(200)
    ).body;

    // login as student2
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s308747@studenti.polito.it",
      };
      next();
    });

    // insert application for the previously inserted proposal
    await request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send({
        proposal: inserted_proposal_id,
      })
      .expect(200);

    // login as professor
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "marco.torchiano@teacher.it",
      };
      next();
    });

    // the professor accepts the proposal for the student1
    await request(app)
      .patch(`/api/applications/${application.application_id}`)
      .send({
        state: "accepted",
      })
      .expect(200);

    // login as student1
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s309618@studenti.polito.it",
      };
      next();
    });

    const applicationsStudent1 = (await request(app).get("/api/applications"))
      .body;

    expect(applicationsStudent1[0].state).toBe("accepted");

    // login as student2
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "s308747@studenti.polito.it",
      };
      next();
    });

    const applicationsStudent2 = (await request(app).get("/api/applications"))
      .body;

    expect(applicationsStudent2[0].state).toBe("canceled");
  });
});

/*describe("Delete proposals", () => {
  test("Correct elimination of a proposal", () => {
    const id = 2;
    return request(app)
      .delete(`/api/proposals/${id}`)
      .expect(200);
  });

  test("Should retrun a 400 error if the proposal is already accepted", () => {
    const id = 8;
    return request(app)
      .delete(`/api/proposals/${id}`)
      .expect(400);
  });


  test("Get 404 error for no rows eliminated", () => {
   const id = 10000;
    return request(app)
      .delete(`/api/proposals/${id}`)
      .expect(404);
  });

  test("Get 404 error for incorrect data format in", () => {
    const id = "a";
     return request(app)
       .delete(`/api/proposals/${id}`)
       .expect(400);
   });

});*/

/*describe("Update proposals", () => {
  test("Correct update of a proposal", async () => {
    const proposalId = 1; // Replace with the proposal ID you want to update
    const updatedFields = {
      // Specify the fields and their updated values
      title: "Updated Title",
      supervisor: "s940590",
      // Add other fields to update
    };

    // Send the PATCH request to update the proposal
    const response = await request(app)
      .patch(`/api/proposals/${proposalId}`)
      .send(updatedFields);

    // Check if the response status is successful (e.g., 200 OK)
    expect(response.status).toBe(200);
  });

  test("Should return 400 if the proposal is already accepted", async () => {
    const proposalId = 8; // Replace with the proposal ID you want to update
    const updatedFields = {
      // Specify the fields and their updated values
      title: "Updated Title",
      supervisor: "s940590",
      // Add other fields to update
    };

    // Send the PATCH request to update the proposal
    const response = await request(app)
      .patch(`/api/proposals/${proposalId}`)
      .send(updatedFields);

    // Check if the response status is successful (e.g., 200 OK)
    expect(response.status).toBe(400);
  });

  test("Should return 500 for an incorrect server behaviour", async () => {
    const proposalId = 1; // Replace with the proposal ID you want to update
    const updatedFields = {
      // Specify the fields and their updated values
      title: "Updated4 Title",
      supervisor: "s9405902309090",
      // Add other fields to update
    };

    // Send the PATCH request to update the proposal
    const response = await request(app)
      .patch(`/api/proposals/${proposalId}`)
      .send(updatedFields);

    // Check if the response status is successful (e.g., 200 OK)
    expect(response.status).toBe(500);
  });
});*/
