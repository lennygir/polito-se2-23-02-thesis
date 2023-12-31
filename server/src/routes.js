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
  updateStatusStartRequest,
  getStatusStartRequest,
  getApplicationsOfTeacher,
  getApplicationsOfStudent,
  deleteProposal,
  updateProposal,
  getApplicationById,
  getTeacherByEmail,
  cancelPendingApplications,
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
  getRequestForClerk,
  getTeacher,
  getAcceptedApplicationsOfStudent,
  getPendingApplicationsOfStudent,
  notifyNewStartRequest,
} = require("./theses-dao");
const { getUser } = require("./user-dao");

function getDate() {
  const clock = getDelta();
  return dayjs().add(clock.delta, "day").format("YYYY-MM-DD");
}

function isArchived(proposal) {
  return (
    !!proposal.manually_archived ||
    dayjs(proposal.expiration_date).isBefore(dayjs(getDate()))
  );
}

function validateProposal(res, proposal, user) {
  const { co_supervisors, groups, level } = proposal;
  for (const group of groups) {
    if (getGroup(group) === undefined) {
      return res.status(400).json({ message: "Invalid proposal content" });
    }
  }
  if (level !== "MSC" && level !== "BSC") {
    return res.status(400).json({ message: "Invalid proposal content" });
  }
  const legal_groups = [user.cod_group];
  for (const co_supervisor_email of co_supervisors) {
    const co_supervisor = getTeacherByEmail(co_supervisor_email);
    if (co_supervisor !== undefined) {
      legal_groups.push(co_supervisor.cod_group);
    }
  }
  if (!groups.every((group) => legal_groups.includes(group))) {
    return res.status(400).json({ message: "Invalid groups" });
  }
}

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
  const user = getUser(req.user);
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
    try {
      if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: "Invalid proposal content" });
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
      const user = getUser(req.user);
      if (!user || user.role !== "teacher") {
        return res.status(401).json({
          message: "You must be authenticated as teacher to add a proposal",
        });
      }
      validateProposal(res, req.body, user);
      const teacher = insertProposal({
        title: title,
        supervisor: user.id,
        co_supervisors: co_supervisors.join(", "),
        groups: groups.join(", "),
        keywords: keywords.join(", "),
        types: types.join(", "),
        description: description,
        required_knowledge: required_knowledge,
        notes: notes,
        expiration_date: dayjs(expiration_date).format("YYYY-MM-DD"),
        level: level,
        cds: cds,
      });
      return res.status(200).json(teacher);
    } catch (e) {
      return res.status(500).json({ message: "Internal server error" });
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
    try {
      if (!validationResult(req).isEmpty()) {
        return res
          .status(400)
          .json({ message: "Invalid start request content" });
      }
      const newStartRequest = req.body;
      const supervisor = getTeacher(newStartRequest.supervisor);
      if (supervisor === undefined) {
        return res.status(400).json({
          message: "The supervisor doesn't exist",
        });
      }
      const user = getUser(req.user);
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
      notifyNewStartRequest(startRequest);
      return res.status(200).json(startRequest);
    } catch (e) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.patch(
  "/api/start-requests/:thesisRequestId",
  isLoggedIn,
  check("approved").isBoolean(),
  (req, res) => {
    try {
      if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: "Invalid content" });
      }
      const user = getUser(req.user);
      if (
        !user ||
        (user.role !== "secretary_clerk" && user.role !== "teacher")
      ) {
        return res.status(401).json({
          message: "Only a teacher or a secretary can approve a thesis request",
        });
      }

      const approved = req.body.approved;
      const req_id = req.params.thesisRequestId;
      let new_status;
      const old_status = getStatusStartRequest(req_id);
      if (user.role === "secretary_clerk") {
        if (old_status.status !== "requested") {
          return res.status(401).json({
            message: "The request has been already approved / rejected",
          });
        }
        if (approved === true) {
          new_status = "secretary_accepted";
        } else {
          new_status = "rejected";
        }
        updateStatusStartRequest(new_status, req_id);
      }

      return res.status(200).json({ message: "Request updated successfully" });
    } catch (e) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);
// endpoint to get all teachers {id, surname, name, email}
router.get("/api/teachers", isLoggedIn, (req, res) => {
  try {
    return res.status(200).json(getTeachers());
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// endpoint to get all groups {cod_group}
router.get("/api/groups", isLoggedIn, (req, res) => {
  try {
    return res.status(200).json(getGroups());
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// endpoint to get all degrees {cod_degree, title_degree}
router.get("/api/degrees", isLoggedIn, (req, res) => {
  try {
    return res.status(200).json(getDegrees());
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get(
  "/api/proposals",
  check("archived").isBoolean().optional({ values: "falsy" }),
  isLoggedIn,
  (req, res) => {
    try {
      if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: "Invalid parameters" });
      }
      const user = getUser(req.user);
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
      proposals.map((proposal) => {
        proposal.archived = isArchived(proposal);
        delete proposal.manually_archived;
        delete proposal.deleted;
        return proposal;
      });
      if (req.query.archived !== undefined) {
        proposals = proposals.filter(
          (proposal) => proposal.archived === req.query.archived,
        );
      }
      if (user.role === "student") {
        proposals = proposals.filter((proposal) => !proposal.archived);
      }
      return res.status(200).json(proposals);
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.post(
  "/api/applications",
  isLoggedIn,
  check("proposal").isInt({ gt: 0 }),
  async (req, res) => {
    try {
      if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: "Invalid application content" });
      }
      const user = getUser(req.user);
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
      if (db_proposal.deleted === 1) {
        return res.status(404).json("Proposal not found");
      }
      if (getAcceptedApplicationsOfStudent(user.id).length !== 0) {
        return res.status(400).json({
          message: `The student ${user.id} has an accepted proposal`,
        });
      }
      let pendingApplicationsOfStudent = getPendingApplicationsOfStudent(
        user.id,
      );
      if (
        pendingApplicationsOfStudent.find(
          (application) => !isArchived(getProposal(application.proposal_id)),
        )
      ) {
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
      if (isArchived(db_proposal)) {
        return res.status(401).json({
          message: `The proposal ${proposal} is archived, cannot apply`,
        });
      }
      const application = insertApplication(proposal, user.id, "pending");
      await notifyNewApplication(application?.proposal_id);
      return res.status(200).json(application);
    } catch (e) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.get("/api/applications", isLoggedIn, (req, res) => {
  try {
    const user = getUser(req.user);
    if (!user) {
      return res.status(500).json({ message: "Internal server error" });
    }
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
      if (isArchived(db_proposal) && application.state === "pending") {
        application.state = "canceled";
      }
      application.attached_file = !!application.attached_file;
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
    try {
      if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: "Invalid parameters" });
      }
      const application = getApplicationById(req.params.id);
      if (application === undefined) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (application.attached_file === undefined) {
        return res
          .status(404)
          .json({ message: "The application has not any attached files" });
      }
      return res.status(200).send(application.attached_file);
    } catch (e) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.patch(
  "/api/applications/:id",
  isLoggedIn,
  check("state").isIn(["accepted", "rejected"]).optional({ values: "falsy" }),
  check("id").isInt({ min: 1 }),
  async (req, res) => {
    try {
      if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: "Invalid content" });
      }
      const user = getUser(req.user);
      if (user) {
        if (user.role === "teacher") {
          if (req.body.state) {
            return await setStateToApplication(req, res, req.body.state);
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
          insertPDFInApplication(req.body, req.params.id);
          return res.status(200).json({ message: "File uploaded correctly" });
        }
      } else {
        return res.status(500).json({ message: "Internal Server Error" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.get(
  "/api/students/:studentId/exams",
  isLoggedIn,
  check("studentId").isAlphanumeric().isLength({ min: 7, max: 7 }),
  (req, res) => {
    try {
      if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: "Invalid parameters" });
      }
      return res.status(200).json(getExamsOfStudent(req.params.studentId));
    } catch (e) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.get("/api/notifications", isLoggedIn, (req, res) => {
  try {
    const user = getUser(req.user);
    if (!user) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json(getNotifications(user.id));
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
    try {
      if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: "Invalid content" });
      }
      const user = getUser(req.user);
      if (!user || user.role !== "teacher") {
        return res
          .status(401)
          .json({ message: "Only teachers can archive proposals" });
      }
      const proposal = getProposal(req.params.id);
      if (proposal === undefined) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      if (proposal.supervisor !== user.id) {
        return res.status(401).json({
          message: "Unauthorized to change other teacher's proposal",
        });
      }
      if (proposal.deleted === 1) {
        return res.status(404).json("Proposal not found");
      }
      updateArchivedStateProposal(1, req.params.id);
      cancelPendingApplications(req.params.id);
      return res.status(200).json({ ...proposal, archived: true });
    } catch (e) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
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
    try {
      if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: "Invalid proposal content" });
      }
      const user = getUser(req.user);
      if (!user) {
        return res.status(500).json({ message: "Internal server error" });
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
      if (proposal.deleted === 1) {
        return res.status(404).json({ message: "Proposal not found" });
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
      validateProposal(res, req.body, user);
      updateProposal({
        proposal_id: proposal_id,
        title: title,
        supervisor: user.id,
        co_supervisors: co_supervisors.join(", "),
        groups: groups.join(", "),
        keywords: keywords.join(", "),
        types: types.join(", "),
        description: description,
        required_knowledge: required_knowledge,
        notes: notes,
        expiration_date: dayjs(expiration_date).format("YYYY-MM-DD"),
        level: level,
        cds: cds,
      });
      return res.status(200).json({ message: "Proposal updated successfully" });
    } catch (e) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.delete(
  "/api/proposals/:id",
  isLoggedIn,
  check("id").isInt(),
  async (req, res) => {
    try {
      if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: "Invalid parameters" });
      }
      const teacher = getUser(req.user);
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
      deleteProposal(req.params.id);
      return res
        .status(200)
        .json({ message: "Proposal deleted successfully." });
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.get("/api/virtualClock", isLoggedIn, async (req, res) => {
  try {
    return res.status(200).json(getDate());
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch(
  "/api/virtualClock",
  isLoggedIn,
  check("date").isISO8601().toDate(),
  async (req, res) => {
    try {
      if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: "Invalid date content" });
      }
      const newDelta = dayjs(req.body.date).diff(
        dayjs().format("YYYY-MM-DD"),
        "day",
      );
      if (newDelta < getDelta().delta) {
        return res.status(400).json({ message: "Cannot go back in the past" });
      }
      setDelta(newDelta);
      return res.status(200).json({ message: "Date successfully changed" });
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.get("/api/start-requests", isLoggedIn, async (req, res) => {
  try {
    const user = getUser(req.user);
    if (!user) {
      return res.status(500).json({ message: "Internal server error" });
    }
    let requests;
    if (user.role === "secretary_clerk") {
      requests = getRequestForClerk();
    } else if (user.role === "teacher") {
      // requests = getRequestForTeacher();
    } else if (user.role === "student") {
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
    requests.map((request) => {
      request.supervisor = getTeacher(request.supervisor).email;
      if (!request.co_supervisors) {
        delete request.co_supervisors;
      } else {
        request.co_supervisors = request.co_supervisors.split(", ");
      }
      const { approval_date } = request;
      if (approval_date === null) {
        delete request["approval_date"];
      }
      return request;
    });
    return res.status(200).json(requests);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// ==================================================
// Handle 404 not found - DO NOT ADD ENDPOINTS AFTER THIS
// ==================================================
router.use(function (req, res) {
  return res.status(404).json({
    message: "Endpoint not found, make sure you used the correct URL / Method",
  });
});

exports.router = router;
