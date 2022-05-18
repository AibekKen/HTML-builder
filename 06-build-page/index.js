const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const templatePath = path.join(__dirname, 'template.html');
const readTemplate = fs.createReadStream(templatePath, 'utf-8');
const componentsPath = path.join(__dirname, 'components');
const projectDist = path.join(__dirname, 'project-dist');

async function creatHtml() {
  await fsPromises.mkdir(projectDist, { recursive: true });
  const writeIndex = fs.createWriteStream(path.join(projectDist, 'index.html'));
  let dataTemplate = '';
  readTemplate.on('data', (chunk) => dataTemplate += chunk);
  readTemplate.on('end', () => {
    fs.readdir(componentsPath, (err, components) => {
      if (err) throw err;
      components.forEach((component, i) => {
        if (path.extname(component) === '.html') {
          const baseName = path.basename(component, '.html');
          const readComponent = fs.createReadStream(path.join(componentsPath, component), 'utf-8');
          let dataComponent = '';
          readComponent.on('data', (chunk) => dataComponent += chunk);
          readComponent.on('end', () => {
            dataTemplate = dataTemplate.replace(`{{${baseName}}}`, dataComponent);
            if (i === components.length - 1) {
              writeIndex.write(dataTemplate);
            }
          });
        }
      });

    });
  });
}
creatHtml();

function bundleStyles() {
  const writeStyle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  const stylesDir = path.join(__dirname, 'styles');
  fs.readdir(stylesDir, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      if (path.extname(file) === '.css') {
        const readStyle = fs.createReadStream(path.join(stylesDir, file), 'utf-8');
        readStyle.on('data', chunk => writeStyle.write(chunk));
      }
    });
  });
}

bundleStyles();

const files = path.join(__dirname, 'assets');
const filesCopy = path.join(__dirname, 'project-dist', 'assets');
async function copyDir(dir1, dir2) {
  await fsPromises.mkdir(dir2, { recursive: true });
  function cleanAll(dir) {
    fs.readdir(dir, { withFileTypes: true }, (err, darnets) => {
      if (err) throw err;
      darnets.forEach((darnet) => {
        if (darnet.isFile()) {
          fs.unlink(path.join(dir, darnet.name), err => {
            if (err) throw err;
          });
        }
        else {
          fs.rmdir(path.join(dir, darnet.name), { recursive: true }, (err) => {
            if (err) {
              cleanAll(path.join(dir, darnet.name));
            }
          });
        }
      });
    });
  }
 // cleanAll(dir2);

  fs.readdir(dir1, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((dirent) => {
      if (dirent.isFile()) {
        fsPromises.copyFile(path.join(dir1, dirent.name), path.join(dir2, dirent.name));
      } else {
        copyDir(path.join(dir1, dirent.name), path.join(dir2, dirent.name));
      }
    });
  });
}

copyDir(files, filesCopy);