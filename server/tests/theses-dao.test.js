"use strict";

const { getApplicationsOfTeacher } = require("../src/theses-dao");
const { db } = require("../src/db");

jest.mock("../src/db");
//describe("getApplicationsOfTeacher", () => {
//  test("Correct behavior", async () => {
//    const applications = [
//      {
//        proposal_id: 3,
//        student_id: "s309618",
//        state: "pending",
//        student_name: "Lorenzo",
//        student_surname: "Bertetto",
//        teacher_name: "Marco",
//        teacher_surname: "Torchiano",
//      },
//      {
//        proposal_id: 4,
//        student_id: "s309618",
//        state: "pending",
//        student_name: "Lorenzo",
//        student_surname: "Bertetto",
//        teacher_name: "Marco",
//        teacher_surname: "Torchiano",
//      },
//    ];
//    db.all.mockReturnValueOnce(applications);
//    const expected_applications = await getApplicationsOfTeacher("s123456");
//    expect(expected_applications.toStrictEqual(applications));
//  });
//});
