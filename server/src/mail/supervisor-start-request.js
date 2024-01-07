const supervisorStartRequestHtmlTemplate = (variables) => {
    return `
        <html>
            <body>
                <p>Dear ${variables.name},</p>
                <p>The student '${variables.student}' has created a new start request and assigned you as supervisor.</p>
                <p>Best regards,</p>
                <p>the Thesis Managment system</p>
            </body>
        </html>
    `;
};

const supervisorStartRequestTextTemplate = (variables) => {
    return `Dear ${variables.name},\nThe student '${variables.student}' has created a new start request and assigned you as supervisor.\nBest regards,\nthe Thesis Managment system`;
};

exports.supervisorStartRequestTemplate = (variables) => ({
    html: supervisorStartRequestHtmlTemplate(variables),
    text: supervisorStartRequestTextTemplate(variables)
});