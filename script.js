let fs = require('fs');
let text = fs.readFileSync("./input.txt", "utf-8");
let textByLine = text.split('\n');

// console.log(textByLine);
let outputText = [];

let applicants = [];

let stages = {};

// Incase DEFINE not in txt file
DEFAULT_STAGES = {"ManualReview" : 0,
                  "PhoneInterview" : 0,
                  "BackgroundCheck" : 0,
                  "DocumentSigning" : 0}


const create = function(name) {
  if (!applicants.includes(name)) {
    applicants.push(name);
    outputText.push(`CREATE ${name}`);
  } else {
    outputText.push("Duplicate Applicant");
  }
}

const stageCreator = function(defineLine) {
  let str = defineLine.split(" ");
  for (var i = 1; i < str.length; i++) {
    stages[str[i]] = 0;
  }
}

const stats = function(stage) {
  let record = [];
  Object.keys(stage).forEach(key => {
    record.push(key);
    record.push(stage[key]);
  });
  outputText.push(record.join(" "));
}


create("hi")
create("hi")
stageCreator("DEFINE ManualReview BackgroundCheck DocumentSigning")
stats(stages)
console.log(outputText);
