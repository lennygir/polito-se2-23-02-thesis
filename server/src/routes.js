"use strict";

const router = require("express").Router();
const passport = require("passport");
const dayjs = require("dayjs");
const { check, validationResult } = require("express-validator");
const {
  getTeacher,
  getStudent,
  getTeachers,
  getGroup,
  getGroups,
  getDegrees,
  insertProposal,
  getProposalsBySupervisor,
  getProposalsByDegree,
  updateApplication,
  getProposal,
  insertApplication,
  getApplicationsOfTeacher,
  getApplicationsOfStudent,
  getProposals,
  deleteProposal,
  updateProposal,
  getApplicationById,
  getTeacherByEmail,
  getApplications,
  cancelPendingApplications,
  getPendingOrAcceptedApplicationsOfStudent,
  findAcceptedProposal,
  findRejectedApplication,
  notifyApplicationDecision,
  getNotificationsOfStudent,
  getStudentByEmail,
} = require("./theses-dao");

// ==================================================
// Routes
// ==================================================

router.get("/api", (req, res) => {
  return res.status(200).json({ message: "API home page" });
});

router.get(
  "/login",
  passport.authenticate("saml", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (_req, res) => {
    return res.redirect("http://localhost:5173");
  },
);

/** Endpoint called by Auth0 using Passport */
router.post(
  "/login/callback",
  passport.authenticate("saml", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (_req, res) => {
    return res.redirect("http://localhost:5173");
  },
);

/** Check for user authentication
 * If user authenticated return user
 */
router.get("/api/sessions/current", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  } else {
    const email =
      req.user[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ];
    const student = getStudentByEmail(email);
    const teacher = getTeacherByEmail(email);
    if (student && !teacher) {
      return res.status(200).json({ ...student, role: "student" });
    } else if (teacher) {
      return res.status(200).json({ ...teacher, role: "teacher" });
    } else {
      return res.status(500).json({ message: "database error" });
    }
  }
});

router.get("/logout", (req, res) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (!err) {
        return res.redirect("http://localhost:5173");
      }
    });
  } else {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
});
//  strategy.logout(req, (err, req) => {
//    if (!err) {
//      console.log(req);
//      return res.redirect(req);
//    }
//  });
//});
//
//router.post("/logout/callback", (req, res) => {
//  req.logout((err) => {
//    if (!err) {
//      return res.redirect("http://localhost:5173");
//    }
//  });
//});

// login endpoint
/**
    body:
    {
        "email": "s123456@studenti.polito.it",
        "password": "s123456"
    }
    returns
    if user is a student: {
        "role": "student"
        "StudentID":	    Integer
        "Surname":	        Text
        "Name":	            Text
        "Gender":	        Text
        "Nationality":	    Text
        "Email":	        Text
        "COD_degree"	    Text
        "Enrollment_year":	Date
    }
    if user is a teacher {
        "role": "teacher"
        "TeacherID":        integer
        "Name":             text
        "Surname":          text
        "Email":            text
        "GroupID":          text (maybe integer)
        "DepartmentID":     text (maybe integer)
    }
*/
//router.post(
//  "/api/sessions",
//  check("email").isEmail(),
//  check("password").isLength({ min: 7, max: 7 }),
//  (req, res) => {
//    try {
//      const { email, password } = req.body;
//      const valid = userDao.checkUser(email, password);
//      if (valid) {
//        const teacher = userDao.getTeacher(email);
//        const student = userDao.getStudent(email);
//        if (teacher) {
//          teacher.role = "teacher";
//          return res.status(200).send(teacher);
//        } else if (student) {
//          student.role = "student";
//          return res.status(200).send(student);
//        } else {
//          return res.status(500).send({ message: "Unknown error" });
//        }
//      } else {
//        return res.status(404).send({ message: "Invalid login credentials" });
//      }
//    } catch (e) {
//      return res.status(500).send({ message: e.message });
//    }
//  },
//);

router.post(
  "/api/proposals",
  check("title").isString(),
  check("supervisor").isAlphanumeric().isLength({ min: 7, max: 7 }),
  check("co_supervisors").isArray(),
  check("co_supervisors.*").isEmail(),
  check("groups").isArray(),
  check("groups.*").isString(),
  check("keywords").isArray(),
  check("keywords.*").isString(),
  check("types").isArray(),
  check("types.*").isString(),
  check("description").isString(),
  check("required_knowledge").isString(),
  check("notes").isString().optional({ values: "null" }),
  check("expiration_date").isISO8601().toDate(),
  check("level").isString().isLength({ min: 3, max: 3 }),
  check("cds").isString(),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ message: "Invalid proposal content" });
    }
    try {
      const {
        title,
        supervisor,
        co_supervisors,
        groups,
        keywords,
        types,
        description,
        required_knowledge,
        notes,
        expiration_date,
        level,
        cds,
      } = req.body;
      const teacher_supervisor = getTeacher(supervisor);
      if (teacher_supervisor === undefined) {
        return res.status(400).send({ message: "Invalid proposal content" });
      }
      for (const group of groups) {
        if (getGroup(group) === undefined) {
          return res.status(400).send({ message: "Invalid proposal content" });
        }
      }
      if (level !== "MSC" && level !== "BSC") {
        return res.status(400).send({ message: "Invalid proposal content" });
      }
      const legal_groups = [teacher_supervisor.cod_group];
      for (const co_supervisor_email of co_supervisors) {
        const co_supervisor = getTeacherByEmail(co_supervisor_email);
        if (co_supervisor !== undefined) {
          legal_groups.push(co_supervisor.cod_group);
        }
      }
      if (!groups.every((group) => legal_groups.includes(group))) {
        return res.status(400).send({ message: "Invalid groups" });
      }
      const teacher = insertProposal(
        title,
        supervisor,
        co_supervisors.join(", "),
        groups.join(", "),
        keywords.join(", "),
        types.join(", "),
        description,
        required_knowledge,
        notes,
        dayjs(expiration_date).format("YYYY-MM-DD"),
        level,
        cds,
      );
      return res.status(200).json(teacher);
    } catch (e) {
      return res.status(500).send({ message: "Internal server error" });
    }
  },
);

// endpoint to get all teachers {id, surname, name, email}
router.get("/api/teachers", (req, res) => {
  try {
    const teachers = getTeachers();

    if (teachers.length === 0) {
      return res
        .status(404)
        .send({ message: "No teacher found in the database" });
    }

    return res.status(200).json(teachers);
  } catch (e) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

// endpoint to get all groups {cod_group}
router.get("/api/groups", (req, res) => {
  try {
    //get the groups from db
    const groups = getGroups();

    if (groups.length === 0) {
      return res
        .status(404)
        .send({ message: "No group found in the database" });
    }

    return res.status(200).json(groups);
  } catch (e) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

// endpoint to get all degrees {cod_degree, title_degree}
router.get("/api/degrees", (req, res) => {
  try {
    const degrees = getDegrees();

    if (degrees.length === 0) {
      return res
        .status(404)
        .send({ message: "No degree found in the database" });
    }

    return res.status(200).json(degrees);
  } catch (e) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

router.get(
  "/api/proposals",
  check("cds").isString(),
  check("supervisor").isAlphanumeric().isLength({ min: 7, max: 7 }),
  (req, res) => {
    try {
      const cds = req.query.cds;
      const supervisor = req.query.supervisor;
      let proposals;
      if (cds !== undefined && supervisor === undefined) {
        proposals = getProposalsByDegree(cds);
      }
      if (supervisor !== undefined && cds === undefined) {
        proposals = getProposalsBySupervisor(supervisor);
      }
      if (cds === undefined && supervisor === undefined) {
        proposals = getProposals();
      }
      if (proposals.length === 0) {
        return res
          .status(404)
          .send({ message: "No proposal found in the database" });
      }
      return res.status(200).json(proposals);
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.post(
  "/api/applications",
  check("student").isString().isLength({ min: 7, max: 7 }),
  check("proposal").isInt({ gt: 0 }),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ message: "Invalid application content" });
    }
    try {
      const { proposal, student } = req.body;
      const db_student = getStudent(student);
      const db_proposal = getProposal(proposal);
      if (db_student === undefined || db_proposal === undefined) {
        return res.status(400).json({ message: "Invalid application content" });
      }
      if (getPendingOrAcceptedApplicationsOfStudent(student).length !== 0) {
        return res.status(400).json({
          message: `The student ${student} has already applied to a proposal`,
        });
      }
      if (findAcceptedProposal(proposal)) {
        return res.status(400).json({
          message: `The proposal ${proposal} is already accepted for another student`,
        });
      }
      if (findRejectedApplication(proposal, student)) {
        return res.status(400).json({
          message:
            "The student has already applied for this application and it was rejected",
        });
      }
      const application = insertApplication(proposal, student, "pending");
      return res.status(200).json(application);
    } catch (e) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.get(
  "/api/applications",
  check("teacher")
    .isAlphanumeric()
    .isLength({ min: 7, max: 7 })
    .optional({ values: undefined }),
  check("student")
    .isAlphanumeric()
    .isLength({ min: 7, max: 7 })
    .optional({ values: undefined }),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ message: "Invalid application content" });
    }
    try {
      if (req.query.teacher !== undefined && req.query.student === undefined) {
        const teacher = getTeacher(req.query.teacher);
        if (teacher === undefined) {
          return res.status(404).json({
            message: `Teacher ${req.query.teacher} not found, cannot get the applications`,
          });
        }
        const applications = getApplicationsOfTeacher(teacher.id);
        if (applications.length === 0) {
          return res.status(404).json({
            message: `No application found for teacher ${req.query.teacher}`,
          });
        }
        return res.status(200).json(applications);
      }
      if (req.query.student !== undefined && req.query.teacher === undefined) {
        const student = getStudent(req.query.student);
        if (student === undefined) {
          return res.status(404).json({
            message: `Student ${req.query.student} not found, cannot get the applications`,
          });
        }
        const applications = getApplicationsOfStudent(student.id);
        if (applications.length === 0) {
          return res.status(404).json({
            message: `No application found for student ${req.query.student}`,
          });
        }
        return res.status(200).json(applications);
      }
      if (req.query.student === undefined && req.query.teacher === undefined) {
        const applications = getApplications();
        if (applications.length === 0) {
          return res.status(404).json({ message: "No application found" });
        }
        return res.status(200).json(applications);
      }
    } catch (e) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.patch(
  "/api/applications/:id",
  check("state").isIn(["accepted", "rejected"]),
  check("id").isInt({ min: 1 }),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ message: "Invalid proposal content" });
    }
    try {
      const state = req.body.state;
      const application = getApplicationById(req.params.id);
      if (application === undefined) {
        return res.status(400).json({ message: "Application not existent" });
      }
      if (application.state !== "pending") {
        return res.status(400).json({
          message:
            "You cannot modify an application already accepted or rejected",
        });
      }
      updateApplication(application.id, state);
      await notifyApplicationDecision(application.id, state);
      if (state === "accepted") {
        cancelPendingApplications(application.proposal_id);
      }
      return res.status(200).json({ message: `Application ${state}` });
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.get(
  "/api/notifications",
  check("student")
    .isAlphanumeric()
    .isLength({ min: 7, max: 7 })
    .optional({ values: undefined }),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ message: "Invalid student content" });
    }
    try {
      if (req.query.student !== undefined) {
        const student = getStudent(req.query.student);
        if (student === undefined) {
          return res.status(404).json({
            message: `Student ${req.query.student} not found, cannot get the notifications`,
          });
        }
        const notifications = getNotificationsOfStudent(student.id);
        return res.status(200).json(notifications);
      }
    } catch (e) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.patch("/api/proposals/:id", (req, res) => {
  try {
    const {
      title,
      supervisor,
      co_supervisors,
      groups,
      keywords,
      types,
      description,
      required_knowledge,
      notes,
      expiration_date,
      level,
      cds,
    } = req.body;

    const id = req.params.id;

    if (findAcceptedProposal(id)) {
      return res.status(400).json({
        message: `The proposal ${id} is already accepted for another student`,
      });
    }

    const fieldsToUpdate = [
      { field: "title", value: title },
      { field: "supervisor", value: supervisor },
      { field: "co_supervisors", value: co_supervisors },
      { field: "groups", value: groups },
      { field: "keywords", value: keywords },
      { field: "types", value: types },
      { field: "description", value: description },
      { field: "required_knowledge", value: required_knowledge },
      { field: "notes", value: notes },
      { field: "expiration_date", value: expiration_date },
      { field: "level", value: level },
      { field: "cds", value: cds },
    ].filter((field) => field.value !== undefined);

    const setValues = {};
    fieldsToUpdate.forEach((field) => {
      setValues[field.field] = field.value;
    });
    updateProposal(id, setValues);
    return res.status(200).send("Proposal updated successfully.");
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put(
  "/api/proposals/:id",
  check("id").isInt(),
  check("title").isString(),
  check("supervisor").isAlphanumeric().isLength({ min: 7, max: 7 }),
  check("co_supervisors").isArray(),
  check("co_supervisors.*").isEmail(),
  check("groups").isArray(),
  check("groups.*").isString(),
  check("keywords").isArray(),
  check("keywords.*").isString(),
  check("types").isArray(),
  check("types.*").isString(),
  check("description").isString(),
  check("required_knowledge").isString(),
  check("notes").isString().optional({ values: "null" }),
  check("expiration_date").isISO8601().toDate(),
  check("level").isString().isLength({ min: 3, max: 3 }),
  check("cds").isString(),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ message: "Invalid proposal content" });
    }
    try {
      const {
        title,
        supervisor,
        co_supervisors,
        groups,
        keywords,
        types,
        description,
        required_knowledge,
        notes,
        expiration_date,
        level,
        cds,
      } = req.body;
      const proposal_id = req.params.id;
      const proposal = getProposal(proposal_id);
      if (proposal === undefined) {
        return res.status(404).json({
          message: `Proposal ${proposal_id} not found`,
        });
      }
      if (findAcceptedProposal(proposal_id)) {
        return res.status(400).json({
          message: `The proposal ${proposal_id} is already accepted for another student`,
        });
      }
      const teacher_supervisor = getTeacher(supervisor);
      if (teacher_supervisor === undefined) {
        return res.status(400).send({ message: "Invalid proposal content" });
      }
      for (const group of groups) {
        if (getGroup(group) === undefined) {
          return res.status(400).send({ message: "Invalid proposal content" });
        }
      }
      if (level !== "MSC" && level !== "BSC") {
        return res.status(400).send({ message: "Invalid proposal content" });
      }
      const legal_groups = [teacher_supervisor.cod_group];
      for (const co_supervisor_email of co_supervisors) {
        const co_supervisor = getTeacherByEmail(co_supervisor_email);
        if (co_supervisor !== undefined) {
          legal_groups.push(co_supervisor.cod_group);
        }
      }
      if (!groups.every((group) => legal_groups.includes(group))) {
        return res.status(400).send({ message: "Invalid groups" });
      }
      updateProposal(
        proposal_id,
        title,
        supervisor,
        co_supervisors.join(", "),
        groups.join(", "),
        keywords.join(", "),
        types.join(", "),
        description,
        required_knowledge,
        notes,
        dayjs(expiration_date).format("YYYY-MM-DD"),
        level,
        cds,
      );
      return res.status(200).send({ message: "Proposal updated successfully" });
    } catch (e) {
      return res.status(500).send({ message: "Internal server error" });
    }
  },
);

router.delete("/api/proposals/:id", [check("id").isInt()], async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ message: "Invalid proposal content" });
    }
    const proposal = getProposal(req.params.id);
    if (proposal === undefined) {
      return res.status(404).json({
        message: `Proposal ${req.query.id} not found`,
      });
    }
    if (findAcceptedProposal(req.params.id)) {
      return res.status(400).json({
        message: `The proposal ${req.params.id} is already accepted for another student`,
      });
    }
    cancelPendingApplications(req.params.id);
    deleteProposal(req.params.id);
    return res.status(200).send({ message: "Proposal deleted successfully." });
  } catch (err) {
    console.error(`Error deleting proposal: ${err.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
// ==================================================
// Handle 404 not found - DO NOT ADD ENDPOINTS AFTER THIS
// ==================================================
router.use(function (req, res) {
  res.status(404).json({
    message: "Endpoint not found, make sure you used the correct URL / Method",
  });
});

module.exports = router;
