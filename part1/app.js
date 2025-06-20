var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const db = require('./db'); // load pooled db connection

// Built in routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// API routes
const dogsRoute = require('./routes/api/dogs');
const walkRequestsRoute = require('./routes/api/walkrequests');
const walkersRoute = require('./routes/api/walkers');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mount existing basic routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// API routes with shared db
app.use('/api/dogs', dogsRoute(db));
app.use('/api/walkrequests', walkRequestsRoute(db));
app.use('/api/walkers', walkersRoute(db));

module.exports = app;
