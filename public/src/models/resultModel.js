const mongoose = require('mongoose');


//create a course schema
let gradeSchema = new mongoose.Schema({
    grade: String,
    gradeScore: Number
});

let resultSchema = new mongoose.Schema({
    matric: String,
    gpa: Number,
    score: [
        {
            code: String,
            units: Number,
            tma1: Number,
            tma2: Number,
            tma3: Number,
            tma4: Number,
            exam: Number,
            numQuestions: Number,
            finalTest: Number,
            finalExam: Number,
            total: Number,
            finalGrade: Number
        }
    ]
});


let Result = mongoose.model('Result', resultSchema);


module.exports = Result;

