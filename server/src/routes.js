"use strict";

const router = require("express").Router();
const userDao = require("./user-dao");
const { check, validationResult } = require("express-validator");
const { getTeacher, getGroup, insertProposal } = require("./theses-dao");
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
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const valid = await userDao.checkUser(email, password);
      if (valid) {
        const teacher = await userDao.getTeacher(email);
        const student = await userDao.getStudent(email);
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
  async (req, res) => {
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
      const teacher = await getTeacher(supervisor);
      if (teacher === false) {
        return res.status(400).send({ message: "Invalid proposal content" });
      } else {
        for (const group of groups) {
          if ((await getGroup(group)) === false) {
            return res
              .status(400)
              .send({ message: "Invalid proposal content" });
          }
        }
        if (level !== "MSC" && level !== "BSC") {
          return res.status(400).send({ message: "Invalid proposal content" });
        }
        const teacher = await insertProposal(
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

// ==================================================
// Handle 404 not found - DO NOT ADD ENDPOINTS AFTER THIS
// ==================================================
router.use(function (req, res) {
  res.status(404).json({
    message: "Endpoint not found, make sure you used the correct URL / Method",
  });
});

module.exports = router;