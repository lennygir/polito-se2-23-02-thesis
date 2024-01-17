const cosupervisorStartRequestHtmlTemplate = (variables) => {
    return `
        <html>
            <body>
                <p>Dear ${variables.name},</p>
                <p>The student '${variables.student}' has created a new start request and assigned you as a co-supervisor.</p>
                <p>Best regards,</p>
                <p>the Thesis Managment system</p>
            </body>
        </html>
    `;
};

const cosupervisorStartRequestTextTemplate = (variables) => {
    return `Dear ${variables.name},\nThe student '${variables.student}' has created a new start request and assigned you as a co-supervisor.\nBest regards,\nthe Thesis Managment system`;
};

exports.cosupervisorStartRequestTemplate = (variables) => ({
    html: cosupervisorStartRequestHtmlTemplate(variables),
    text: cosupervisorStartRequestTextTemplate(variables)
});