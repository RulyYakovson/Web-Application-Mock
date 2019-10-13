var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var router = require('./routes/router');
var session = require('express-session')
var sess = { secret: 'keyboard cat', user: {} }
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon("public/images/flower-bouquet.png"));
app.use(session(sess))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/', router);

app.listen(8080, function () {
  console.log('App listening on http://localhost:8080')
});