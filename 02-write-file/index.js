const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const { stdin, stdout, exit } = process;

const vars = process.argv.slice(2) || null;
const flag = vars[0] === '-copy';

console.log(flag);
class File {
  constructor(filename) {
    this.file = path.join(__dirname, filename);
    this.filename = filename;
    this.create();
  }


  async create(data = '') {
    try {
      await fsp.writeFile(this.file, data);
    } catch (error) {
      console.error(`Got an error trying to write to a file: ${error.message}`);
    }
  }

  async read() {
    try {
      const data = await fsp.readFile(this.file);
      console.log(data.toString());
      return data.toString();
    } catch (error) {
      console.error(`Got an error trying to read the file: ${error.message}`);
    }
  }

  async append(data) {
    try {
      await fsp.appendFile(this.file, data);
    } catch (error) {
      console.error(
        `Got an error trying to appedn to the file: ${error.message}`
      );
    }
  }

  async copy(outputFile) {
    try {
      await fsp.copyFile(this.file, outputFile);
    } catch (error) {
      console.error(
        `Got an error trying to appedn to the file: ${error.message}`
      );
    }
  }
}



const text = new File('text.txt');

if (flag) {
  text.copy(path.join(__dirname, 'new.txt'));
} else {
  stdout.write('Введите данные для добавления в файл ?\n');
  stdin.on('data', data => {
    const content = data.toString();
    if (content.trim() === 'exit') stdin.emit('end', 'Goodbye my friend');
    if (content.trim() === 'copy') stdin.emit('copy', 'Copy file');
    text.append(content);
  });

  stdin.on('end', (message) => {
    stdout.write(message);
    text.copy(path.join(__dirname, 'new.txt'));
    exit();
  });

  stdin.on('copy', (message) => {
    stdout.write(message);
    text.copy(path.join(__dirname, 'new.txt'));
  });
}
