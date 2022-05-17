const path = require('path');
const fs = require('fs');

const textPath = path.join(path.join(__dirname, 'text.txt'));

const textReadStream = fs.createReadStream(textPath, 'utf-8');

let data = '';

textReadStream.on('data', (chunk) => data += chunk);
textReadStream.on('end', () => console.log(data));
