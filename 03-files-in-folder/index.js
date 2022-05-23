const path = require("path");
const fs = require("fs").promises;
const directoryPath = path.join(__dirname, "secret-folder");

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

async function readFilesFromDir(pathToDir) {
  try {
    const files = await fs.readdir(pathToDir, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const ext = path.extname(file.name);
        const name = path.basename(file.name, ext);
        const pathToFile = path.resolve(pathToDir, file.name);
        const stat = await fs.stat(pathToFile);
        const fileSize = formatBytes(stat.size, 4);
        console.log(name, ext, fileSize);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

readFilesFromDir(directoryPath);
