const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const logger = require('morgan');
const favicon = require('serve-favicon');
const router = require('./routes/router');
const branchRouter = require('./routes/branch_router');
const customerRouter = require('./routes/customer_router');
const employeeRouter = require('./routes/employee_router');
const flowerRouter = require('./routes/flower_router');
const session = require('express-session');
const mongo = require('mongoose');
const connectMongo = require('connect-mongo');
const MongoStore = connectMongo(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const secret = 'web application mock secret';
const rsa = require('./rsa/node-rsa');
const employeeRepository = require('./model')('Employee');
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

const uri = 'mongodb://localhost/flower-shop-web-demo';
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

passport.use(
    new LocalStrategy((username, password, done) => {
        console.log(`Received login request for user: ${username}`);
        employeeRepository.findOne({ username: username }, async (err, user) => {
            if (err) {
                console.log(err);
                return done(err);
            }
            if (!user) {
                console.log(`ERROR: User '${username}' not found`);
                return done(null, false);
            }
            const decryptedPass = rsa.decrypt(password);
            console.log(`Decrypted password: '${decryptedPass}'`)

            const authentication = await user.authenticate(decryptedPass);
            if (!authentication.user || !!authentication.error) {
                console.log(`ERROR: ${authentication.error.message}`);
                return done(null, false);
            }
            
            console.log(`User: '${authentication.user.username}' logged in successfully !!`);
            return done(null, user);
        });
    })
);

app.use('/', router);
app.use('/customer', customerRouter);
app.use('/employee', employeeRouter);
app.use('/branch', branchRouter);
app.use('/flower', flowerRouter);

module.exports = app;
