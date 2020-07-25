var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/indexRouter');
var forecastRouter = require('./routes/forecastRouter');
var aboutRouter = require('./routes/aboutRouter');

var path = require('path');
global.appRoot = path.resolve(__dirname);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/forecast', forecastRouter);
app.use('/about', aboutRouter);

module.exports = app;
