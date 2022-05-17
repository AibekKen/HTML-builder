const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;

const textPath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(textPath);

writeStream.write('');

stdout.write('Здравствуйте! Введите текст:\n ');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') process.exit();
  writeStream.write(data);
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => stdout.write('Удачи! Хорошего дня!'));


