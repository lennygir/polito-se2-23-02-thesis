const cosupervisorApplicationDecisionHtmlTemplate = (variables) => {
    return `
        <html>
            <body>
                <p>Dear ${variables.name},</p>
                <p>An application has been ${variables.decision} for the thesis proposal "${variables.thesis}" for which you are co-supervisor.</p>
                <p>Best regards,</p>
                <p>the Thesis Managment system</p>
            </body>
        </html>
    `;
};

const cosupervisorApplicationDecisionTextTemplate = (variables) => {
    return `Dear ${variables.name},\nAn application has been ${variables.decision} for the thesis proposal "${variables.thesis}" for which you are co-supervisor.\nBest regards,\nthe Thesis Managment system`;
};

exports.cosupervisorApplicationDecisionTemplate = (variables) => ({
    html: cosupervisorApplicationDecisionHtmlTemplate(variables),
    text: cosupervisorApplicationDecisionTextTemplate(variables)
});