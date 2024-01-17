"use strict";
function getCosupervisorsFromProposal(proposal) {
  return proposal.co_supervisors ? proposal.co_supervisors.split(", ") : [];
}

function getArrayDifference(arrayIn, arrayNotIn) {
  return arrayIn.filter((el) => !arrayNotIn.includes(el));
}

module.exports = {
  getCosupervisorsFromProposal,
  getArrayDifference,
};
