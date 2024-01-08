const proposalExpirationHtmlTemplate = (variables) => {
    return `
        <html>
            <body>
                <p>Dear ${variables.name},</p>
                <p>your thesis proposal "${variables.thesis}" expires in ${variables.nbOfDays} days (${variables.date}).</p>
                <p>Best regards,</p>
                <p>the Thesis Managment system</p>
            </body>
        </html>
    `;
};

const proposalExpirationTextTemplate = (variables) => {
    return `Dear ${variables.name},\nyour thesis proposal "${variables.thesis}" expires in ${variables.nbOfDays} days (${variables.date}).\nBest regards,\nthe Thesis Managment system`;
};

exports.proposalExpirationTemplate = (variables) => ({
    html: proposalExpirationHtmlTemplate(variables),
    text: proposalExpirationTextTemplate(variables)
});