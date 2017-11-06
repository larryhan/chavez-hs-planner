import StudentScores from "shared/types/student-scores"; 
import StudentScore from "shared/types/student-score";
import ScoreType from "shared/enums/score-type";

import {ritToPercentile, 
  percentileToRit, 
  NWEATestType,
  NWEAConvertErrors} from "shared/util/nwea-convert";

export const GradeConvertErrors = {
  BadScoreType: new Error("Incorrect ScoreType passed to GradeConvert method"),
  BadScore: new Error("Bad score passed to GradeConvert method"),
  BadPercentile: new Error("Bad percentile passed to GradeConvert method")
};

export const scoreToPercentile = (score: StudentScore, scoreType: ScoreType, gradeLevel: number): number => {
  switch(scoreType) {
    case ScoreType.nweaMath:
      return ritToPercentile(score, NWEATestType.Math, gradeLevel);
    case ScoreType.nweaRead:
      return ritToPercentile(score, NWEATestType.Reading, gradeLevel);
    case ScoreType.subjGradeMath:
    case ScoreType.subjGradeRead:
    case ScoreType.subjGradeSci:
    case ScoreType.subjGradeSocStudies:
      return numberGradeToPercentile(score);
    default:
      throw GradeConvertErrors.BadScoreType;
  }

};

export const percentileToScore = (percentile: number, scoreType: ScoreType, gradeLevel: number): StudentScore => {
  if(!(percentile >= 1 && percentile <= 99)) {
    throw GradeConvertErrors.BadPercentile;
  }
  switch(scoreType) {
    case ScoreType.nweaMath:
      return percentileToRit(percentile, NWEATestType.Math, gradeLevel);
    case ScoreType.nweaRead:
      return percentileToRit(percentile, NWEATestType.Reading, gradeLevel);
    case ScoreType.subjGradeMath:
    case ScoreType.subjGradeRead:
    case ScoreType.subjGradeSci:
    case ScoreType.subjGradeSocStudies:
      return gradePercentileToNumberGrade(percentile);
    default:
      throw GradeConvertErrors.BadScoreType;
  }
};

export const scoreToString = (score: StudentScore, scoreType: ScoreType): string => {
  switch(scoreType) {
    case ScoreType.nweaMath:
    case ScoreType.nweaRead:
      return score.toString(10);
    case ScoreType.subjGradeMath:
    case ScoreType.subjGradeRead:
    case ScoreType.subjGradeSci:
    case ScoreType.subjGradeSocStudies:
      return toLetterGrade(score);
    default:
      throw GradeConvertErrors.BadScoreType;
  }
};

export const tryParseScore = (str: string, scoreType: ScoreType): [boolean, StudentScore] => {
  switch(scoreType) {
    case ScoreType.nweaMath:
    case ScoreType.nweaRead:
      const score = Number.parseInt(str, 10);
      if (Number.isNaN(score)) {
        return [false, null];
      } else {
        return [true, score];
      }
    case ScoreType.subjGradeMath:
    case ScoreType.subjGradeRead:
    case ScoreType.subjGradeSci:
    case ScoreType.subjGradeSocStudies:
      try {
        return [true, toNumberGrade(str)];
      } catch(e) {
        return [false, null];
      }
    default:
      throw GradeConvertErrors.BadScoreType;
  }


};

export const toGPA = (scores: StudentScore[]) => {
  const toPoints = (score: StudentScore): number => {
    const letterGrade = toLetterGrade(score);
    switch(letterGrade){
      case "A":
        return 4;
      case "B":
        return 3;
      case "C":
        return 2;
      case "D":
        return 1;
      case "F":
        return 0;
    }
  };
  const numGrades = scores.length;
  const gradePointSum = scores.map(toPoints).reduce((a, b) => a + b);
  return gradePointSum / numGrades;
};

const letterGradeHighScores = {
  A: 100,
  B: 89,
  C: 79,
  D: 69,
  F: 59
};

const isLetterGrade = (strScore: string): boolean => {
  const letterGrades = ["A", "B", "C", "D", "F"];
  if (letterGrades.indexOf(strScore.toUpperCase()) !== -1) {
    return true;
  } else {
    return false;
  }
};

const isNumberGrade = (strScore: string): boolean => {
  const intScore: number = Number.parseInt(strScore, 10);
  const parseSuccessful = !Number.isNaN(intScore);
  if (parseSuccessful) {
    if (intScore >= 0 && intScore <= 100) {
      return true;
    }
  } else {
    return false;
  }
};

const toNumberGrade = (strScore: string): number => {
  if (isLetterGrade(strScore)) {
    return Number.parseInt(strScore);
  } else if (isNumberGrade(strScore)) {
    return letterGradeHighScores[strScore];
  } else {
    throw new Error(`toNumberGrade parse failed with ${strScore}`);
  }
};


export const toLetterGrade = (grade: number): string => {
  if (grade <= letterGradeHighScores["F"]) {
    return "F";
  } else if (grade <= letterGradeHighScores["D"]) {
    return "D";
  } else if (grade <= letterGradeHighScores["C"]) {
    return "C";
  } else if (grade <= letterGradeHighScores["B"]) {
    return "B";
  } else {
    return "A";
  }
};

const createNumberRangeMapFunction = (inputRange: [number,number], outputRange: [number, number]): (number) => number => {
  return (x: number): number => {
    let inputLow, inputHigh: number;
    [inputLow, inputHigh] = inputRange;
    let outputLow, outputHigh: number;
    [outputLow, outputHigh] = outputRange;
    // ensure that x is within input range
    if (x < inputLow) {
      x = inputLow;
    } else if (x > inputHigh) {
      x = inputHigh;
    }
    // map x onto output range 
    const xMappedToOutput: number = (x - inputLow) / (inputHigh - inputLow) * (outputHigh - outputLow) + outputLow;
    return Math.round(xMappedToOutput); 
  };
};


// map average grade range (50,100) onto percentile, and vice versa
const numberGradeRange = [50,100];
const percentileRange = [1,99];
const gradePercentileToNumberGrade = createNumberRangeMapFunction([1, 99], [50,100]);
const numberGradeToPercentile = createNumberRangeMapFunction([50,100], [1,99]);

