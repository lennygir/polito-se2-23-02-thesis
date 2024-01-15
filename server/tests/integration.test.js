"use strict";
const request = require("supertest");
const { app } = require("../src/server");
const dayjs = require("dayjs");
const { db } = require("../src/db");
const {
  logIn,
  insertProposal,
  archiveProposal,
  applyForProposal,
  getApplications,
  rejectApplication,
  getProposals,
  modifyProposal,
  acceptApplication,
  uploadPDFToApplication,
  retrievePDFFromApplication,
  deleteProposal,
  unauthorizedLogIn,
  getNotifications,
  setClock,
  startRequest,
  getRequests,
  approveRequest,
  rejectRequest,
  requestChangesForRequest,
  modifyRequest,
} = require("../test_utils/requests");
const { createPDF } = require("../test_utils/pdf");

jest.mock("../src/db");
jest.mock("../src/protect-routes");

let proposal, start_request;

beforeEach(() => {
  proposal = {
    title: "Test title",
    co_supervisors: ["maurizio.morisio@teacher.it", "luigi.derussis@teacher.it"],
    groups: ["SOFTENG"],
    keywords: ["SOFTWARE ENGINEERING", "SOFTWARE DEVELOPMENT"],
    types: ["EXPERIMENTAL", "RESEARCH"],
    description: "Test description.",
    required_knowledge: "Test knowledge required",
    notes: "Test notes",
    expiration_date: dayjs().add(1, "day").format("YYYY-MM-DD"),
    level: "MSC",
    cds: "LM-32-D",
  };
  start_request = {
    title: "Title",
    supervisor: "s123456",
    description: "description",
    co_supervisors: ["luigi.derussis@teacher.it", "fulvio.corno@teacher.it"],
  };
  db.prepare("update VIRTUAL_CLOCK set delta = ? where id = ?").run(0, 1);
  db.prepare("delete from main.PROPOSALS").run();
  db.prepare("delete from main.APPLICATIONS").run();
  db.prepare("delete from main.NOTIFICATIONS").run();
  db.prepare("delete from START_REQUESTS").run();
});

describe("Protected routes", () => {
  it("Sets the logged in user", async () => {
    const email = "marco.torchiano@teacher.it";
    logIn(email);
    const user = (await request(app).get("/api/sessions/current").expect(200))
      .body;
    expect(user.email).toBe(email);
  });
  it("Insertion of a correct proposal by a professor", async () => {
    logIn("marco.torchiano@teacher.it");
    const response = await insertProposal(proposal);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});

describe("Get single proposal", () => {
  it("Correct behavior", async () => {
    logIn("marco.torchiano@teacher.it");
    const proposal_id = (await insertProposal(proposal)).body;
    logIn("s309618@studenti.polito.it");
    const application = (await applyForProposal(proposal_id)).body;
    logIn("marco.torchiano@teacher.it");
    await acceptApplication(application.application_id);
    logIn("s309618@studenti.polito.it");
    await request(app).get(`/api/proposals/${proposal_id}`).expect(200);
  });
});

describe("Story 12: Archive Proposals", () => {
  const past_date = dayjs().subtract(7, "day").format("YYYY-MM-DD");
  it("If a proposal becomes archived, a student should not be able to apply for it", async () => {
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;
    await archiveProposal(inserted_proposal_id);

    logIn("s309618@studenti.polito.it");
    const response = await applyForProposal(inserted_proposal_id);

    expect(response.status).toBe(401);
  });
  it("If I reject an application its proposal should not become archived", async () => {
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    logIn("s309618@studenti.polito.it");
    const insertedApplication = (await applyForProposal(inserted_proposal_id))
      .body;

    logIn("marco.torchiano@teacher.it");
    const applications = (await getApplications()).body;
    const applicationToBeRejected = applications.find(
      (application) => application.id === insertedApplication.application_id,
    );
    await rejectApplication(applicationToBeRejected.id);
    const proposals = (await getProposals()).body;

    expect(
      proposals.find((proposal) => proposal.id === inserted_proposal_id),
    ).toHaveProperty("archived", false);
  });
  it("A proposal manually archived should not be modifiable", async () => {
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    const first_modification = await modifyProposal(
      inserted_proposal_id,
      proposal,
    );
    expect(first_modification.status).toBe(200);

    await archiveProposal(inserted_proposal_id);

    const second_modification = await modifyProposal(
      inserted_proposal_id,
      proposal,
    );
    expect(second_modification.status).toBe(401);
  });
  it("Create a proposal, then archive it", async () => {
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    const response = await archiveProposal(inserted_proposal_id);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("archived", true);

    // get all the proposals
    const proposals = (await getProposals()).body;
    expect(proposals[0]).toHaveProperty("id", inserted_proposal_id);
    expect(proposals[0]).toHaveProperty("archived", true);
  });
  it("Multiple tries should not trigger any errors (idempotency)", async () => {
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    // archive the proposal the first time
    await archiveProposal(inserted_proposal_id);

    // archive the proposal for the second time
    const response = await archiveProposal(inserted_proposal_id);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("archived", true);
  });

  it("An expired proposal should be archived", async () => {
    proposal.expiration_date = past_date;

    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;
    const proposals = (await getProposals()).body;
    expect(
      proposals.find((proposal) => proposal.id === inserted_proposal_id),
    ).toHaveProperty("archived", true);
  });
  it("The admitted field on the body should be only 'true'", async () => {
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    // try to archive with a wrong request body
    await request(app)
      .patch(`/api/proposals/${inserted_proposal_id}`)
      .set("Content-Type", "application/json")
      .send({
        archived: "something else",
      })
      .expect(400);

    const proposals = (await getProposals()).body;

    // the proposal should remain unarchived
    expect(
      proposals.find((proposal) => proposal.id === inserted_proposal_id),
    ).toHaveProperty("archived", false);
  });

  it("If a proposal is manually archived, its pending applications become canceled", async () => {
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    logIn("s309618@studenti.polito.it");

    await applyForProposal(inserted_proposal_id);

    logIn("marco.torchiano@teacher.it");

    await archiveProposal(inserted_proposal_id);

    logIn("s309618@studenti.polito.it");

    // the student gets all his applications
    const applications = (await getApplications()).body;

    expect(applications[0]).toHaveProperty("state", "canceled");

    logIn("marco.torchiano@teacher.it");

    const teacherApplications = (await getApplications()).body;
    expect(teacherApplications[0]).toHaveProperty("state", "canceled");
  });

  it("The proposal should exist", async () => {
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    const wrong_proposal_id = inserted_proposal_id + 1;

    const response = await archiveProposal(wrong_proposal_id);
    expect(response.status).toBe(404);
  });

  it("A professor should be able to archive only proposals created by him", async () => {
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    logIn("luigi.derussis@teacher.it");

    // luigi.derussis wants to set marco.torchiano's proposal 'archived'
    const response = await archiveProposal(inserted_proposal_id);
    expect(response.status).toBe(401);
  });

  it("Get only active/inactive proposals", async () => {
    logIn("marco.torchiano@teacher.it");
    // insert 5 not archived proposals
    for (let i = 0; i < 5; i++) {
      await insertProposal(proposal);
    }

    // insert 5 archived proposals
    proposal.expiration_date = past_date;
    for (let i = 0; i < 5; i++) {
      await insertProposal(proposal);
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
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    logIn("s309618@studenti.polito.it");
    await applyForProposal(inserted_proposal_id);

    logIn("marco.torchiano@teacher.it");
    // marco.torchiano finds the application id
    const applications = (await getApplications()).body;

    // the proposal should not be archived
    let proposals = (await getProposals()).body;
    expect(
      proposals.find((proposal) => proposal.id === inserted_proposal_id),
    ).toHaveProperty("archived", false);

    // accept application
    await acceptApplication(applications[0].id);

    // now the proposal should be archived
    proposals = (await getProposals()).body;
    expect(
      proposals.find((proposal) => proposal.id === inserted_proposal_id),
    ).toHaveProperty("archived", true);
  });
  it("A student should be able to see only active proposals", async () => {
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;
    const response = await archiveProposal(inserted_proposal_id);

    expect(response.status).toBe(200);

    const archived_proposal = response.body;

    logIn("s309618@studenti.polito.it");
    const response2 = await getProposals();

    expect(response2.status).toBe(200);
    const proposals = response2.body;
    expect(
      proposals.find((proposal) => proposal.id === archived_proposal.id),
    ).toBeUndefined();
  });
});

describe("Story 13: student CV", () => {
  //it("Try to upload a pdf from the path", async () => {
  //  // login as professor
  //  isLoggedIn.mockImplementation((req, res, next) => {
  //    req.user = {
  //      email: "marco.torchiano@teacher.it",
  //    };
  //    next();
  //  });
  //  // insert proposal
  //  const proposal_body = {
  //    title: "New proposal",
  //    co_supervisors: ["s122349@gmail.com", "s298399@outlook.com"],
  //    groups: ["SOFTENG"],
  //    keywords: ["SOFTWARE ENGINEERING", "SOFTWARE DEVELOPMENT"],
  //    types: ["EXPERIMENTAL", "RESEARCH"],
  //    description: "This proposal is used to test the archiving functionality",
  //    required_knowledge: "You have to know how to archive the thesis",
  //    notes: null,
  //    expiration_date: dayjs().format("YYYY-MM-DD"),
  //    level: "MSC",
  //    cds: "L-8-F",
  //  };
  //  const proposalId = (
  //    await request(app)
  //      .post("/api/proposals")
  //      .set("Content-Type", "application/json")
  //      .send(proposal_body)
  //      .expect(200)
  //  ).body;
  //  // login as a student
  //  isLoggedIn.mockImplementation((req, res, next) => {
  //    req.user = {
  //      email: "s309618@studenti.polito.it",
  //    };
  //    next();
  //  });
  //  // insert application for proposal
  //  await request(app)
  //    .post("/api/applications")
  //    .set("Content-Type", "application/json")
  //    .send({
  //      proposal: proposalId,
  //    })
  //    .expect(200);

  //  // get application id
  //  const applications = (
  //    await request(app).get("/api/applications").expect(200)
  //  ).body;

  //  // insert pdf for application
  //  const pdf = await readPDF(
  //    "/home/lorber13/Scaricati/A4-mid-to-hi-fidelity-1.pdf",
  //  );
  //  const response = await request(app)
  //    .patch(`/api/applications/${applications[0].id}`)
  //    .set("Content-Type", "application/pdf")
  //    .send(pdf)
  //    .expect(200);
  //  expect(response.body).toEqual({ message: "File uploaded correctly" });

  //  // log in as professor
  //  isLoggedIn.mockImplementation((req, res, next) => {
  //    req.user = {
  //      email: "marco.torchiano@teacher.it",
  //    };
  //    next();
  //  });

  //  // retrieve pdf file
  //  const expectedPdf = (
  //    await request(app)
  //      .get(`/api/applications/${applications[0].id}/attached-file`)
  //      .expect(200)
  //  ).body;
  //  await writePDF("/home/lorber13/Scaricati/test.pdf", expectedPdf);
  //  expect(expectedPdf).toEqual(pdf);
  //});
  it("Try to upload a pdf", async () => {
    logIn("marco.torchiano@teacher.it");
    const proposalId = (await insertProposal(proposal)).body;

    logIn("s309618@studenti.polito.it");
    const response = await applyForProposal(proposalId);

    expect(response.status).toBe(200);

    // get application id
    const response2 = await getApplications();
    expect(response2.status).toBe(200);
    const application = response2.body[0];

    // insert pdf for application
    const pdf = await createPDF();
    const pdf_response = await uploadPDFToApplication(pdf, application.id);
    expect(pdf_response.status).toBe(200);
    expect(pdf_response.body).toEqual({ message: "File uploaded correctly" });

    // log in as professor
    logIn("marco.torchiano@teacher.it");

    // retrieve pdf file
    const retrieved_pdf_response = await retrievePDFFromApplication(
      application.id,
    );
    expect(retrieved_pdf_response.status).toBe(200);
    expect(retrieved_pdf_response.body).toEqual(pdf);
  });
});

it("prova", async () => {
  logIn("marco.torchiano@teacher.it");
  const proposal_id = (await insertProposal(proposal)).body;
  let expected_proposal = {
    ...proposal,
    supervisor: "s123456", // marco.torchiano@teacher.it's id
    type: proposal.types.join(", "),
    id: proposal_id,
    co_supervisors: proposal.co_supervisors.join(", "),
    groups: proposal.groups.join(", "),
    keywords: proposal.keywords.join(", "),
    manually_archived: 0,
    deleted: 0,
    expiration_date: dayjs(proposal.expiration_date).format("YYYY-MM-DD"),
  };
  delete expected_proposal.types;
  let returned_proposal = db
    .prepare("select * from main.PROPOSALS where id = ?")
    .get(proposal_id);
  expect(returned_proposal).toEqual(expected_proposal);
});

it("CRUD on proposal", async () => {
  logIn("marco.torchiano@teacher.it");
  const proposalId = (await insertProposal(proposal)).body;
  const proposals = (await getProposals()).body;
  const res_proposal = (
    await request(app).get(`/api/proposals/${proposalId}`).expect(200)
  ).body;
  let expectedProposal = {
    ...proposal,
    supervisor: "s123456", // marco.torchiano@teacher.it
    type: proposal.types.join(", "),
    id: proposalId,
    co_supervisors: proposal.co_supervisors.join(", "),
    groups: proposal.groups.join(", "),
    keywords: proposal.keywords.join(", "),
    expiration_date: dayjs(proposal.expiration_date).format("YYYY-MM-DD"),
    archived: false,
  };
  delete expectedProposal.types;
  expect(proposals.find((proposal) => proposal.id === proposalId)).toEqual(
    expectedProposal,
  );
  expect(res_proposal).toEqual(expectedProposal);
  const response = await modifyProposal(proposalId, {
    ...proposal,
    title: "Updated title",
  });
  expect(response.status).toBe(200);
  const updateMessage = response.body;
  expect(updateMessage.message).toBe("Proposal updated successfully");
  expectedProposal.title = "Updated title";
  const response2 = await getProposals();
  const res_modified_proposal = (
    await request(app).get(`/api/proposals/${proposalId}`).expect(200)
  ).body;
  expect(response2.status).toBe(200);
  const updatedProposals = response2.body;
  expect(
    updatedProposals.find((proposal) => proposal.id === proposalId),
  ).toEqual(expectedProposal);
  expect(res_modified_proposal).toEqual(expectedProposal);
  const delete_response = await deleteProposal(proposalId);
  expect(delete_response.status).toBe(200);
  const response_after_delete = await getProposals();
  const deleted_proposal = (
    await request(app).get(`/api/proposals/${proposalId}`).expect(404)
  ).body;
  expect(response_after_delete.status).toBe(200);
  const deletedProposals = response_after_delete.body;
  expect(deletedProposals.find((proposal) => proposal.id === proposalId)).toBe(
    undefined,
  );
  expect(deleted_proposal).toEqual({
    message: "Proposal not found",
  });
});

describe("Proposal insertion tests", () => {
  it("Insertion of a proposal with no notes", async () => {
    proposal.notes = null;

    logIn("marco.torchiano@teacher.it");
    const response = await insertProposal(proposal);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
  it("Insertion with an invalid date", async () => {
    proposal.expiration_date = "0";

    logIn("marco.torchiano@teacher.it");
    const response = await insertProposal(proposal);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid proposal content");
  });
  it("Insertion of a proposal with wrong level format", async () => {
    proposal.level = "wrong-level";

    logIn("marco.torchiano@teacher.it");
    const response = await insertProposal(proposal);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid proposal content");
  });
  it("Insertion of a proposal with an invalid group", async () => {
    proposal.groups.push("WRONG GROUP");

    logIn("marco.torchiano@teacher.it");
    const response = await insertProposal(proposal);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid proposal content");
  });
  it("Insertion of a proposal with a single keyword (no array)", async () => {
    proposal.keywords = "SOFTWARE ENGINEERING";
    logIn("marco.torchiano@teacher.it");
    const response = await insertProposal(proposal);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid proposal content");
  });
});

describe("Proposals retrieval tests", () => {
  it("Return correctly the applications for a teacher (even if there are no applications)", async () => {
    logIn("marco.torchiano@teacher.it");
    const response = await getApplications();

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });
  it("Return correctly the applications for a student (even if there are no applications)", async () => {
    logIn("s309618@studenti.polito.it");
    const response = await getApplications();

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });
  it("Return 404 for a non-existing teacher", async () => {
    unauthorizedLogIn();
    const response = await getApplications();
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Unauthorized" });
  });
});

describe("Application Insertion Tests", () => {
  it("Insertion of an application from a wrong student", async () => {
    logIn("marco.torchiano@teacher.it");
    const proposal_id = (await insertProposal(proposal)).body;

    logIn("wrong.student@student.it");
    const response = await applyForProposal(proposal_id);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Only a student can apply for a proposal",
    });
  });
  it("Insertion of a correct application", async () => {
    logIn("marco.torchiano@teacher.it");
    const proposalId = (await insertProposal(proposal)).body;

    logIn("s309618@studenti.polito.it");
    const response = await applyForProposal(proposalId);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("state", "pending");
    expect(response.body).toHaveProperty("proposal_id", proposalId);
    expect(response.body).toHaveProperty("student_id", "s309618");
    expect(response.body).toHaveProperty("application_id");
  });
  it("Insertion of an application for a student who already applied to a proposal", async () => {
    logIn("marco.torchiano@teacher.it");
    const proposalId = (await insertProposal(proposal)).body;
    const anotherProposalId = (await insertProposal(proposal)).body;

    logIn("s309618@studenti.polito.it");
    await applyForProposal(proposalId);

    const response = await applyForProposal(anotherProposalId);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "The student s309618 has already applied to a proposal",
    });
  });
});

describe("Notifications Retrieval Tests", () => {
  it("Get a notification if the professor accepts the application", async () => {
    logIn("marco.torchiano@teacher.it");
    const proposal_id = (await insertProposal(proposal)).body;

    logIn("s309618@studenti.polito.it");
    const application = (await applyForProposal(proposal_id)).body;

    logIn("marco.torchiano@teacher.it");
    await acceptApplication(application.application_id);

    logIn("s309618@studenti.polito.it");
    const response = await getNotifications();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    response.body.forEach((notification) => {
      expect(notification.student_id).toBe("s309618");
    });
  });
  it("Get a notification if the professor rejects the application", async () => {
    logIn("marco.torchiano@teacher.it");
    const proposal_id = (await insertProposal(proposal)).body;

    logIn("s309618@studenti.polito.it");
    const application = (await applyForProposal(proposal_id)).body;

    logIn("marco.torchiano@teacher.it");
    await rejectApplication(application.application_id);

    logIn("s309618@studenti.polito.it");
    const response = await getNotifications();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    response.body.forEach((notification) => {
      expect(notification.student_id).toBe("s309618");
    });
  });
});

describe("Proposal expiration tests (no virtual clock)", () => {
  it("Pending application for a proposal that expires", async () => {
    // set expiration date to the future
    proposal.expiration_date = dayjs().add(1, "day").format("YYYY-MM-DD");

    // the professor inserts a proposal
    logIn("maurizio.morisio@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    // the student applies for the proposal
    logIn("s309618@studenti.polito.it");
    await applyForProposal(inserted_proposal_id);

    // the proposal of the application expires
    const pastDate = dayjs().subtract(2, "day").format("YYYY-MM-DD");
    db.prepare(
      "update main.PROPOSALS set expiration_date = ? where id = ?",
    ).run(pastDate, inserted_proposal_id);

    // another professor inserts a proposal
    logIn("luigi.derussis@teacher.it");
    proposal.expiration_date = dayjs().add(1, "day").format("YYYY-MM-DD");
    proposal.groups = ["ELITE"];
    const notExpiredProposalId = (await insertProposal(proposal)).body;

    // the same student, now that the previous proposal is expired, can apply to another proposal
    logIn("s309618@studenti.polito.it");
    const response = await applyForProposal(notExpiredProposalId);
    expect(response.status).toBe(200); // should not give an error
  });
  it("a pending application for a proposal that expires should be set cancelled", async () => {
    // set expiration date to the future
    proposal.expiration_date = dayjs().add(1, "day").format("YYYY-MM-DD");

    // the professor inserts a proposal
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    // the student applies for that proposal
    logIn("s309618@studenti.polito.it");
    await applyForProposal(inserted_proposal_id);

    // the proposal expires
    const pastDate = dayjs().subtract(2, "day").format("YYYY-MM-DD");
    db.prepare(
      "update main.PROPOSALS set expiration_date = ? where id = ?",
    ).run(pastDate, inserted_proposal_id);

    // now the application should be canceled
    const applications = (await getApplications()).body;
    applications.forEach((application) => {
      expect(application.state).toEqual("canceled");
    });
  });

  it("cannot apply to a proposal expired", async () => {
    // set the expiration date to tomorrow
    proposal.expiration_date = dayjs().add(1, "day").format("YYYY-MM-DD");
    proposal.groups = ["ELITE"];

    // the professor inserts a proposal
    logIn("fulvio.corno@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    // the proposal expires
    const pastDate = dayjs().subtract(2, "day").format("YYYY-MM-DD");
    db.prepare(
      "update main.PROPOSALS set expiration_date = ? where id = ?",
    ).run(pastDate, inserted_proposal_id);

    // the student should not be able to apply for this proposal since it is expired
    logIn("s309618@studenti.polito.it");
    const response = await applyForProposal(inserted_proposal_id);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: `The proposal ${inserted_proposal_id} is archived, cannot apply`,
    });
  });

  it("getProposals for student shouldn't return expired proposals", async () => {
    proposal.expiration_date = dayjs().add(1, "day").format("YYYY-MM-DD");

    // the professor inserts a proposal
    logIn("maurizio.morisio@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    // the proposal expires
    const pastDate = dayjs().subtract(2, "day").format("YYYY-MM-DD");
    db.prepare(
      "update main.PROPOSALS set expiration_date = ? where id = ?",
    ).run(pastDate, inserted_proposal_id);

    // the student should not see the proposal since the proposal is expired
    logIn("s309618@studenti.polito.it");
    const response = await getProposals();

    expect(response.status).toBe(200);
    const proposals = response.body;
    expect(
      proposals.find((proposal) => proposal.id === inserted_proposal_id),
    ).toBe(undefined);
  });
  it("If the proposal is expired it can't be deleted", async () => {
    proposal.expiration_date = dayjs().add(1, "day").format("YYYY-MM-DD");

    // the professor inserts a proposal
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    // the proposal expires
    const pastDate = dayjs().subtract(2, "day").format("YYYY-MM-DD");
    db.prepare(
      "update main.PROPOSALS set expiration_date = ? where id = ?",
    ).run(pastDate, inserted_proposal_id);

    const response = await deleteProposal(inserted_proposal_id);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "The proposal is expired, so it cannot be deleted",
    });
  });
});

describe("test the correct flow for a proposal expiration (virtual clock)", () => {
  it("a pending application for a proposal that expires should be set canceled", async () => {
    proposal.expiration_date = dayjs().add(1, "day").format("YYYY-MM-DD");

    // the professor inserts a proposal
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    // the student applies for that proposal
    logIn("s309618@studenti.polito.it");
    await applyForProposal(inserted_proposal_id);

    // change the virtual clock to the future, to make the previously inserted proposal expired
    await setClock(2);

    // now the application should be canceled
    const applications = (await getApplications()).body;
    applications.forEach((application) => {
      expect(application.state).toBe("canceled");
    });
  });

  it("cannot apply to a proposal expired", async () => {
    proposal.expiration_date = dayjs().add(1, "day").format("YYYY-MM-DD");

    // the professor inserts a proposal
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    // change the virtual clock to the future, to make the previously inserted proposal expired
    await setClock(2);

    // the student applies for that proposal
    logIn("s309618@studenti.polito.it");
    const response = await applyForProposal(inserted_proposal_id);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: `The proposal ${inserted_proposal_id} is archived, cannot apply`,
    });
  });

  it("getProposals for student shouldn't return expired proposals", async () => {
    proposal.expiration_date = dayjs().add(1, "day").format("YYYY-MM-DD");

    // the professor inserts a proposal
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    // set the virtual clock to two days after now
    await setClock(2);

    // login as a student
    logIn("s309618@studenti.polito.it");

    // the student should not see the proposal since the proposal (for the virtual clock) is expired
    const response = await getProposals();
    expect(response.status).toBe(200);
    const proposals = response.body;
    expect(
      proposals.find((proposal) => proposal.id === inserted_proposal_id),
    ).toBe(undefined);
  });

  it("A proposal that expires should become archived", async () => {
    // set expiration date to the future
    proposal.expiration_date = dayjs().add(3, "day").format("YYYY-MM-DD");

    // the professor inserts a proposal
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    // set the expiration date to the past
    const pastDate = dayjs().subtract(3, "day").format("YYYY-MM-DD");
    db.prepare("update PROPOSALS set expiration_date = ? where id = ?").run(
      pastDate,
      inserted_proposal_id,
    );

    // now the proposal should be archived
    const response = await getProposals();
    expect(response.status).toBe(200);
    const proposals = response.body;
    expect(proposals[0]).toHaveProperty("archived", true);
  });

  it("A proposal that expires today should not be archived", async () => {
    // set expiration date to the future
    proposal.expiration_date = dayjs().add(3, "day").format("YYYY-MM-DD");

    // the professor inserts a proposal
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    // set the expiration date to today
    const today = dayjs().format("YYYY-MM-DD");
    db.prepare("update PROPOSALS set expiration_date = ? where id = ?").run(
      today,
      inserted_proposal_id,
    );

    // the proposal should not be archived
    const response = await getProposals();
    expect(response.status).toBe(200);
    const proposals = response.body;
    expect(proposals[0]).toHaveProperty("archived", false);
  });
});

describe("Proposal acceptance", () => {
  it("If a proposal gets accepted for a student, other students' applications should become canceled", async () => {
    proposal.expiration_date = dayjs().add(1, "day").format("YYYY-MM-DD");

    // the professor inserts a proposal
    logIn("marco.torchiano@teacher.it");
    const inserted_proposal_id = (await insertProposal(proposal)).body;

    // the student1 applies for that proposal
    logIn("s309618@studenti.polito.it");
    const { body: application } = await applyForProposal(inserted_proposal_id);

    // the student2 applies for that proposal
    logIn("s308747@studenti.polito.it");
    const { status } = await applyForProposal(inserted_proposal_id);

    expect(status).toBe(200);

    // the professor accepts the proposal for the student1
    logIn("marco.torchiano@teacher.it");
    const response = await acceptApplication(application.application_id);

    expect(response.status).toBe(200);

    // student1 gets the applications; there should be the accepted application
    logIn("s309618@studenti.polito.it");

    const applicationsStudent1 = (await getApplications()).body;

    expect(applicationsStudent1[0].state).toBe("accepted");

    // student2 gets the applications; its application should be canceled
    logIn("s308747@studenti.polito.it");
    const applicationsStudent2 = (await getApplications()).body;

    expect(applicationsStudent2[0].state).toBe("canceled");
  });
});
describe("Virtual clock", () => {
  it("Setting the virtual clock two times", async () => {
    logIn();

    // set the virtual clock to 7 days after
    const { status } = await setClock(7);
    expect(status).toBe(200);

    // set the virtual clock to 8 days after
    const { status: status2 } = await setClock(8);
    expect(status2).toBe(200);
  });
});

describe("Story Insert Student Request", () => {
  it("Correct student request insertion", async () => {
    logIn("s309618@studenti.polito.it");
    const response = await startRequest(start_request);
    expect(response.status).toBe(200);
  });
  it("Two different students insert a request", async () => {
    logIn("s309618@studenti.polito.it");
    const response = await startRequest(start_request);
    expect(response.status).toBe(200);

    logIn("s308747@studenti.polito.it");
    const response2 = await startRequest({
      title: "New Title",
      supervisor: "s234567",
      description: "different description",
    });
    expect(response2.status).toBe(200);
  });
  it("The same student inserts a request two times", async () => {
    logIn("s309618@studenti.polito.it");

    const response = await startRequest(start_request);
    expect(response.status).toBe(200);

    const response2 = await startRequest({
      title: "New Title",
      supervisor: "s234567",
      description: "different description",
    });
    expect(response2.status).toBe(409);
  });
  it("You must be a student to start a request", async () => {
    logIn("marco.torchiano@teacher.it");
    const response = await startRequest(start_request);
    expect(response.status).toBe(401);
  });
  it("The supervisor must exist", async () => {
    start_request.supervisor = "s000000";

    logIn("s309618@studenti.polito.it");
    const response = await startRequest(start_request);
    expect(response.status).toBe(400);
  });
});

async function evaluateRequestTest(approve) {
  start_request.supervisor = "s234567"; // maurizio.morisio@teacher.it

  logIn("s308747@studenti.polito.it");
  const response = await startRequest(start_request);
  expect(response.status).toBe(200);
  const thesisRequestId = response.body;

  logIn("laura.ferrari@example.com");

  // get all thesis requests
  const { body: thesisRequests, status } = await getRequests();
  expect(status).toBe(200);
  expect(thesisRequests).toContainEqual({
    ...start_request,
    id: thesisRequestId,
    supervisor: "maurizio.morisio@teacher.it",
    student_id: "s308747",
    status: "requested",
  });

  let status2;
  if (approve) {
    // approve the request
    status2 = (await approveRequest(thesisRequestId)).status;
  } else {
    // reject the request
    status2 = (await rejectRequest(thesisRequestId)).status;
  }
  expect(status2).toBe(200);

  let request_status = approve ? "secretary_accepted" : "rejected";

  // get all thesis requests
  const { body: newThesisRequests, status: status3 } = await getRequests();
  expect(status3).toBe(200);
  expect(newThesisRequests).toContainEqual({
    ...start_request,
    id: thesisRequestId,
    supervisor: "maurizio.morisio@teacher.it",
    student_id: "s308747",
    status: request_status,
  });
}

describe("Secretary clerk story", () => {
  it("Approve a student thesis request", async () => {
    await evaluateRequestTest(true);
  });
  it("Reject a student thesis request", async () => {
    await evaluateRequestTest(false);
  });
  it("If a student thesis request is already evaluated, it should not be approved/rejected", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it

    logIn("s309618@studenti.polito.it");
    const response = await startRequest(start_request);
    expect(response.status).toBe(200);
    const thesisRequestId = response.body;

    logIn("laura.ferrari@example.com");

    // approve the thesis request
    const { status } = await approveRequest(thesisRequestId);
    expect(status).toBe(200);

    // reject the thesis request, again
    const { status: status2 } = await rejectRequest(thesisRequestId);
    expect(status2).toBe(401);

    // get all thesis requests
    const { body: newThesisRequests, status: status3 } = await getRequests();
    expect(status3).toBe(200);

    // the thesis should remain untouched
    expect(newThesisRequests).toContainEqual({
      ...start_request,
      id: thesisRequestId,
      supervisor: "marco.torchiano@teacher.it",
      student_id: "s309618",
      status: "secretary_accepted",
    });
  });
  it("To approve/reject a student thesis request you must be a secretary clerk", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it

    logIn("s309618@studenti.polito.it");
    const response = await startRequest(start_request);
    expect(response.status).toBe(200);
    const thesisRequestId = response.body;

    // try to approve the thesis request
    const { status } = await approveRequest(thesisRequestId);
    expect(status).toBe(401);

    // try to reject the thesis request
    const { status: status2 } = await rejectRequest(thesisRequestId);
    expect(status2).toBe(401);

    logIn("laura.ferrari@example.com");

    // get all the requests
    const { body: newThesisRequests, status: status3 } = await getRequests();
    expect(status3).toBe(200);

    // the thesis should remain untouched
    expect(newThesisRequests).toContainEqual({
      ...start_request,
      id: thesisRequestId,
      supervisor: "marco.torchiano@teacher.it",
      student_id: "s309618",
      status: "requested",
    });
  });
  it("The thesis request should exist", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it

    logIn("s309618@studenti.polito.it");
    const response = await startRequest(start_request);
    const thesisRequestId = response.body;

    const notExistentRequestId = thesisRequestId + 1;
    logIn("laura.ferrari@example.com");

    // try to approve the thesis request
    const { status } = await approveRequest(notExistentRequestId);
    expect(status).toBe(404);

    // try to reject the thesis request
    const { status: status2 } = await rejectRequest(notExistentRequestId);
    expect(status2).toBe(404);

    logIn("marco.torchiano@teacher.it");

    // try to approve the thesis request
    const { status: status3 } = await approveRequest(notExistentRequestId);
    expect(status3).toBe(404);

    // try to reject the thesis request
    const { status: status4 } = await rejectRequest(notExistentRequestId);
    expect(status4).toBe(404);

    // try to request changes for the request
    const response2 = await requestChangesForRequest(notExistentRequestId);
    expect(response2.status).toBe(404);
  });
  /*it("A student can view only his thesis requests, whereas the secretary clerk can view all the requests", async () => {
    logIn("s309618@studenti.polito.it");

    // insert a thesis request
    await request(app)
      .post("/api/start-requests")
      .set("Content-Type", "application/json")
      .send({
        title: "Title",
        supervisor: "s123456",
        description: "description",
      })
      .expect(200);

    logIn("s308747@studenti.polito.it");

    // insert a thesis request
    await request(app)
      .post("/api/start-requests")
      .set("Content-Type", "application/json")
      .send({
        title: "Different title",
        supervisor: "s234567",
        description: "different description",
      })
      .expect(200);

    // get all the requests as student 2
    const student2ThesisRequests = (
      await request(app).get("/api/start-requests").expect(200)
    ).body;

    expect(student2ThesisRequests).toHaveLength(1);
    expect(student2ThesisRequests).toContain({
      title: "Different title",
      supervisor: "maurizio.morisio@teacher.it",
      description: "different description",
      status: "requested",
    });

    // back to student1
    logIn("s309618@studenti.polito.it");

    // get all the requests as student 1
    const student1ThesisRequests = (
      await request(app).get("/api/start-requests").expect(200)
    ).body;
    expect(student1ThesisRequests).toHaveLength(1);
    expect(student1ThesisRequests).toContain({
      title: "Title",
      supervisor: "marco.torchiano@teacher.it",
      description: "description",
      status: "requested",
    });

    // login as secretary clerk
    logIn("laura.ferrari@example.com");

    // get all the requests as secretary clerk
    const secretaryThesisRequests = (
      await request(app).get("/api/start-requests").expect(200)
    ).body;
    expect(secretaryThesisRequests).toHaveLength(2);
    expect(secretaryThesisRequests).toContain({
      title: "Title",
      supervisor: "marco.torchiano@teacher.it",
      student: "s309618",
      description: "description",
      status: "requested",
    });
    expect(secretaryThesisRequests).toContain({
      title: "Different title",
      supervisor: "maurizio.morisio@teacher.it",
      student: "s308747",
      description: "different description",
      status: "requested",
    });
  });
   */
  it("An empty list of thesis requests is not an error", async () => {
    logIn("laura.ferrari@example.com");

    // get all the requests
    const { body: emptyThesisRequests, status } = await getRequests();
    expect(status).toBe(200);
    expect(emptyThesisRequests).toHaveLength(0);
  });
});

describe("Delete proposals", () => {
  it("You should not be able to archive a proposal deleted", async () => {
    logIn("marco.torchiano@teacher.it");

    // insert a proposal
    const { body: id, status } = await insertProposal(proposal);
    expect(status).toBe(200);

    // delete the proposal
    const { status: status2 } = await deleteProposal(id);
    expect(status2).toBe(200);

    // archive the proposal
    const { status: status3 } = await archiveProposal(id);
    expect(status3).toBe(404);
  });
  it("You should not be able to apply for a proposal deleted", async () => {
    logIn("marco.torchiano@teacher.it");

    // insert a proposal
    const { body: id, status } = await insertProposal(proposal);
    expect(status).toBe(200);

    // delete the proposal
    const { status: status2 } = await deleteProposal(id);
    expect(status2).toBe(200);

    logIn("s309618@studenti.polito.it");

    // apply for the proposal
    const { status: status3 } = await applyForProposal(id);
    expect(status3).toBe(404);
  });
  it("You should not be able to update a proposal deleted", async () => {
    logIn("marco.torchiano@teacher.it");

    // insert a proposal
    const { body: id, status } = await insertProposal(proposal);
    expect(status).toBe(200);

    // delete the proposal
    const { status: status2 } = await deleteProposal(id);
    expect(status2).toBe(200);

    // update the proposal
    const { body: updateMessage, status: status3 } = await modifyProposal(id, {
      ...proposal,
      title: "Updated title",
    });
    expect(status3).toBe(404);
    expect(updateMessage).toEqual({
      message: "Proposal not found",
    });
  });
});

describe("Story 28: the professor evaluates student request", () => {
  it("The professor accepts without requesting changes", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it
    logIn("s309618@studenti.polito.it");

    const thesis_request_id = (await startRequest(start_request)).body;

    logIn("laura.ferrari@example.com");
    let thesis_requests = (await getRequests()).body;

    expect(thesis_requests).toHaveLength(1);
    expect(thesis_requests[0]).toHaveProperty("status", "requested");

    await approveRequest(thesis_request_id);
    thesis_requests = (await getRequests()).body;

    expect(thesis_requests).toHaveLength(1);
    expect(thesis_requests[0]).toHaveProperty("status", "secretary_accepted");

    logIn("marco.torchiano@teacher.it");

    let response = await getRequests();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("status", "secretary_accepted");

    await approveRequest(thesis_request_id);
    response = await getRequests();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("status", "started");
  });
  it("The professor rejects", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it
    logIn("s309618@studenti.polito.it");

    const thesis_request_id = (await startRequest(start_request)).body;

    logIn("laura.ferrari@example.com");
    let thesis_requests = (await getRequests()).body;

    expect(thesis_requests).toHaveLength(1);
    expect(thesis_requests[0]).toHaveProperty("status", "requested");

    await approveRequest(thesis_request_id);
    thesis_requests = (await getRequests()).body;

    expect(thesis_requests).toHaveLength(1);
    expect(thesis_requests[0]).toHaveProperty("status", "secretary_accepted");

    logIn("marco.torchiano@teacher.it");

    let response = await getRequests();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("status", "secretary_accepted");

    await rejectRequest(thesis_request_id);
    response = await getRequests();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("status", "rejected");
  });
  it("The professor requests for changes, the student changes the request, the professor accepts", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it
    logIn("s309618@studenti.polito.it");

    const thesis_request_id = (await startRequest(start_request)).body;

    logIn("laura.ferrari@example.com");
    let thesis_requests = (await getRequests()).body;

    expect(thesis_requests).toHaveLength(1);
    expect(thesis_requests[0]).toHaveProperty("status", "requested");

    await approveRequest(thesis_request_id);
    thesis_requests = (await getRequests()).body;

    expect(thesis_requests).toHaveLength(1);
    expect(thesis_requests[0]).toHaveProperty("status", "secretary_accepted");

    logIn("marco.torchiano@teacher.it");

    let response = await getRequests();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("status", "secretary_accepted");

    await requestChangesForRequest(thesis_request_id);
    response = await getRequests();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("status", "changes_requested");

    logIn("s309618@studenti.polito.it");
    response = await getRequests();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("status", "changes_requested");

    const modified_request = {
      ...start_request,
      title: "Modified title",
      description: "Modified_description",
    };
    modified_request.co_supervisors.push("giovanni.malnati@teacher.it");
    response = await modifyRequest(thesis_request_id, modified_request);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ...modified_request,
      id: thesis_request_id,
      supervisor: "marco.torchiano@teacher.it",
      student_id: "s309618",
      status: "changed",
    });

    response = await getRequests();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("status", "changed");

    logIn("marco.torchiano@teacher.it");
    response = await getRequests();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("status", "changed");

    await approveRequest(thesis_request_id);
    response = await getRequests();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("status", "started");

    logIn("s309618@studenti.polito.it");
    response = await getRequests();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("status", "started");
  });
  it("The professor can view only the thesis requests for which he is a supervisor or a co-supervisor", async () => {
    const first_request = {
      ...start_request,
      supervisor: "s123456", // marco.torchiano@teacher.it
      co_supervisors: ["maurizio.morisio@teacher.it"],
    };
    const second_request = {
      ...start_request,
      supervisor: "s234567", // maurizio.morisio@teacher.it
      co_supervisors: ["luigi.derussis@teacher.it"],
    };

    logIn("s309618@studenti.polito.it");
    const request1 = (await startRequest(first_request)).body;
    logIn("s308747@studenti.polito.it");
    const request2 = (await startRequest(second_request)).body;

    logIn("laura.ferrari@example.com");
    await approveRequest(request1);
    await approveRequest(request2);
    logIn("marco.torchiano@teacher.it"); // he has one request as supervisor
    let response = await getRequests();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);

    logIn("maurizio.morisio@teacher.it"); // he has one request a supervisor, one as co-supervisor
    response = await getRequests();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);

    logIn("luigi.derussis@teacher.it"); // he has one request as co-supervisor
    response = await getRequests();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);

    logIn("antonio.lioy@teacher.it"); // he has no requests, neither as supervisor nor co-supervisor
    response = await getRequests();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });
  it("After a professor requests changes, he has to wait for them", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it
    logIn("s309618@studenti.polito.it");
    const thesis_request_id = (await startRequest(start_request)).body;

    logIn("laura.ferrari@example.com");
    await approveRequest(thesis_request_id);

    logIn("marco.torchiano@teacher.it");
    await requestChangesForRequest(thesis_request_id);

    // the professor should not be able to ask again for changes
    let status = (await requestChangesForRequest(thesis_request_id)).status;
    expect(status).toBe(401);

    // the professor should not be able to accept nor reject the request
    status = (await approveRequest(thesis_request_id)).status;
    expect(status).toBe(401);
    status = (await rejectRequest(thesis_request_id)).status;
    expect(status).toBe(401);

    logIn("s309618@studenti.polito.it");
    let response = await modifyRequest(thesis_request_id, {
      ...start_request,
      description: "New description",
    });
    expect(response.status).toBe(200);

    logIn("marco.torchiano@teacher.it");

    // now the professor can evaluate the request again
    status = (await approveRequest(thesis_request_id)).status;
    expect(status).toBe(200);
  });
  it("After a professor requests changes, he has to wait for them (reject)", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it
    logIn("s309618@studenti.polito.it");
    const thesis_request_id = (await startRequest(start_request)).body;

    logIn("laura.ferrari@example.com");
    await approveRequest(thesis_request_id);

    logIn("marco.torchiano@teacher.it");
    await requestChangesForRequest(thesis_request_id);

    // the professor should not be able to ask again for changes
    let status = (await requestChangesForRequest(thesis_request_id)).status;
    expect(status).toBe(401);

    // the professor should not be able to accept nor reject the request
    status = (await approveRequest(thesis_request_id)).status;
    expect(status).toBe(401);
    status = (await rejectRequest(thesis_request_id)).status;
    expect(status).toBe(401);

    logIn("s309618@studenti.polito.it");
    let response = await modifyRequest(thesis_request_id, {
      ...start_request,
      description: "New description",
    });
    expect(response.status).toBe(200);

    logIn("marco.torchiano@teacher.it");

    // now the professor can evaluate the request again
    status = (await rejectRequest(thesis_request_id)).status;
    expect(status).toBe(200);
  });
  it("After a professor requests changes, he has to wait for them (request changes again)", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it
    logIn("s309618@studenti.polito.it");
    const thesis_request_id = (await startRequest(start_request)).body;

    logIn("laura.ferrari@example.com");
    await approveRequest(thesis_request_id);

    logIn("marco.torchiano@teacher.it");
    await requestChangesForRequest(thesis_request_id);

    // the professor should not be able to ask again for changes
    let status = (await requestChangesForRequest(thesis_request_id)).status;
    expect(status).toBe(401);

    // the professor should not be able to accept nor reject the request
    status = (await approveRequest(thesis_request_id)).status;
    expect(status).toBe(401);
    status = (await rejectRequest(thesis_request_id)).status;
    expect(status).toBe(401);

    logIn("s309618@studenti.polito.it");
    let response = await modifyRequest(thesis_request_id, {
      ...start_request,
      description: "New description",
    });
    expect(response.status).toBe(200);

    logIn("marco.torchiano@teacher.it");

    // now the professor can evaluate the request again
    status = (await requestChangesForRequest(thesis_request_id)).status;
    expect(status).toBe(200);
  });
  it("A professor can evaluate only the thesis requests for which he is a supervisor", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it
    start_request.co_supervisors = ["maurizio.morisio@teacher.it"];
    logIn("s309618@studenti.polito.it");
    const thesis_request_id = (await startRequest(start_request)).body;

    logIn("laura.ferrari@example.com");
    await approveRequest(thesis_request_id);

    logIn("maurizio.morisio@teacher.it");
    let status = (await approveRequest(thesis_request_id)).status;
    expect(status).toBe(401);

    status = (await rejectRequest(thesis_request_id)).status;
    expect(status).toBe(401);

    status = (await requestChangesForRequest(thesis_request_id)).status;
    expect(status).toBe(401);

    logIn("marco.torchiano@teacher.it");
    const requests = (await getRequests()).body;
    expect(requests[0]).toEqual({
      ...start_request,
      id: thesis_request_id,
      supervisor: "marco.torchiano@teacher.it",
      student_id: "s309618",
      status: "secretary_accepted",
    });
  });
  it("Can a professor evaluate a request which is not evaluated by the secretary yet?", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it
    logIn("s309618@studenti.polito.it");
    const thesis_request_id = (await startRequest(start_request)).body;

    logIn("marco.torchiano@teacher.it");
    let response = await requestChangesForRequest(thesis_request_id);
    let status = response.status;
    expect(status).toBe(401);
    expect(response.body).toEqual({
      message: "The request has not been evaluated by the secretary yet.",
    });

    status = (await approveRequest(thesis_request_id)).status;
    expect(status).toBe(401);

    status = (await rejectRequest(thesis_request_id)).status;
    expect(status).toBe(401);

    logIn("laura.ferrari@example.com");
    let requests = (await getRequests()).body;
    expect(requests[0]).toHaveProperty("status", "requested");
  });
  it("Multiple requests for change", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it
    logIn("s309618@studenti.polito.it");
    const thesis_request_id = (await startRequest(start_request)).body;

    logIn("laura.ferrari@example.com");
    await approveRequest(thesis_request_id);

    logIn("marco.torchiano@teacher.it");
    await requestChangesForRequest(thesis_request_id);

    logIn("s309618@studenti.polito.it");

    let modified_request = {
      ...start_request,
      description: "New description",
    };
    delete modified_request["co_supervisors"];

    let response = await modifyRequest(thesis_request_id, modified_request);
    expect(response.status).toBe(200);

    logIn("marco.torchiano@teacher.it");
    let requests = (await getRequests()).body;
    expect(requests).toContainEqual({
      ...modified_request,
      id: thesis_request_id,
      supervisor: "marco.torchiano@teacher.it",
      student_id: "s309618",
      status: "changed",
    });
    let status = (await requestChangesForRequest(thesis_request_id)).status;
    expect(status).toBe(200);

    logIn("s309618@studenti.polito.it");
    requests = (await getRequests()).body;
    expect(requests).toContainEqual({
      ...modified_request,
      id: thesis_request_id,
      supervisor: "marco.torchiano@teacher.it",
      student_id: "s309618",
      status: "changes_requested",
      changes_requested: "You have to change this, that, whatever I want",
    });
  });
  it("A professor cannot evaluate a request already accepted or rejected", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it
    logIn("s309618@studenti.polito.it");
    const thesis_request_id = (await startRequest(start_request)).body;

    logIn("laura.ferrari@example.com");
    await approveRequest(thesis_request_id);

    logIn("marco.torchiano@teacher.it");
    let status = (await approveRequest(thesis_request_id)).status;
    expect(status).toBe(200);

    let response = await rejectRequest(thesis_request_id);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "The request has been already approved / rejected",
    });
  });
  it("If the virtual clock is set, the starting date should be set accordingly", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it
    logIn("s309618@studenti.polito.it");
    const thesis_request_id = (await startRequest(start_request)).body;

    logIn("laura.ferrari@example.com");
    await approveRequest(thesis_request_id);

    // set the virtual clock to the future
    await setClock(7);

    logIn("marco.torchiano@teacher.it");
    let status = (await approveRequest(thesis_request_id)).status;
    expect(status).toBe(200);

    let requests = (await getRequests()).body;
    expect(requests).toContainEqual({
      id: thesis_request_id,
      title: start_request.title,
      description: start_request.description,
      supervisor: "marco.torchiano@teacher.it",
      co_supervisors: start_request.co_supervisors,
      status: "started",
      approval_date: dayjs().add(7, "day").format("YYYY-MM-DD"),
      student_id: "s309618",
    });
  });
  it("When changes are requested, there should be a description of the changes linked to it", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it
    logIn("s309618@studenti.polito.it");
    const thesis_request_id = (await startRequest(start_request)).body;

    logIn("laura.ferrari@example.com");
    await approveRequest(thesis_request_id);

    logIn("marco.torchiano@teacher.it");
    let status = (await requestChangesForRequest(thesis_request_id)).status;
    expect(status).toBe(200);

    let requests = (await getRequests()).body;
    expect(requests).toContainEqual({
      id: thesis_request_id,
      title: start_request.title,
      description: start_request.description,
      supervisor: "marco.torchiano@teacher.it",
      co_supervisors: start_request.co_supervisors,
      status: "changes_requested",
      changes_requested: "You have to change this, that, whatever I want",
      student_id: "s309618",
    });
  });
  it("When modifying a request, the request should exist", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it

    logIn("s309618@studenti.polito.it");
    let thesis_request_id = (await startRequest(start_request)).body;

    logIn("laura.ferrari@example.com");
    await approveRequest(thesis_request_id);

    logIn("marco.torchiano@teacher.it");
    await requestChangesForRequest(thesis_request_id);

    logIn("s309618@studenti.polito.it");
    let wrongId = thesis_request_id + 1;

    let response = await modifyRequest(wrongId, {
      ...start_request,
      title: "Modified title",
    });
    expect(response.status).toBe(404);
  });
  it("The secretary tries to change requests", async () => {
    start_request.supervisor = "s123456"; // marco.torchiano@teacher.it

    logIn("s309618@studenti.polito.it");
    let thesis_request_id = (await startRequest(start_request)).body;

    logIn("laura.ferrari@example.com");
    let response = await requestChangesForRequest(thesis_request_id);
    expect(response.status).toBe(401);

    let requests = await getRequests();
    // the request shouldn't be modified by that previous call
    expect(requests.body[0]).toHaveProperty("status", "requested");
  });
});

describe("The professor should now see also the proposals for which he is a co-supervisor", () => {
  it("Multiple cases", async () => {
    logIn("marco.torchiano@teacher.it");

    proposal.co_supervisors = [
      "luigi.derussis@teacher.it",
      "maurizio.morisio@teacher.it",
    ];
    await insertProposal(proposal);
    let response = await getProposals();
    expect(response.body).toHaveLength(1); // there should be one proposal, for which he is a supervisor

    logIn("luigi.derussis@teacher.it");
    proposal.groups = ["ELITE", "SOFTENG"];
    proposal.co_supervisors = ["maurizio.morisio@teacher.it"];
    await insertProposal(proposal);

    response = await getProposals();
    expect(response.body).toHaveLength(2); // there should be one proposal as supervisor, one as co_supervisor

    logIn("maurizio.morisio@teacher.it");
    response = await getProposals();
    expect(response.body).toHaveLength(2); // there should be two proposals as co_supervisor
  });
});
