const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const logger = require('morgan');
const favicon = require('serve-favicon');
const session = require('express-session');
const mongo = require('mongoose');
const passport = require('passport');
const connectMongo = require('connect-mongo');
const router = require('./routes/router');
const branchRouter = require('./routes/branch_router');
const customerRouter = require('./routes/customer_router');
const employeeRouter = require('./routes/employee_router');
const flowerRouter = require('./routes/flower_router');
const passportStrategy = require('./encryption/passport');
const employeeRepository = require('./model')('Employee');
const customerRepository = require('./model')('Customer');
const MongoStore = connectMongo(session);
const secret = 'web application mock secret';
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon("public/images/flower-bouquet.png"));

app.use(logger('dev'));
app.use(cookieParser(secret));
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const uri = 'mongodb://localhost/web-application-mock';
const sessionConnect = mongo.createConnection();
const connectionOptions = { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true };

(async () => {
    try {
        await sessionConnect.openUri(uri, connectionOptions);
    } catch (err) {
        debug(`Error while trying connecting to mongo DB: ${err}`);
    }
})();

app.use(
    session(
        {
            name: 'users.sid',
            secret: secret,
            resave: false,
            saveUninitialized: false,
            rolling: true,
            store: new MongoStore({ mongooseConnection: sessionConnect }),
            cookie: { maxAge: 900000, httpOnly: true, sameSite: true }
        }
    )
);

app.use(passport.initialize());
passport.serializeUser(employeeRepository.serializeUser());
passport.deserializeUser(employeeRepository.deserializeUser());
passport.serializeUser(customerRepository.serializeUser());
passport.deserializeUser(customerRepository.deserializeUser());
passport.use(passportStrategy);

app.use('/', router);
app.use('/customer', customerRouter);
app.use('/employee', employeeRouter);
app.use('/branch', branchRouter);
app.use('/flower', flowerRouter);

module.exports = app;
