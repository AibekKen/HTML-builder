const fs = require('fs');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((dirent) => {
    if (dirent.isFile()) {
      const nameArr = dirent.name.split('.');
      fs.stat(path.join(secretFolder, dirent.name), (err, stat) => {
        if (err) throw err;
        process.stdout.write(`${nameArr[0]} - ${nameArr[1]} - ${stat.size}b\n`);
      });

    }
  });
});