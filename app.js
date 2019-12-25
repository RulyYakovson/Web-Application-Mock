let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser')
let logger = require('morgan');
let favicon = require('serve-favicon');
let router = require('./routes/router');
let branchRouter = require('./routes/branch_router');
let customerRouter = require('./routes/customer_router');
let employeeRouter = require('./routes/employee_router');
let flowerRouter = require('./routes/flower_router');
let session = require('express-session');
let mongo = require('mongoose');
let connectMongo = require('connect-mongo');
let MongoStore = connectMongo(session);
let secret = 'web application mock secret';
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon("public/images/flower-bouquet.png"));

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser(secret));
app.use(bodyParser.json())
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

app.use('/', router);
app.use('/customer', customerRouter);
app.use('/employee', employeeRouter);
app.use('/branch', branchRouter);
app.use('/flower', flowerRouter);

module.exports = app;
