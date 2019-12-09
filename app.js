var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var router = require('./routes/router');
var branchRouter = require('./routes/branch_router');
var customerRouter = require('./routes/customer_router');
var employeeRouter = require('./routes/employee_router');
var flowerRouter = require('./routes/flower_router');

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
app.use('/branch', branchRouter);
app.use('/customer', customerRouter);
app.use('/employee', employeeRouter);
app.use('/flower', flowerRouter);

app.listen(8080, () => {
  console.log('App listening on http://localhost:8080')
});
