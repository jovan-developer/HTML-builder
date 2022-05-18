
const path = require('path');
const fs = require('fs').promises;
const baseFs = require('fs');

const stylesComponents = path.join(__dirname, 'styles');
const htmlComponents = path.join(__dirname, 'components');
const assets = path.join(__dirname, 'assets');
const destPath = path.join(__dirname, 'project-dist');
const mainHtml = path.join(__dirname, 'template.html');


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

async function readFilesFromDir(pathToDir, dest, filename, searchedExt) {
  try {
    const files = await fs.readdir(pathToDir, { withFileTypes: true });
    let ifExist = await checkFileExist(dest);
    let resultBuffer = '';

    if (!ifExist) {
      await fs.mkdir(dest);
      console.log(`Directory ${dest} was created`);
    }

    for (const file of files) {
      if (file.isFile()) {
        const ext = path.extname(file.name);
        if (ext === searchedExt) {
          const fileContent = await fs.readFile(path.join(pathToDir, file.name));
          resultBuffer += fileContent;
        }
      }
    }

    fs.appendFile(path.join(destPath, filename), resultBuffer, { flag: 'w' });
  } catch (err) {
    console.error(err);
  }
}

async function htmlTemplates(pathToDir, dest, filename, searchedExt) {
  try {
    const files = await fs.readdir(pathToDir, { withFileTypes: true });
    let ifExist = await checkFileExist(dest);
    const mainContent = await fs.readFile(mainHtml);
    let str = mainContent.toString();

    if (!ifExist) {
      await fs.mkdir(dest);
      console.log(`Directory ${dest} was created`);
    }

    for (const file of files) {
      if (file.isFile()) {
        const ext = path.extname(file.name);
        if (ext === searchedExt) {
          let componentName = path.basename(file.name, ext);
          const regexp = new RegExp('{{(' + componentName + ')}}', 'gi');
          const contentFile = await fs.readFile(path.join(pathToDir, file.name));
          str = str.replace(regexp, contentFile.toString());
        }
      }
    }

    fs.appendFile(path.join(destPath, filename), str, { flag: 'w' });
  } catch (err) {
    console.error(err);
  }
}

async function assetsFolder(pathToDir, dest) {
  try {
    const files = await fs.readdir(pathToDir, { withFileTypes: true });
    let ifExist = await checkFileExist(dest);
    let destFolder = dest;
    console.log(destFolder);

    if (!ifExist) {
      await fs.mkdir(dest);
      console.log(`Directory ${dest} was created`);
    }

    for (const file of files) {
      console.log(file);
      if (file.isFile()) {
        const fileContent = await fs.readFile(path.join(pathToDir, file.name));
        // path.basename(destFolder,)
        console.log(file.name);
        fs.appendFile(path.join(destFolder, file.name()), fileContent, { flag: 'w' });
      }
    }


  } catch (err) {
    console.error(err);
  }
}

readFilesFromDir(stylesComponents, destPath, 'style.css', '.css');
htmlTemplates(htmlComponents, destPath, 'index.html', '.html');
assetsFolder(assets, path.join(destPath, 'assets'));
