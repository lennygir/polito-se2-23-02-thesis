const addedCosupervisorHtmlTemplate = (variables) => {
    return `
        <html>
            <body>
                <p>Dear ${variables.name},</p>
                <p>You have been added to the list of co-supervisors for the following thesis proposal:</p>
                <p>Title: ${variables.proposal.title}</p>
                <p>Consult the list of proposals to have more details.</p>
                <p>Best regards,</p>
                <p>the Thesis Managment system</p>
            </body>
        </html>
    `;
};

const addedCosupervisorTextTemplate = (variables) => {
    return `Dear ${variables.name}, You have been added to the list of co-supervisors for the following thesis proposal:\nTitle: ${variables.proposal.title}\nConsult the list of proposals to have more details.\nBest regards,\nthe Thesis Managment system\n`;
};

exports.addedCosupervisorTemplate = (variables) => ({
    html: addedCosupervisorHtmlTemplate(variables),
    text: addedCosupervisorTextTemplate(variables)
});