const { CronJob } = require('cron');
const { getProposalsThatExpireInXDays, notifyProposalExpiration } = require('./theses-dao');

const cronjobNames = {
    THESIS_EXPIRED: 'THESIS_EXPIRED'
};

const cronjobs = {};

const initCronjobs = () => {
    cronjobs[cronjobNames.THESIS_EXPIRED] = new CronJob("0 0 * * *" , () => {
        const proposals = getProposalsThatExpireInXDays(7);
        proposals.forEach(async (proposal) => {
            notifyProposalExpiration(proposal);
        });
    }, undefined, true, "Europe/Rome", undefined, true);
};

const runCronjob = (cronjobName) => {
    console.log('[Cron] Running job ' + cronjobName);
    if(cronjobs[cronjobName]) {
        cronjobs[cronjobName].fireOnTick();
    }
};

module.exports = {
    cronjobNames,
    runCronjob,
    initCronjobs
};