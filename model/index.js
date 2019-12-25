const debug = require("debug")("mongo:model");
const mongo = require('mongoose');
let customer = require('./customer');
let employee = require('./employee');
let branch = require('./branch');
let flower = require('./flower');

let db = mongo.createConnection();
const uri = 'mongodb://localhost/flower-shop-web-demo';
const connectionOptions = { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true };

(async () => {
    try {
        await db.openUri(uri, connectionOptions);
    } catch (err) {
        debug(`Error while trying connecting to mongo DB: ${err}`);
    }
})();

debug('Pending to DB connection');

customer(db);
employee(db);
branch(db);
flower(db);

module.exports = model => db.model(model);