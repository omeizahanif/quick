const express = require('express');
const studentRouter = express.Router();
const debug = require('debug')('app:studentRoutes');
const methodOverride = require('method-override');
const Student = require('../models/studentModel');
const Course = require('../models/courseModel');
const Result = require('../models/resultModel');
const bodyParser = require('body-parser');


studentRouter.route('/').post((req, res) => {
    (async function fetchData() {
        try{
            let studentData = await Student.findOne({matric: req.body.matric}, (err, students) => {
                err ? console.log(err) : students;
            });

            let resultData = await Result.findOne({matric : req.body.matric}, (err, results) => {
                err ? console.log(err) : results;
            });

            let courseData = await Course.find({}, (err, courses) => {
                err ? console.log(err) : courses;
            })
            
            //res.send('it works');
            res.render('studentMain', {profile: studentData, results: resultData, courses: courseData});
        } catch(err) {
            console.log(err);
        }
        
    })()
    
});




module.exports = studentRouter;