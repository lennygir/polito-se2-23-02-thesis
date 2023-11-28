exports.applicationDecisionTemplate = function(variables) {
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