const mongoose = require('mongoose');


//create a course schema
let gradeSchema = new mongoose.Schema({
    grade: String,
    gradeScore: Number
});

let resultSchema = new mongoose.Schema({
    matric: String,
    score: [
        {
            code: String,
            tma1: Number,
            tma2: Number,
            tma3: Number,
            tma4: Number,
            exam: Number,
            numQuestions: Number,
            finalTest: Number,
            finalExam: Number,
            total: Number,
            finalGrade: String
        }
    ]
});

/*resultSchema.methods.calcTest = function(tma1, tma2, tma3, tma4) {
    let minimum = Math.min(tma1, tma2, tma3, tma4);
    let tmaTotal = (tma1 + tma2 + tma3 + tma4) - minimum;
    return tmaTotal;
}

resultSchema.methods.calcExam = function(exam, numQuestions) {
    let examTotal = (exam * 70) / numQuestions;
    return examTotal;
}

resultSchema.methods.calcTotal = function(finalTest, finalExam) {
    let courseScore = finalTest + finalExam;
    return courseScore.toFixed(2);
}

resultSchema.methods.calcStudentGrade = function(total) {
    let grade = '', score = total, gradeScore = 0;
  
    if (score >= 70 && score <= 100) {
      grade = 'A'; gradeScore = 5;
    } else if (score >= 60 && score <= 69) {
      grade = 'B'; gradeScore = 4;
    } else if (score >= 50 && score <= 59) {
      grade = 'C'; gradeScore = 3;
    } else if (score >= 45 && score <= 49) {
      grade = 'D'; gradeScore = 2;
    } else if (score >= 40 && score <= 44) {
      grade = 'E'; gradeScore = 1;
    } else {
      grade = 'F'; gradeScore = 0;
    }
  
    return [grade, gradeScore];
  }*/

let Result = mongoose.model('Result', resultSchema);

/*Result.create({
    code: 'CIT802',
    score: [
        {
            matric: 'NOU192004133',
            status: 'C'
        }
    ]
},
    (err, result) => {
        err ? console.log(err) : console.log(result);
});
*/
module.exports = Result;

