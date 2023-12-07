"use strict";
const request = require("supertest");
const { app } = require("../src/server");
const { deleteApplicationsOfStudent, getDelta } = require("../src/theses-dao");
const dayjs = require("dayjs");
const { db } = require("../src/db");

jest.mock("../src/db");

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
    proposal: 1,
  };
});

it("Insertion of a correct proposal", () => {
  return request(app)
    .post("/api/proposals")
    .set("Content-Type", "application/json")
    .send(proposal)
    .expect(200);
});
/*it("Deletion of a proposal", () => {
  return request(app)
    .delete("/api/proposals/31")
    .set("Content-Type", "application/json")
    .expect(200);
});*/

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

describe("Get Application From Teacher", () => {
  it("Return 200 correct get of all application of a selected teacher", () => {
    const teacher = "s123456";
    return request(app)
      .get(`/api/applications?teacher=${teacher}`)
      .set("Content-Type", "application/json")
      .expect(200);
  });  

  it("Return 404 for no teacher found", () => {
    const teacher = "s999999";
    return request(app)
      .get(`/api/applications?teacher=${teacher}`)
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
          proposal_id: 1,
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

describe("test the correct flow for a proposal expiration", () => {
  it("a pending application for a proposal that expires sholud be set cancelled", async () => {
    const clock = getDelta();
    
    proposal.expiration_date = dayjs().add(clock.delta+1,'day').format("YYYY-MM-DD");
    
    const inserted_proposal_id = (
      await request(app)
        .post("/api/proposals")
        .set("Content-Type", "application/json")
        .send(proposal)
    ).body;
    await deleteApplicationsOfStudent("s317743");
    await request(app)
      .post("/api/applications")
      .set("Content-Type", "application/json")
      .send({
        student: "s317743",
        proposal: inserted_proposal_id,
      })
    await request(app)
    .patch(`/api/virtualClock`)
    .set("Content-Type", "application/json")
    .send({date:dayjs().add(clock.delta+2,"day").format("YYYY-MM-DD")})
    .expect(200);
    
  });

  /*it("", () => {
    return request(app)
      .post(`/api/virtualClock`)
      .set("Content-Type", "application/json")
      .send("2023-12-12")
      .expect(200);
  });*/
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
