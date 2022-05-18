const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const filesCopy = path.join(__dirname, 'files-copy');
const files = path.join(__dirname, 'files');

async function copyDir() {
  await fsPromises.mkdir(filesCopy, { recursive: true });
  fs.readdir(filesCopy, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.unlink(path.join(filesCopy, file), err => {
        if (err) throw err;
      });
    });
  });

  fs.readdir(files, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((dirent) => {
      if (dirent.isFile()) {
        fsPromises.copyFile(path.join(__dirname, 'files', dirent.name), path.join(filesCopy, dirent.name));
      }
    });
  });
}

copyDir();


