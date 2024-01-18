"use strict";

const { getDelta } = require("../dao/virtual-clock");
const dayjs = require("dayjs");
const { getGroup, notifyApplicationDecision } = require("../dao/misc");
const { getTeacherByEmail } = require("../dao/user");
const {
  getApplicationById,
  updateApplication,
  cancelPendingApplications,
} = require("../dao/applications");
const { updateArchivedStateProposal } = require("../dao/proposals");

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

function check_errors(start_request, user, old_status) {
  if (user.id !== start_request.supervisor) {
    throw new Error("You are not the supervisor of this thesis request");
  }

  if (old_status === "changes_requested") {
    throw new Error(
      "The thesis request is still waiting to be changed by the student",
    );
  }

  if (old_status === "requested") {
    throw new Error("The request has not been evaluated by the secretary yet.");
  }

  if (
    old_status === "teacher_rejected" ||
    old_status === "secretary_rejected" ||
    old_status === "started"
  ) {
    throw new Error("The request has been already approved / rejected");
  }
}

function determineNewStatus(start_request, user, decision) {
  const old_status = start_request.status;
  let new_status;

  if (user.role === "secretary_clerk") {
    if (old_status !== "requested") {
      throw new Error("The request has been already approved / rejected");
    }
    if (decision === "approved") {
      new_status = "secretary_accepted";
    } else if (decision === "rejected") {
      new_status = "secretary_rejected";
    } else {
      throw new Error(
        "The secretary clerk has not the permission to perform this operation",
      );
    }
  } else if (user.role === "teacher") {
    check_errors(start_request, user, old_status);

    if (decision === "approved") {
      new_status = "started";
    } else if (decision === "rejected") {
      new_status = "teacher_rejected";
    } else if (decision === "changes_requested") {
      new_status = "changes_requested";
    } else {
      throw new Error(
        "The teacher has not the permission to perform this operation",
      );
    }
  }
  return new_status;
}

function validateProposal(res, proposal, user) {
  const { co_supervisors, groups, level } = proposal;
  for (const group of groups) {
    if (getGroup(group) === undefined) {
      throw new Error("Invalid proposal content");
    }
  }
  if (level !== "MSC" && level !== "BSC") {
    throw new Error("Invalid proposal content");
  }
  const legal_groups = [user.cod_group];
  for (const co_supervisor_email of co_supervisors) {
    const co_supervisor = getTeacherByEmail(co_supervisor_email);
    if (co_supervisor !== undefined) {
      legal_groups.push(co_supervisor.cod_group);
    }
  }
  if (!groups.every((group) => legal_groups.includes(group))) {
    throw new Error("Invalid groups");
  }
  if (co_supervisors.includes(user.email)) {
    throw new Error(
      "The supervisor's email is included in the list of co-supervisors",
    );
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
  notifyApplicationDecision(application.id, state);
  if (state === "accepted") {
    updateArchivedStateProposal(1, application.proposal_id);
    cancelPendingApplications(application.proposal_id);
  }
  return res.status(200).json({ message: `Application ${state}` });
}

module.exports = {
  getDate,
  isArchived,
  determineNewStatus,
  validateProposal,
  setStateToApplication,
};
