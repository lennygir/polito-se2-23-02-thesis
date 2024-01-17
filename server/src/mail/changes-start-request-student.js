const changesStartRequestStudentHtmlTemplate = (variables) => {
    return `
        <html>
            <body>
                <p>Dear ${variables.name},</p>
                <p>Your start request "${variables.startRequest}" require changes :</p>
                <p>${variables.changes}</p>
                <p>Best regards,</p>
                <p>the Thesis Managment system</p>
            </body>
        </html>
    `;
};

const changesStartRequestStudentTextTemplate = (variables) => {
    return `Dear ${variables.name},\nYour start request "${variables.startRequest}" require changes :\n${variables.changes}\nBest regards,\nthe Thesis Managment system`;
};

exports.changesStartRequestStudentTemplate = (variables) => ({
    html: changesStartRequestStudentHtmlTemplate(variables),
    text: changesStartRequestStudentTextTemplate(variables)
});