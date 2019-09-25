var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var router = require('./routes/router');
// var aboutRouter = require('./routes/about');
// var contactRouter = require('./routes/contact_us');
// var signUpRouter = require('./routes/log_in');
// var customersRouter = require('./routes/customers');
//var db = require('db'); // TODO:
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon("public/images/flower-bouquet.png"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);
// app.use('/contact', contactRouter);
// app.use('/about', aboutRouter);
// app.use('/log_in',signUpRouter);
// app.use('/customers',customersRouter);

app.listen(8080, function () {
  console.log('App listening on http://localhost:8080')
});