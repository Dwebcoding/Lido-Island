const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');
const bookingEmailTemplate = fs.readFileSync(templatePath, 'utf8');

module.exports = bookingEmailTemplate;
