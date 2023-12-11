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
  getProposals,
  getProposalsBySupervisor,
  getProposalsByDegree,
  getProposalsByAchived,
  updateApplication,
  getProposal,
  insertApplication,
  getApplicationsOfTeacher,
  getApplicationsOfStudent,
  deleteProposal,
  updateProposal,
  updateArchivedStateProposal,
  getApplicationById,
  getTeacherByEmail,
  getTeacherEmailById,
  getApplications,
  cancelPendingApplications,
  getPendingOrAcceptedApplicationsOfStudent,
  findAcceptedProposal,
  findRejectedApplication,
  notifyApplicationDecision,
  notifyNewApplication,
  getNotifications,
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
  // de-commento al merge check("supervisor").isAlphanumeric().isLength({ min: 7, max: 7 }),
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
        //supervisor,
        co_supervisors,
        groups,
        keywords,
        types,
        description,
        required_knowledge,
        notes,
        expiration_date,
        level,
        cds
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

      let expirationDate = dayjs(expiration_date)
      let currentDate = dayjs()
      let archived
      if(expirationDate.isBefore(currentDate, 'day')){
        archived = 1;
      }else{
        archived = 0;
      }

      let supervisor = "marco.torchiano@teacher.it"
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
        archived
      );

      
      return res.status(200).json(teacher);
    } catch (e) {
      return res.status(500).send({ message: "Internal server error" });
    }
  },
);

router.patch(
  "/api/proposals/:id",
  isLoggedIn,
  check("id").isInt(),
  (req, res) => {
  
  
  const archived = req.body.archived;
   if(typeof archived !== 'boolean'){
      return res.status(400).send({ message: "Invalid proposal content" });
    }
    const result = validationResult(req);
    if ((!result.isEmpty()) ) {
      return res.status(400).send({ message: "Invalid proposal content" });
    }
    try {
      const prop_id = req.params.id;
      
      let to_ret;
      let proposal = getProposal(prop_id);

      

      console.log(proposal)
      if(proposal === undefined){
        return res.status(404).send({ message: "Proposal not found" });
      }
      let teacher_email = getTeacherEmailById(proposal.supervisor)
      
      if(teacher_email.email !== req.user.email){
        return res.status(401).send({ message: "Unauthorized to change other teacher proposals" });
      }
      let currentDate = dayjs();
      const expirationDate = proposal.expiration_date;

      proposal.supervisor = teacher_email.email;
      if (proposal.co_supervisors.includes(',')) {
        // Convert comma-separated string to an array
        proposal.co_supervisors = proposal.co_supervisors.split(',').map(email => email.trim());
      }else{
        proposal.co_supervisors = [proposal.co_supervisors]
      }

      if (proposal.groups.includes(',')) {
        // Convert comma-separated string to an array
        proposal.groups = proposal.groups.split(',').map(group => group.trim());
      }else{
        proposal.groups = [proposal.groups]
      }

      if (proposal.keywords.includes(',')) {
        // Convert comma-separated string to an array
        proposal.keywords = proposal.keywords.split(',').map(keyword => keyword.trim());
      }else{
        proposal.keywords = [proposal.keywords]
      }

      if (proposal.type.includes(',')) {
        // Convert comma-separated string to an array
        proposal.type = proposal.type.split(',').map(type => type.trim());
      }else{
        proposal.type = [proposal.type]
      }


      if(archived == true){
        updateArchivedStateProposal(1, prop_id);
        to_ret = {
          ...proposal,
          "archived": true,
        }
      } else if(expirationDate.isBefore(currentDate)){
        updateArchivedStateProposal(1, prop_id);
        to_ret = {
          ...proposal,
          "archived": true,
        }
      }else{
        updateArchivedStateProposal(0, prop_id);
        to_ret = {
          ...proposal,
          "archived": false,
        }
      }

      // this following code is only to format the output to pass the tests, this is an inconsistes in the code 
      delete to_ret.id
      to_ret.types = to_ret.type
      delete to_ret.type
      

      return res.status(200).json(to_ret);
    } catch (e) {
      console.log(e)
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
      const cds = req.query.cds;
      const supervisor = req.query.supervisor;
      let archived = req.query.archived
      let proposals;
      if (cds !== undefined && supervisor === undefined && archived === undefined) {
        proposals = getProposalsByDegree(cds);
      }
      if (supervisor !== undefined && cds === undefined && archived === undefined) {
        proposals = getProposalsBySupervisor(supervisor);
      }

      if (archived !== undefined && cds === undefined && supervisor === undefined ) {
        if(archived == 'true'){
          archived = 1
        }else{
          archived = 0
        }
        proposals = getProposalsByAchived(archived);
      }

      if (cds === undefined && supervisor === undefined && archived === undefined) {
        
        proposals = getProposals();
      }
      if (proposals.length === 0) {
        
        return res
          .status(404)
          .send({ message: "No proposal found in the database" });
      }
      
      proposals.forEach(proposal => {
        // Get the email using the supervisor ID for each proposal
        let teacher_email = getTeacherEmailById(proposal.supervisor);
      
        // Update the supervisor field with the retrieved email
        proposal.supervisor = teacher_email.email;
        
        if (proposal.co_supervisors.includes(',')) {
          // Convert comma-separated string to an array
          proposal.co_supervisors = proposal.co_supervisors.split(',').map(email => email.trim());
        }else{
          proposal.co_supervisors = [proposal.co_supervisors]
        }

        if (proposal.groups.includes(',')) {
          // Convert comma-separated string to an array
          proposal.groups = proposal.groups.split(',').map(group => group.trim());
        }else{
          proposal.groups = [proposal.groups]
        }

        if (proposal.keywords.includes(',')) {
          // Convert comma-separated string to an array
          proposal.keywords = proposal.keywords.split(',').map(keyword => keyword.trim());
        }else{
          proposal.keywords = [proposal.keywords]
        }

        if (proposal.type.includes(',')) {
          // Convert comma-separated string to an array
          proposal.type = proposal.type.split(',').map(type => type.trim());
        }else{
          proposal.type = [proposal.type]
        }

       

        if(proposal.archived == 1){
          proposal.archived = true
        }else{
          proposal.archived = false
        }
        // this following code is only to format the output to pass the tests, this is an inconsistes in the code 
        proposal.types = proposal.type
        delete proposal.type
      });

      console.log(proposals)
      
      return res.status(200).json(proposals);
    } catch (err) {
      console.log(err)
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
      notifyNewApplication(application?.proposal_id);
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
        updateArchivedStateProposal(1, application.proposal_id)
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
