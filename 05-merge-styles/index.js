
const path = require('path');
const fs = require('fs').promises;
const baseFs = require('fs');

const directoryPath = path.join(__dirname, 'styles');
const destPath = path.join(__dirname, 'project-dist',);


async function checkFileExist(filePath) {
  let result = false;
  try {
    await fs.access(filePath, baseFs.constants.F_OK);
    result = true;
  } catch (e) {
    console.log(`${filePath} does not exist.`);
  }
  return result;
}

async function readFilesFromDir(pathToDir) {
  try {
    const files = await fs.readdir(pathToDir, { withFileTypes: true });
    let ifExist = await checkFileExist(destPath);
    let resultBuffer = '';

    if (!ifExist) {
      await fs.mkdir(destPath);
      console.log(`Directory ${destPath} was created`);
    }

    for (const file of files) {
      if (file.isFile()) {
        const ext = path.extname(file.name);
        if (ext === '.css') {
          const fileContent = await fs.readFile(path.join(pathToDir, file.name));
          resultBuffer += fileContent;
        }
      }
    }

    fs.appendFile(path.join(destPath, 'bundle.css'), resultBuffer, { flag: 'w' });
  } catch (err) {
    console.error(err);
  }
}

readFilesFromDir(directoryPath);
