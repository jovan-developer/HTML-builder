const path = require('path');
const logFileContent = require('./logFileContent');

logFileContent(path.join(__dirname, 'text.txt'));
