
//store each dependencies in variables for use
const express = require('express'); //a web framework for routing
const morgan = require('morgan');// a logger middleware
const debug = require('debug')('app');// a debugging tool
const path = require('path');// a routing tool for directories
const bodyParser = require('body-parser');//a parsing tool for request data
const mongoose = require('mongoose');//a Object Relational Modelling tool
const methodOverride = require('method-override');//update & delete override tool
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local')
const Student = require('./public/src/models/studentModel');
const Course = require('./public/src/models/courseModel');
const User = require('./public/src/models/userModel');

//mongoose.connect('mongodb://localhost/nouquick');
require('dotenv').config({path: path.join(__dirname, '.env')});
(function db () {
    try {
        mongoose.connect('mongodb://iyinoluwa:iyinoluwa1@ds037611.mlab.com:37611/nouquick', { useNewUrlParser: true } );
    } catch (error) {
        console.log("Error! : ", error);
    }
})();

const app = express();
const port = 3000;
const adminRouter = require('./public/src/routes/adminRoutes');
const studentRouter = require('./public/src/routes/studentRoutes');
const authRouter = require('./public/src/routes/authRoutes');

//passport config
app.use(require('express-session')({
    secret: "authentication is key",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//application settings
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('views', './public/src/pages');
app.set('view engine', 'ejs');


//main routes
app.use('/student', studentRouter);
app.use('/admin', adminRouter);
app.use('/', authRouter);



//server setup
app.listen(port, function () {
    debug(`listening on port ${port}`);
});


