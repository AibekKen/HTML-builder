const fs = require('fs');
const path = require('path');

const writeBundle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
const stylesDir = path.join(__dirname, 'styles');

fs.readdir(stylesDir, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    if (path.extname(file) === '.css') {
      const readStyle = fs.createReadStream(path.join(stylesDir, file), 'utf-8');
      readStyle.on('data', chunk => writeBundle.write(chunk+'\n'));
    }
  });
});
