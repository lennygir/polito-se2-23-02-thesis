const newApplicationHtmlTemplate = (variables) => {
    return `
        <html>
            <body>
                <p>Dear ${variables.name},</p>
                <p>your thesis proposal "${variables.thesis}" received a new application.</p>
                <p>Best regards,</p>
                <p>the Thesis Managment system</p>
            </body>
        </html>
    `;
};

const newApplicationTextTemplate = (variables) => {
    return `Dear ${variables.name},\nyour thesis proposal "${variables.thesis}" received a new application.\nBest regards,\nthe Thesis Managment system`;
};

exports.newApplicationTemplate = (variables) => ({
    html: newApplicationHtmlTemplate(variables),
    text: newApplicationTextTemplate(variables)
});