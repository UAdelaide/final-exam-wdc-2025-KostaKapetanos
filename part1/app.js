var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const dogsRoute = require('./routes/api/dogs');
const walkRequestsRoute = require('./routes/api/walkrequests');
const walkersRoute = require('./routes/api/walkers');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

let db;

(async () => {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });

    console.log('Connected to DogWalkService database');

    app.use('/api/dogs', dogsRoute(db));
    app.use('/api/walkrequests', walkRequestsRoute(db));
    app.use('/api/walkers', walkersRoute(db));

  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
})();

module.exports = app;
