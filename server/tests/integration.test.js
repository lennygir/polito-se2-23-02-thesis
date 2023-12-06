"use strict";
const request = require("supertest");
const { app } = require("../src/server");
const { deleteApplicationsOfStudent } = require("../src/theses-dao");
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
    supervisor: "s345678",
    co_supervisors: [
      "marco.torchiano@polito.it",
      "s122349@gmail.com",
      "s298399@outlook.com",
    ],
    groups: ["ELITE"],
    keywords: ["SOFTWARE ENGINEERING", "SOFTWARE DEVELOPMENT"],
    types: ["EXPERIMENTAL", "RESEARCH"],
    description: "Accetta questa tesi che e' una bomba",
    required_knowledge: "non devi sapere nulla",
    notes: "Bella raga",
    expiration_date: "2019-01-25T02:00:00.000Z",
    level: "MSC",
    cds: "L-8-F",
  };
  application = {
    student: "s317743",
    proposal: 8,
  };
});

describe("Template for doing protected routes", () => {
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
});

describe("Story 12: Archive Proposals", () => {
  let proposal_body;
  let inserted_proposal;
  beforeEach(() => {
    const email = "marco.torchiano@teacher.it";
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: email,
      };
      next();
    });
    inserted_proposal = {
      ...proposal_body,
      supervisor: email,
    };
    proposal_body = {
      title: "New proposal",
      co_supervisors: ["s122349@gmail.com", "s298399@outlook.com"],
      groups: ["SOFTENG"],
      keywords: ["SOFTWARE ENGINEERING", "SOFTWARE DEVELOPMENT"],
      types: ["EXPERIMENTAL", "RESEARCH"],
      description: "This proposal is used to test the archiving functionality",
      required_knowledge: "You have to know how to archive the thesis",
      notes: null,
      expiration_date: dayjs().format("YYYY-MM-DD"),
      level: "MSC",
      cds: "L-8-F",
    };
  });
  afterEach(() => {
    db.prepare("delete from main.PROPOSALS").run();
    db.prepare("delete from main.APPLICATIONS").run();
  });
  it("Create a proposal, then archive it", async () => {
    proposal_body.expiration_date = dayjs().add(7, "day").format("YYYY-MM-DD");

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

    expect(archived_proposal).toStrictEqual({
      ...inserted_proposal,
      archived: true,
    });
  });
  it("Multiple tries should not trigger any errors (idempotency)", async () => {
    proposal_body.expiration_date = dayjs().add(7, "day").format("YYYY-MM-DD");

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

    expect(archived_proposal).toStrictEqual({
      ...inserted_proposal,
      archived: true,
    });
  });

  it("An expired proposal should be archived", async () => {
    // set the expiration date to the past
    proposal_body.expiration_date = dayjs()
      .subtract(7, "day")
      .format("YYYY-MM-DD");

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
    ).toStrictEqual({
      ...inserted_proposal,
      archived: true,
    });
  });
  it("The admitted field on the body should be only 'true'", async () => {
    proposal_body.expiration_date = dayjs().add(7, "day").format("YYYY-MM-DD");

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
    ).toStrictEqual({
      ...inserted_proposal,
      archived: false,
    });
  });

  it("The proposal should exist", async () => {
    proposal_body.expiration_date = dayjs().add(7, "day").format("YYYY-MM-DD");

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
    proposal_body.expiration_date = dayjs().add(7, "day").format("YYYY-MM-DD");

    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal_body)
    ).body;

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = {
        email: "wrong.professor@teacher.it",
      };
      next();
    });

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
    proposal_body.expiration_date = dayjs().add(7, "day").format("YYYY-MM-DD");
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal_body);
    }

    // insert 5 archived proposals
    proposal_body.expiration_date = dayjs()
      .subtract(7, "day")
      .format("YYYY-MM-DD");
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
    // insert proposal
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal_body)
    ).body;

    // insert application for the proposal just inserted
    await request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send({
        student: "s309618",
        proposal: inserted_proposal_id,
      });
    // find application id
    const application = (await request(app).get("/api/applications")).body;

    // the proposal should not be archived
    let proposals = (await request(app).get("/api/proposals")).body;
    expect(
      proposals.find((proposal) => proposal.id === inserted_proposal_id),
    ).toStrictEqual({
      ...inserted_proposal,
      archived: false,
    });

    // accept application
    await request(app)
      .patch(`/api/applications/${application.id}`)
      .set("Content-Type", "application/json")
      .send({
        state: "accepted",
      });

    // now the proposal should be archived
    proposals = (await request(app).get("/api/proposals")).body;
    expect(
      proposals.find((proposal) => proposal.id === inserted_proposal_id),
    ).toStrictEqual({
      ...inserted_proposal,
      archived: true,
    });
  });
});

it("Insertion of a correct proposal", () => {
  return request(app)
    .post("/api/proposals")
    .set("Content-Type", "application/json")
    .send(proposal)
    .expect(200);
});

it("prova", async () => {
  const proposal_id = (
    await request(app)
      .post("/api/proposals")
      .set("Content-Type", "application/json")
      .send(proposal)
      .expect(200)
  ).body;
  let expected_proposal = {
    ...proposal,
    type: proposal.types.join(", "),
    id: proposal_id,
    co_supervisors: proposal.co_supervisors.join(", "),
    groups: proposal.groups.join(", "),
    keywords: proposal.keywords.join(", "),
    expiration_date: dayjs(proposal.expiration_date).format("YYYY-MM-DD"),
  };
  delete expected_proposal.types;
  let returned_proposal = db.prepare("select * from main.PROPOSALS").get();
  expect(returned_proposal).toStrictEqual(expected_proposal);
});

it("CRUD on proposal", async () => {
  const proposal_id = (
    await request(app)
      .post("/api/proposals")
      .set("Content-Type", "application/json")
      .send(proposal)
      .expect(200)
  ).body;
  let proposals = (await request(app).get("/api/proposals").expect(200)).body;
  let expected_proposal = {
    ...proposal,
    type: proposal.types.join(", "),
    id: proposal_id,
    co_supervisors: proposal.co_supervisors.join(", "),
    groups: proposal.groups.join(", "),
    keywords: proposal.keywords.join(", "),
    expiration_date: dayjs(proposal.expiration_date).format("YYYY-MM-DD"),
  };
  delete expected_proposal.types;
  expect(
    proposals.find((proposal) => proposal.id === proposal_id),
  ).toStrictEqual(expected_proposal);
  const update_message = (
    await request(app)
      .put(`/api/proposals/${proposal_id}`)
      .send({
        ...proposal,
        title: "Updated title",
      })
      .expect(200)
  ).body;
  expect(update_message.message).toBe("Proposal updated successfully");
  expected_proposal.title = "Updated title";
  proposals = (await request(app).get("/api/proposals").expect(200)).body;
  expect(
    proposals.find((proposal) => proposal.id === proposal_id),
  ).toStrictEqual(expected_proposal);
  await request(app).delete(`/api/proposals/${proposal_id}`).expect(200);
  proposals = (await request(app).get("/api/proposals").expect(200)).body;
  expect(proposals.find((proposal) => proposal.id === proposal_id)).toBe(
    undefined,
  );
});
it("Insertion of a proposal with no notes", () => {
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

it("Insertion of a proposal with a non existent supervisor", () => {
  proposal.supervisor = "s000000";
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

describe("Get Application From Teacher", () => {
  it("Return 404 for empty list of application of that teacher", () => {
    const teacher = "s789012";
    return request(app)
      .get(`/api/applications?teacher=${teacher}`)
      .set("Content-Type", "application/json")
      .expect(404);
  });

  it("Return 404 for emply list of application of that student", () => {
    const student = "s320987";
    return request(app)
      .get(`/api/applications?student=${student}`)
      .set("Content-Type", "application/json")
      .expect(404);
  });

  it("Return 404 for no student found", () => {
    const student = "s999999";
    return request(app)
      .get(`/api/applications?student=${student}`)
      .set("Content-Type", "application/json")
      .expect(404);
  });

  it("Return 200 correct get of all application of a selected student", () => {
    const student = "s319823";
    return request(app)
      .get(`/api/applications?student=${student}`)
      .set("Content-Type", "application/json")
      .expect(200);
  });
});

describe("Proposal Retrieval Tests", () => {
  it("Get all the proposals from a specific field of study", () => {
    const cds = "L-8-F";
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

  it("Get all the proposals from a specific supervisor", () => {
    const supervisor = "s123456";
    return request(app)
      .get(`/api/proposals?supervisor=${supervisor}`)
      .set("Content-Type", "application/json")
      .expect(200);
  });

  it("Return 404 for a non-existing supervisor", () => {
    const supervisor = "s000000";
    return request(app)
      .get(`/api/proposals?supervisor=${supervisor}`)
      .set("Content-Type", "application/json")
      .expect(404);
  });

  it("Return 400 for a invalid format of supervisor", () => {
    const supervisor = 0;
    return request(app)
      .get(`/api/proposals?supervisor=${supervisor}`)
      .set("Content-Type", "application/json")
      .expect(404);
  });

  it("Get all the proposals from a field of study that doesn't exists", () => {
    const cds = "aaaaaaaaaaaaaaaaaaaaaaaaa";
    return request(app)
      .get(`/api/proposals?cds=${cds}`)
      .set("Content-Type", "application/json")
      .expect(404);
  });
});
describe("Application Insertion Tests", () => {
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
  it("Insertion of a correct application", () => {
    deleteApplicationsOfStudent(application.student);
    return request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send(application)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual({
          student_id: "s317743",
          proposal_id: 8,
          state: "pending",
        });
      });
  });
  it("Insertion of an application for a student who already applied to a proposal", async () => {
    deleteApplicationsOfStudent(application.student);
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
          message: `The student ${application.student} has already applied to a proposal`,
        });
      });
  });
});

describe("Notifications Retrieval Tests", () => {
  it("Get all the notifications from a specific student", () => {
    const student_id = "s319823";
    return request(app)
      .get(`/api/notifications?student=${student_id}`)
      .set("Content-Type", "application/json")
      .expect(200)
      .then((response) => {
        response.body.forEach((notification) => {
          expect(notification.student_id).toBe(student_id);
        });
      });
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
