let fs = require('fs');
let text = fs.readFileSync("./input.txt", "utf-8");
let textByLine = text.split('\n');

let outputText = [];
let applicants = {};
let stages = {};

// Incase DEFINE not in txt file
DEFAULT_STAGES = {"ManualReview" : 0,
                  "PhoneInterview" : 0,
                  "BackgroundCheck" : 0,
                  "DocumentSigning" : 0,
                  "Hired" : 0,
                  "Rejected" : 0}


const create = function(name) {
  if (name in applicants) {
    outputText.push("Duplicate Applicant");
  } else {
    let firstStage = Object.keys(stages)[0];
    applicants[name] = firstStage;
    stages[firstStage] += 1;
    outputText.push(`CREATE ${name}`);
  }
}

const stageCreator = function(defineLine) {
  let str = defineLine
  for (var i = 1; i < str.length; i++) {
    stages[str[i]] = 0;
  }
  stages["Hired"] = 0;
  stages["Rejected"] = 0;
  outputText.push(defineLine.join(" "))
}

const stats = function(stage) {
  let record = [];
  Object.keys(stage).forEach(key => {
    record.push(key);
    record.push(stage[key]);
  });
  outputText.push(record.join(" "));
}

const advance = function(name, stageName) {
  let stg = Object.keys(stages);
  let idx = stg.indexOf(stageName);
  let currentStage = applicants[name];
  let currentStageIdx = stg.indexOf(currentStage);
  let lastStage = stg[stg.length - 3];
  let lastStageIdx = stg.indexOf(lastStage);

  if (!(name in applicants)) {
    // Assuming someone may not be in the database or their name is mispelled
    outputText.push(`${name} does not exist in the system`);
    return;
  }

  if (stageName === currentStage) {
    outputText.push(`Already in ${stageName}`);
  } else if (currentStageIdx === lastStageIdx) {
    outputText.push(`Already in ${lastStage}`);
  } else if (currentStageIdx < lastStageIdx && idx === -1) {
    previousStage = currentStage;
    currentStageIdx += 1;
    applicants[name] = stg[currentStageIdx];
    currentStage = stg[currentStageIdx]
    stages[previousStage] -= 1;
    stages[currentStage] += 1;
    outputText.push(`ADVANCE ${name}`);
  } else if (currentStageIdx < lastStageIdx && idx !== -1) {
    // Will assume applicants cannot go back to previous hiring stages
    previousStage = currentStage;
    currentStageIdx = idx;
    applicants[name] = stg[currentStageIdx];
    currentStage = stg[currentStageIdx]
    stages[previousStage] -= 1;
    stages[currentStage] += 1;
    outputText.push(`ADVANCE ${name}`);
  }
}

const decide = function(name, num) {
  //assume people cannot get hired after being rejected
  let stg = Object.keys(stages);
  let currentStage = applicants[name];
  let currentStageIdx = stg.indexOf(currentStage);
  let lastStage = stg[stg.length - 3];
  let lastStageIdx = stg.indexOf(lastStage);

  if (currentStageIdx === lastStageIdx && num === 1) {
    stages["Hired"] += 1;
    stages[lastStage] -= 1;
    outputText.push(`Hired ${name}`);
  } else if (num === 0) {
    stages["Rejected"] += 1;
    stages[applicants[name]] -= 1;
    outputText.push(`Rejected ${name}`);
  } else if (currentStageIdx < lastStageIdx && num === 1) {
    outputText.push(`Failed to decide for ${name}`);
  }
}

const readInput = function(input) {
  for (var i = 0; i < input.length; i++) {
    let line = input[i].split(" ");
    let command = line[0]
    if (command === "DEFINE") {
      stageCreator(line);
    } else if (command === "STATS") {
      stats(stages);
    } else if (command === "CREATE") {
      create(line[1]);
    } else if (command === "ADVANCE") {
      let name = line[1];
      let stageName = line[2];
      advance(name, stageName)
    } else if (command === "DECIDE") {
      console.log(command);
      let name = line[1];
      let choice = line[2];
      decide(name, parseInt(choice));
    }
  }
}

// stageCreator("DEFINE ManualReview BackgroundCheck DocumentSigning")
// stats(stages)
// create("pikapika325@gmail.com")
// create("boiboy325@gmail.com")
// stats(stages)
// advance("pikapika325@gmail.com")
// stats(stages)
// advance("pikapika325@gmail.com", "BackgroundCheck")
// stats(stages)
// advance("pikapika325@gmail.com", "DocumentSigning")
// stats(stages)
// advance("pikapika325@gmail.com", "DocumentSigning")
// stats(stages)
// decide("pikapika325@gmail.com", 1)
// decide("boiboy325@gmail.com", 0)
// stats(stages)
//
//

readInput(textByLine);
// console.log(textByLine[0].split(" ")[0] === "DEFINE");
// let output = fs.writeFileSync("output.txt")
// output.appendFileSync()

console.log(outputText);

let output = fs.writeFileSync("output.txt", "");
for (var i = 0; i < outputText.length; i++) {
  fs.appendFileSync("output.txt", outputText[i] + "\n");
}
