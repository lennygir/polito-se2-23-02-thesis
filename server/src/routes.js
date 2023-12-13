"use strict";

const router = require("express").Router();
const passport = require("passport");
const dayjs = require("dayjs");
const { check, validationResult } = require("express-validator");
const isLoggedIn = require("./protect-routes");
const {
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
  insertStartRequest,
  getApplicationsOfTeacher,
  getApplicationsOfStudent,
  deleteProposal,
  updateProposal,
  getApplicationById,
  getTeacherByEmail,
  cancelPendingApplications,
  getPendingOrAcceptedApplicationsOfStudent,
  findAcceptedProposal,
  findRejectedApplication,
  notifyApplicationDecision,
  notifyNewApplication,
  getDelta,
  setDelta,
  getNotifications,
  getExamsOfStudent,
  insertPDFInApplication,
  updateArchivedStateProposal,
  getNotRejectedStartRequest,
} = require("./theses-dao");
const { getUser } = require("./user-dao");

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
  }
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
  }
);

/** Check for user authentication
 * If user authenticated return user
 */
router.get("/api/sessions/current", isLoggedIn, (req, res) => {
  const { email } = req.user;
  const user = getUser(email);
  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(500).json({ message: "database error" });
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

router.post(
  "/api/proposals",
  isLoggedIn,
  check("title").isString(),
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
      const { email } = req.user;
      const user = getUser(email);
      if (!user || user.role !== "teacher") {
        return res.status(401).json({
          message: "You must be authenticated as teacher to add a proposal",
        });
      }
      for (const group of groups) {
        if (getGroup(group) === undefined) {
          return res.status(400).send({ message: "Invalid proposal content" });
        }
      }
      if (level !== "MSC" && level !== "BSC") {
        return res.status(400).send({ message: "Invalid proposal content" });
      }
      const legal_groups = [user.cod_group];
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
        user.id,
        co_supervisors.join(", "),
        groups.join(", "),
        keywords.join(", "),
        types.join(", "),
        description,
        required_knowledge,
        notes,
        dayjs(expiration_date).format("YYYY-MM-DD"),
        level,
        cds
      );
      return res.status(200).json(teacher);
    } catch (e) {
      return res.status(500).send({ message: "Internal server error" });
    }
  }
);

// endpoint to add a new start request
router.post(
  "/api/start-requests",
  isLoggedIn,
  check("title").isString(),
  check("co_supervisors").optional().isArray(),
  check("co_supervisors.*").isEmail(),
  check("description").isString(),
  check("supervisor").isString(),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ message: "Invalid start request content" });
    }
    try {
      const newStartRequest = req.body;
      const { email } = req.user;
      const user = getUser(email);
      if (!user || user.role !== "student") {
        return res.status(401).json({
          message:
            "You must be authenticated as student to add a start request",
        });
      }
      const userStartRequests = getNotRejectedStartRequest(user.id);
      if (userStartRequests.length !== 0) {
        return res.status(409).json({
          message: "You already have a start request pending or accepted",
        });
      }
      if (newStartRequest.co_supervisors) {
        newStartRequest.co_supervisors =
          newStartRequest.co_supervisors.join(", ");
      }
      newStartRequest.approvalDate = null;
      newStartRequest.studentId = user.id;
      const startRequest = insertStartRequest(newStartRequest);
      return res.status(200).json(startRequest);
    } catch (e) {
      return res.status(500).send({ message: "Internal server error" });
    }
  }
);

// endpoint to get all teachers {id, surname, name, email}
router.get("/api/teachers", isLoggedIn, (req, res) => {
  try {
    const teachers = getTeachers();

    return res.status(200).json(teachers);
  } catch (e) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

// endpoint to get all groups {cod_group}
router.get("/api/groups", isLoggedIn, (req, res) => {
  try {
    //get the groups from db
    const groups = getGroups();
    return res.status(200).json(groups);
  } catch (e) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

// endpoint to get all degrees {cod_degree, title_degree}
router.get("/api/degrees", isLoggedIn, (req, res) => {
  try {
    const degrees = getDegrees();
    return res.status(200).json(degrees);
  } catch (e) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

function getDate() {
  const clock = getDelta();
  return dayjs().add(clock.delta, "day").format("YYYY-MM-DD");
}

router.get(
  "/api/proposals",
  check("archived").isBoolean().optional({ values: "falsy" }),
  isLoggedIn,
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ message: "Invalid parameters" });
    }
    try {
      const { email } = req.user;
      const user = getUser(email);
      const date = getDate();
      if (!user) {
        return res.status(500).json({ message: "Internal server error" });
      }
      let proposals;
      if (user.role === "student") {
        proposals = getProposalsByDegree(user.cod_degree).filter(
          (proposal) =>
            dayjs(date).isBefore(dayjs(proposal.expiration_date)) ||
            dayjs(date).isSame(dayjs(proposal.expiration_date))
        );
      } else if (user.role === "teacher") {
        proposals = getProposalsBySupervisor(user.id);
      } else {
        return res.status(500).json({ message: "Internal server error" });
      }
      proposals.map((proposal) => {
        if (proposal.manually_archived === 1) {
          proposal.archived = true;
        } else
          proposal.archived = !!dayjs(proposal.expiration_date).isBefore(
            dayjs(date)
          );
        delete proposal.manually_archived;
        return proposal;
      });
      if (req.query.archived !== undefined) {
        proposals = proposals.filter((proposal) => {
          return proposal.archived === req.query.archived;
        });
      }
      return res.status(200).json(proposals);
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post(
  "/api/applications",
  isLoggedIn,
  check("proposal").isInt({ gt: 0 }),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ message: "Invalid application content" });
    }
    try {
      const { email } = req.user;
      const user = getUser(email);
      if (!user || user.role !== "student") {
        return res
          .status(401)
          .json({ message: "Only a student can apply for a proposal" });
      }
      const { proposal } = req.body;
      const db_proposal = getProposal(proposal);
      if (db_proposal === undefined) {
        return res.status(400).json({ message: "Invalid application content" });
      }
      if (getPendingOrAcceptedApplicationsOfStudent(user.id).length !== 0) {
        return res.status(400).json({
          message: `The student ${user.id} has already applied to a proposal`,
        });
      }
      if (findAcceptedProposal(proposal)) {
        return res.status(400).json({
          message: `The proposal ${proposal} is already accepted for another student`,
        });
      }
      if (findRejectedApplication(proposal, user.id)) {
        return res.status(400).json({
          message:
            "The student has already applied for this application and it was rejected",
        });
      }
      const date = getDate();
      if (dayjs(date).isAfter(dayjs(db_proposal.expiration_date), "day")) {
        return res.status(400).json({
          message: `The proposal ${proposal} is expired, cannot apply`,
        });
      }
      const application = insertApplication(proposal, user.id, "pending");
      notifyNewApplication(application?.proposal_id);
      return res.status(200).json(application);
    } catch (e) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/api/applications", isLoggedIn, (req, res) => {
  try {
    const { email } = req.user;
    const user = getUser(email);
    if (!user) {
      return res.status(500).json({ message: "Internal server error" });
    }
    const date = getDate();
    let applications;
    if (user.role === "teacher") {
      applications = getApplicationsOfTeacher(user.id);
    } else if (user.role === "student") {
      applications = getApplicationsOfStudent(user.id);
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
    applications = applications.map((application) => {
      let db_proposal = getProposal(application.proposal_id);
      if (
        dayjs(date).isAfter(dayjs(db_proposal.expiration_date), "day") &&
        application.state === "pending"
      ) {
        application.state = "canceled";
      }
      return application;
    });
    return res.status(200).json(applications);
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get(
  "/api/applications/:id/attached-file",
  check("id").isInt({ min: 1 }),
  isLoggedIn,
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ message: "Invalid application content" });
    }
    try {
      const { id } = req.params;
      const application = getApplicationById(id);
      if (application === undefined) {
        return res.status(404).json({ message: "Application not found" });
      }
      const attachedFile = application.attached_file;
      if (attachedFile === undefined) {
        return res
          .status(404)
          .json({ message: "The application has not any attached files" });
      }
      return res.status(200).send(attachedFile);
    } catch (e) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

async function setStateToApplication(req, res, state) {
  const application = getApplicationById(req.params.id);
  if (application === undefined) {
    return res.status(400).json({ message: "Application not existent" });
  }
  if (application.state !== "pending") {
    return res.status(400).json({
      message: "You cannot modify an application already accepted or rejected",
    });
  }
  updateApplication(application.id, state);
  await notifyApplicationDecision(application.id, state);
  if (state === "accepted") {
    updateArchivedStateProposal(1, application.proposal_id);
    cancelPendingApplications(application.proposal_id);
  }
  return res.status(200).json({ message: `Application ${state}` });
}

router.patch(
  "/api/applications/:id",
  isLoggedIn,
  check("state").isIn(["accepted", "rejected"]).optional({ values: "falsy" }),
  check("id").isInt({ min: 1 }),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ message: "Invalid proposal content" });
    }
    try {
      const { email } = req.user;
      const user = getUser(email);
      if (user) {
        if (user.role === "teacher") {
          const { state } = req.body;
          if (state) {
            return await setStateToApplication(req, res, state);
          } else {
            return res.status(400).json({
              message:
                "You have to tell if you want to accept or reject the application",
            });
          }
        } else if (user.role === "student") {
          const application = getApplicationById(req.params.id);
          if (application.state !== "pending") {
            return res.status(401).json({
              message: "You cannot attach a file to a request not pending",
            });
          }
          // I am expecting a pdf file
          const uploadedFile = req.body;
          insertPDFInApplication(uploadedFile, req.params.id);
          return res.status(200).json({ message: "File uploaded correctly" });
        }
      } else {
        return res.status(500).json({ message: "Internal Server Error" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get(
  "/api/students/:studentId/exams",
  isLoggedIn,
  check("studentId").isAlphanumeric().isLength({ min: 7, max: 7 }),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ message: "Invalid proposal content" });
    }
    try {
      const { studentId } = req.params;
      return res.status(200).json(getExamsOfStudent(studentId));
    } catch (e) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get("/api/notifications", isLoggedIn, (req, res) => {
  try {
    const { email } = req.user;
    const user = getUser(email);
    if (!user) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    const notifications = getNotifications(user.id);
    return res.status(200).json(notifications);
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch(
  "/api/proposals/:id",
  check("id").isInt(),
  check("archived").equals("true"),
  isLoggedIn,
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ message: "Invalid proposal content" });
    }
    try {
      const { email } = req.user;
      const user = getUser(email);
      if (!user || user.role !== "teacher") {
        return res
          .status(401)
          .json({ message: "Only teachers can archive proposals" });
      }
      const { id } = req.params;
      const proposal = getProposal(id);
      if (proposal === undefined) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      if (proposal.supervisor !== user.id) {
        return res.status(401).json({
          message: "Unauthorized to change other teacher's proposal",
        });
      }
      updateArchivedStateProposal(1, id);
      cancelPendingApplications(id);
      return res.status(200).json({ ...proposal, archived: true });
    } catch (e) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.put(
  "/api/proposals/:id",
  isLoggedIn,
  check("id").isInt(),
  check("title").isString(),
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
      const { email } = req.user;
      const user = getUser(email);
      if (!user) {
        return res.status(500).send({ message: "Internal server error" });
      }
      if (user.role !== "teacher") {
        return res.status(401).json({
          message: "You must be authenticated as teacher to update a proposal",
        });
      }
      const {
        title,
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
      if (proposal.manually_archived === 1) {
        return res
          .status(401)
          .json({ message: "The proposal is manually archived" });
      }
      if (proposal.supervisor !== user.id) {
        return res
          .status(401)
          .json({ message: "You are not the creator of the proposal" });
      }
      if (findAcceptedProposal(proposal_id)) {
        return res.status(400).json({
          message: `The proposal ${proposal_id} is already accepted for another student`,
        });
      }
      for (const group of groups) {
        if (getGroup(group) === undefined) {
          return res.status(400).send({ message: "Invalid proposal content" });
        }
      }
      if (level !== "MSC" && level !== "BSC") {
        return res.status(400).send({ message: "Invalid proposal content" });
      }
      const legal_groups = [user.cod_group];
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
        user.id,
        co_supervisors.join(", "),
        groups.join(", "),
        keywords.join(", "),
        types.join(", "),
        description,
        required_knowledge,
        notes,
        dayjs(expiration_date).format("YYYY-MM-DD"),
        level,
        cds
      );
      return res.status(200).send({ message: "Proposal updated successfully" });
    } catch (e) {
      return res.status(500).send({ message: "Internal server error" });
    }
  }
);

router.delete(
  "/api/proposals/:id",
  isLoggedIn,
  check("id").isInt(),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ message: "Invalid proposal content" });
    }
    try {
      const { email } = req.user;
      const teacher = getUser(email);
      if (!teacher || teacher.role !== "teacher") {
        return res.status(401).json({
          message: "You must be authenticated as teacher to delete a proposal",
        });
      }
      const proposal = getProposal(req.params.id);
      if (proposal === undefined) {
        return res.status(404).json({
          message: `Proposal ${req.params.id} not found`,
        });
      }
      if (findAcceptedProposal(req.params.id)) {
        return res.status(400).json({
          message: `The proposal ${req.params.id} is already accepted for another student`,
        });
      }
      if (dayjs(proposal.expiration_date).isBefore(dayjs(getDate()))) {
        return res.status(401).json({
          message: "The proposal is expired, so it cannot be deleted",
        });
      }
      cancelPendingApplications(req.params.id);
      console.log("ciao");
      deleteProposal(req.params.id);
      console.log("ciao");
      return res
        .status(200)
        .send({ message: "Proposal deleted successfully." });
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get("/api/virtualClock", isLoggedIn, async (req, res) => {
  try {
    const date = getDate();
    return res.status(200).json(date);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch(
  "/api/virtualClock",
  isLoggedIn,
  check("date").isISO8601().toDate(),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ message: "Invalid date content" });
    }
    try {
      const clock = getDelta();
      const newDelta = dayjs(req.body.date).diff(
        dayjs().format("YYYY-MM-DD"),
        "day"
      );
      if (newDelta < clock.delta) {
        return res.status(400).send({ message: "Cannot go back in the past" });
      }
      setDelta(newDelta);
      return res.status(200).send({ message: "Date successfully changed" });
    } catch (err) {
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

exports.router = router;
