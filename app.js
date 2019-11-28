
//store each dependencies in variables for use
const express = require('express'); //a web framework for routing
const morgan = require('morgan'); // a logger middleware
const debug = require('debug')('app'); // a debugging tool
const path = require('path'); // a routing tool for directories
const bodyParser = require('body-parser'); //a parsing tool for request data
const mongoose = require('mongoose'); //a Object Relational Modelling tool
const methodOverride = require('method-override'); //update & delete override tool
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local');
const Student = require('./public/src/models/studentModel');
const Course = require('./public/src/models/courseModel');
const User = require('./public/src/models/userModel');

const app = express();

const port = process.env.PORT || 80;
const adminRouter = require('./public/src/routes/adminRoutes');
const studentRouter = require('./public/src/routes/studentRoutes');
const authRouter = require('./public/src/routes/authRoutes');

//passport config
app.use(
  require('express-session')({
    secret: 'authentication is key',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//application settings
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('views', './public/src/pages');
app.set('view engine', 'ejs');

//main routes
app.use('/student', studentRouter);
app.use('/admin', adminRouter);
app.use('/', authRouter);

//server setup
const uri = `mongodb+srv://${process.env.DB_HOST}`;
const options = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};
mongoose.connect(uri, options).then(
  _ => {
    console.info('Database connection stablished');
    app.listen(port, function() {
      debug(`listening on port ${port}`);
    });
  },
  error => {
    console.error('Database connection failed:', error);
    throw new Error('Could not connect to the database');
  }
);

