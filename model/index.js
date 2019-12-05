const debug = require("debug")("mongo:model");
const mongo = require('mongoose');
let customer = require('./customer');
let employee = require('./employee');

let db = mongo.createConnection();
(async () => {
    try {
        await db.openUri('mongodb://localhost/flower-shop-web-demo', { useFindAndModify: false });
    } catch (err) {
        debug(`Error while trying connecting to mongo DB: ${err}`);
    }
})();
debug('Pending to DB connection');

customer(db);
employee(db);

module.exports = model => db.model(model);