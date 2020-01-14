const express = require('express');
const adminRouter = express.Router();
const debug = require('debug')('app:adminRoutes');
const methodOverride = require('method-override');
const Student = require('../models/studentModel');
const Course = require('../models/courseModel');
const Result = require('../models/resultModel');
const User = require('../models/userModel');
const session = require('express-session');


adminRouter.route('/').get(isLoggedIn, async (req, res) => {
        try{
            let studentData = await Student.find({});

            let resultData = await Result.find({});

            let courseData = await Course.find({});
    
            res.render('admin', {profiles: studentData, results: resultData, courses: courseData});
        } catch(err) {
            console.log(err);
        }

});

adminRouter.route('/new-course').get(isLoggedIn, (req, res) => {
    res.render('newCourse');
});

adminRouter.route('/new-course').post(isLoggedIn, async (req, res) => {
    let {department, semester, code, title, units} = req.body;
    let newCourse = {department, semester, code, title, units};
    try {
            let findCourse = await Course.findOne({department: department,
                semester: semester,
                code: code, title: title,
                units: units});

            if (findCourse == null) {
               const course = new Course(newCourse);
               course.save();
            } else {
                res.send('This course already exists');
            }

            res.redirect('/admin')

    } catch(e) {
        console.log(e);
    }
    /*Course.findOne({
        department: department,
        semester: semester,
        code: code, title: title,
        units: units},
         (err, found) => {
        if (found == null) {
            Course.create(newCourse, (err) => {
                err ? console.log(err) : res.redirect('/admin');
            })
        } else {
            res.send('this course already exists');
        }
    });*/
})

adminRouter.route('/new-student').get(isLoggedIn, (req, res) => {
    Course.find({}, (err, courseData) => {
        err ? console.log(err) : res.render('newStudent', { courses: courseData});
    });
});

adminRouter.route('/new-result').get(isLoggedIn, (req, res) => {
    Course.find({}, (err, courseData) => {
        err ? console.log(err) : res.render('newResult', { courses: courseData});
    });
});



adminRouter.route('/new-result').post(isLoggedIn, async (req, res) => {
    try {
        let {matric, score} = req.body;
        let test = calcTest(score.tma1, score.tma2, score.tma3, score.tma4);
        let exam = calcExam(Number(score.exam), Number(score.numQuestions));
        let total = test + exam;
        let grade = calcStudentGrade(total);
        let gpa = 0;
        score.finalTest = test;
        score.finalExam = exam;
        score.total = total;
        score.finalGrade = grade;

        let found = await Result.findOne({matric : matric});
        if (found) {     
            found.score.push({code: score.code,
                units: score.units,
                tma1: score.tma1,
                tma2: score.tma2,
                tma3: score.tma3,
                tma4: score.tma4,
                exam: score.exam,
                numQuestions: score.numQuestions,
                finalTest: score.finalTest,
                finalExam: score.finalExam,
                total: score.total,
                finalGrade: score.finalGrade
            });
                gpa = calcGPA(found.score);
                found.gpa = gpa;
                found.save();
            
        } else {
            const result = new Result({matric, score});
            result.save();
        }
            res.redirect('/admin');

    } catch(err) {
        console.log(err);
        res.send('Result was not captured. Try Again');
    }
    
    //console.log({matric, score});
    
});


adminRouter.route('/new-student').post(isLoggedIn, (req, res) => {
    let { firstName, lastName, matric, programme, department, courses } = req.body;
    let newStudent = { firstName, lastName, matric, programme, department, courses };
    Student.create(newStudent, (err, student) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/admin#students');
        }    
    });
});

adminRouter.route('/students/:id').get(isLoggedIn, async (req, res) => {
        try {
            
            let studentData = await Student.findById(req.params.id);

            let courseData = await Course.find({});

            res.render('profile', { profile: studentData, courses: courseData});

        } catch(err) {
            console.log(err);
        }

});

adminRouter.route('/results/:id').delete(isLoggedIn, async (req, res) => {
    try {
        let target;
        let found = await Result.findOne({ 'score._id' : req.params.id });
        target = await found.score.id(req.params.id);
        target.remove();
        let gpa = calcGPA(found.score);
        found.gpa = gpa;
        found.save();
        res.redirect('/admin');
    } catch(err) {
            console.log(err);
    }
        
});

adminRouter.route('/courses/:id').delete(isLoggedIn, (req, res) => {
    Course.findByIdAndDelete(req.params.id, err => {
        err ? console.log(err) : res.redirect('/admin');
    })
})



adminRouter.route('/students/:id/edit').get(isLoggedIn, (req, res) => {
    Student.findById(req.params.id, (err, data) => {
        err ? console.log(err) : studentData = data;
        Course.find({}, (err, courseData) => {
            err ? console.log(err) : res.render('editStudent', { profile: studentData, courses: courseData});
        });
    });
    
});

adminRouter.route('/students/:id').put(isLoggedIn, (req, res) => {
    Student.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err) => {
        err ? console.log(err) : res.redirect('/admin');
    });
});

adminRouter.route('/students/:id').delete(isLoggedIn, (req, res) => {
    Student.findByIdAndDelete(req.params.id, (err) => {
        err ? console.log(err) : res.redirect('/admin');
    })
})

//isLoggedIn middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
        res.redirect('/'); 
}

function calcTest(tma1, tma2, tma3, tma4) {
    tma1 = parseFloat(tma1); tma2 = parseFloat(tma2);
    tma3 = parseFloat(tma3); tma4 = parseFloat(tma4);
    let minimum = Math.min(tma1, tma2, tma3, tma4);
    let tmaTotal = (tma1 + tma2 + tma3 + tma4) - minimum;
    return tmaTotal;
}

function calcExam(exam, numQuestions) {  
    let examTotal = (exam * 70) / numQuestions;
    return parseFloat(examTotal.toFixed(2));
}


function calcStudentGrade(total) {
    let grade = '', score = total;
  
    if (score >= 70 && score <= 100) {
      grade = 5;
    } else if (score >= 60 && score <= 69) {
      grade = 4;
    } else if (score >= 50 && score <= 59) {
      grade = 3;
    } else if (score >= 45 && score <= 49) {
      grade = 2;
    } else if (score >= 40 && score <= 44) {
      grade = 1;
    } else {
      grade = 0;
    }
  
    return grade;
  }

function calcGPA(scoreArray) {
    let unitArray = [];
    let totalUnits = 0;
    let totalProduct = 0;

    let transitionArray = scoreArray.map(score => {
        let product = score.finalGrade * score.units;
        return product;
    });
    totalProduct = transitionArray.reduce((acc, curr) => acc + curr);
    unitArray = scoreArray.map(score => score.units);
    totalUnits = unitArray.reduce((acc, curr) => curr + acc);
    
    return (totalProduct / totalUnits).toFixed(2);
}
module.exports = adminRouter;