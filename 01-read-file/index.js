const fs = require('fs');
const path = require('path');

function logFileContent(filePath) {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) throw err;
    console.log(data);
  });
}

logFileContent(path.join(__dirname, 'text.txt'));
