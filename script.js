let fs = require('fs');
let text = fs.readFileSync("./input.txt", "utf-8")
let textByLine = text.split('\n')

console.log(textByLine);
