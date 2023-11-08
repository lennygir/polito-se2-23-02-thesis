"use strict";

const router = require("express").Router();
const userDao = require('./user-dao');

// ==================================================
// Routes
// ==================================================

router.get("/api", (req, res) => {
    return res.status(200).json({ message: "API home page" });
});

// login endpoint
/*
    {
        "user": "s123456",
        "password": "password"
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
router.post("/api/sessions", async (req, res) => {
    const valid = await userDao.checkUser(req.body.user, req.body.password);
    if (valid) {
        const teacher = await userDao.getTeacher();
        const student = await userDao.getStudent();
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