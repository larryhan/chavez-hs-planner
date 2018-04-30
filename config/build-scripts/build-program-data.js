const fs = require("fs");

const normalizeProgramData = require("./util/normalize-program-data");

/**
 * Takes as input a JSON file listing all CPS Programs, both elementary school and high school.
 *
 * For the schema of the input JSON file, see ./schema/raw-data/raw-program-data.js.
 *
 * For the schema of the output JSON file, see ./schema/processed-data/program-data.js.
 * */
function buildProgramData(rawProgramDataCsv) {
  // convert the raw program data to the shape the app expects
  const programData = normalizeProgramData(rawProgramDataJSON);
  
  return programData;
}

module.exports = normalizeProgramData;
