"use strict";

const router = require("express").Router();
const userDao = require("./user-dao");
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
  getProposal,
  insertApplication,
  getApplication,
  getApplicationsOfTeacher,
  getApplicationsOfStudent,
  getProposals,
  deleteProposal
} = require("./theses-dao");
const dayjs = require("dayjs");

// ==================================================
// Routes
// ==================================================

router.get("/api", (req, res) => {
  return res.status(200).json({ message: "API home page" });
});

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
router.post(
  "/api/sessions",
  check("email").isEmail(),
  check("password").isLength({ min: 7, max: 7 }),
  (req, res) => {
    try {
      const { email, password } = req.body;
      const valid = userDao.checkUser(email, password);
      if (valid) {
        const teacher = userDao.getTeacher(email);
        const student = userDao.getStudent(email);
        if (teacher) {
          teacher.role = "teacher";
          return res.status(200).send(teacher);
        } else if (student) {
          student.role = "student";
          return res.status(200).send(student);
        } else {
          return res.status(500).send({ message: "Unknown error" });
        }
      } else {
        return res.status(404).send({ message: "Invalid login credentials" });
      }
    } catch (e) {
      return res.status(500).send({ message: e.message });
    }
  },
);

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
      const teacher = getTeacher(supervisor);
      if (teacher === undefined) {
        return res.status(400).send({ message: "Invalid proposal content" });
      } else {
        for (const group of groups) {
          if (getGroup(group) === undefined) {
            return res
              .status(400)
              .send({ message: "Invalid proposal content" });
          }
        }
        if (level !== "MSC" && level !== "BSC") {
          return res.status(400).send({ message: "Invalid proposal content" });
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
      }
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
      } else if (getApplication(student, proposal)) {
        return res.status(400).json({ message: "Application already present" });
      } else {
        const application = insertApplication(proposal, student, "pending");
        return res.status(200).json(application);
      }
    } catch (e) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.get(
  "/api/applications",
  check("teacher").isAlphanumeric().isLength({ min: 7, max: 7 }),
  check("student").isAlphanumeric().isLength({ min: 7, max: 7 }),
  (req, res) => {
    try {
      if (req.query.teacher !== undefined && req.query.student === undefined) {
        const teacher = getTeacher(req.query.teacher);
        if (teacher === undefined) {
          return res.status(404).json({
            message: `Teacher ${req.query.teacher} not found, cannot get the applications`,
          });
        } else {
          const applications = getApplicationsOfTeacher(teacher.id);
          if (applications.length === 0) {
            return res.status(404).json({
              message: `No application found for teacher ${req.query.teacher}`,
            });
          } else {
            return res.status(200).json(applications);
          }
        }
      }
      if (req.query.student !== undefined && req.query.teacher === undefined) {
        const student = getStudent(req.query.student);

        if (student === undefined) {
          return res.status(404).json({
            message: `Student ${req.query.student} not found, cannot get the applications`,
          });
        } else {
          const applications = getApplicationsOfStudent(student.id);
          if (applications.length === 0) {
            return res.status(404).json({
              message: `No application found for student ${req.query.student}`,
            });
          } else {
            return res.status(200).json(applications);
          }
        }
      }
    } catch (e) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.delete('/api/proposals',
  [ check('id').isInt() ],
  async (req, res) => {
    try {
      await deleteProposal(req.query.id);
      return res.status(200).send('Proposal deleted successfully.');
    } catch (err) {
      if (err.status === 404) {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
// ==================================================
// Handle 404 not found - DO NOT ADD ENDPOINTS AFTER THIS
// ==================================================
router.use(function (req, res) {
  res.status(404).json({
    message: "Endpoint not found, make sure you used the correct URL / Method",
  });
});

module.exports = router;
