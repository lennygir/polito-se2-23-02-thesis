const removedCosupervisorHtmlTemplate = (variables) => {
    return `
        <html>
            <body>
                <p>Dear ${variables.name},</p>
                <p>You have been removed from the list of co-supervisors for the following thesis proposal:</p>
                <p>Title: ${variables.proposal.title}</p>
                <p>Description: ${variables.proposal.description.substring(0, 100) + (variables.proposal.description.length > 100 ? '...' : '')}</p>
                <p>Supervisor: ${variables.proposal.supervisor}</p>
                <p>Co-supervisors: ${variables.proposal.co_supervisors}</p>
                <p>Keywords: ${variables.proposal.keywords}</p>
                <p>Groups: ${variables.proposal.groups}</p>
                <p>Types: ${variables.proposal.types}</p>
                <p>Level: ${variables.proposal.level}</p>
                <p>CDS: ${variables.proposal.cds}</p>
                <p>Expiration date: ${variables.proposal.expiration_date}</p>
                <p>Best regards,</p>
                <p>the Thesis Managment system</p>
            </body>
        </html>
    `;
};

const removedCosupervisorTextTemplate = (variables) => {
    return `Dear ${variables.name}, You have been removed from the list of co-supervisors for the following thesis proposal:\nTitle: ${variables.proposal.title}\nDescription: ${variables.proposal.description.substring(0, 100) + (variables.proposal.description.length > 100 ? '...' : '')}\nSupervisor: ${variables.proposal.supervisor}\nCo-supervisors: ${variables.proposal.co_supervisors}\nKeywords: ${variables.proposal.keywords}\nGroups: ${variables.proposal.groups}\nTypes: ${variables.proposal.types}\nLevel: ${variables.proposal.level}\nCDS: ${variables.proposal.cds}\nExpiration date: ${variables.proposal.expiration_date}\nBest regards,\nthe Thesis Managment system\n`;
};

exports.removedCosupervisorTemplate = (variables) => ({
    html: removedCosupervisorHtmlTemplate(variables),
    text: removedCosupervisorTextTemplate(variables)
});