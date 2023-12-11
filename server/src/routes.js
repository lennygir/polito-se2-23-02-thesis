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
  getNotifications,
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
        cds,
      );
      return res.status(200).json(teacher);
    } catch (e) {
      return res.status(500).send({ message: "Internal server error" });
    }
  },
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
          message: "You must be authenticated as student to add a start request",
        });
      }
      const userStartRequests = getNotRejectedStartRequest(user.id);
      if (userStartRequests.length !== 0) {
        return res.status(409).json({
          message: 'You already have a start request pending or accepted',
        });
      }
      if(newStartRequest.co_supervisors) {
        newStartRequest.co_supervisors = newStartRequest.co_supervisors.join(", ");
      }
      newStartRequest.approvalDate = null;
      newStartRequest.studentId = user.id;
      const startRequest = insertStartRequest(newStartRequest);
      return res.status(200).json(startRequest);
    } catch (e) {
      return res.status(500).send({ message: "Internal server error" });
    }
  },
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
router.get("/api/degrees", isLoggedIn, (req, res) => {
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

router.get("/api/proposals", isLoggedIn, (req, res) => {
  try {
    const { email } = req.user;
    const user = getUser(email);
    if (!user) {
      return res.status(500).json({ message: "Internal server error" });
    }
    let proposals;
    if (user.role === "student") {
      proposals = getProposalsByDegree(user.cod_degree);
    } else if (user.role === "teacher") {
      proposals = getProposalsBySupervisor(user.id);
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json(proposals);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

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
      const application = insertApplication(proposal, user.id, "pending");
      return res.status(200).json(application);
    } catch (e) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.get("/api/applications", isLoggedIn, (req, res) => {
  try {
    const { email } = req.user;
    const user = getUser(email);
    if (!user) {
      return res.status(500).json({ message: "Internal server error" });
    }
    let applications;
    if (user.role === "teacher") {
      applications = getApplicationsOfTeacher(user.id);
      return res.status(200).json(applications);
    } else if (user.role === "student") {
      applications = getApplicationsOfStudent(user.id);
      return res.status(200).json(applications);
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch(
  "/api/applications/:id",
  isLoggedIn,
  check("state").isIn(["accepted", "rejected"]),
  check("id").isInt({ min: 1 }),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ message: "Invalid proposal content" });
    }
    try {
      const { email } = req.user;
      const teacher = getUser(email);
      if (!teacher || teacher.role !== "teacher") {
        return res
          .status(401)
          .json({ message: "You must be a teacher to modify an application" });
      }
      const { state } = req.body;
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

// todo: to be modified. Should be used to story #12
router.patch("/api/proposals/:id", isLoggedIn, (req, res) => {});

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
        cds,
      );
      return res.status(200).send({ message: "Proposal updated successfully" });
    } catch (e) {
      return res.status(500).send({ message: "Internal server error" });
    }
  },
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
      cancelPendingApplications(req.params.id);
      deleteProposal(req.params.id);
      return res
        .status(200)
        .send({ message: "Proposal deleted successfully." });
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
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

exports.router = router;
