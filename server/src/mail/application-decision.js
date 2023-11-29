const applicationDecisionHtmlTemplate = (variables) => {
    return `
        <html>
            <body>
                <p>Dear ${variables.name},</p>
                <p>your application for the thesis ${variables.thesis} has been ${variables.decision}.</p>
                <p>Best regards,</p>
                <p>the Thesis Managment system</p>
            </body>
        </html>
    `;
};

const applicationDecisionTextTemplate = (variables) => {
    return `Dear ${variables.name},\nyour application for the thesis ${variables.thesis} has been ${variables.decision}.\nBest regards,\nthe Thesis Managment system`;
};

exports.applicationDecisionTemplate = (variables) => ({
    html: applicationDecisionHtmlTemplate(variables),
    text: applicationDecisionTextTemplate(variables)
});