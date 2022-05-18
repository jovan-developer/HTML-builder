
const path = require('path');
const fs = require('fs').promises;
const baseFs = require('fs');

const directoryPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy',);


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

    if (!ifExist) {
      await fs.mkdir(destPath);
      console.log(`Directory ${destPath} was created`);
    }

    for (const file of files) {
      if (file.isFile()) {
        const pathToFile = path.resolve(pathToDir, file.name);
        const destFile = path.join(destPath, file.name);
        await fs.copyFile(pathToFile, destFile);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

readFilesFromDir(directoryPath);
