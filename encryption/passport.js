const employeeRepository = require('../model')('Employee');
const customerRepository = require('../model')('Customer');
const { isEmpUser } = require('../repositories/repository_helper');
const LocalStrategy = require('passport-local').Strategy;
const { decrypt } = require('./node-rsa');

const strategy = new LocalStrategy(async (username, password, done) => {
    console.log(`Received login request for user: ${username}`);
    let repository = customerRepository;
    if (await isEmpUser(username)) {
        console.log(`User: '${username}' is an employee`);
        repository = employeeRepository;
    }
    repository.findOne({ username: username }, async (err, user) => {
        if (err) {
            console.error(err);
            return done(err);
        }
        if (!user) {
            console.log(`ERROR: User '${username}' not found`);
            return done(null, false);
        }
        const decryptedPass = decrypt(password);
        console.log(`Decrypted password: '${decryptedPass}'`)

        const authentication = await user.authenticate(decryptedPass);
        if (!authentication.user || !!authentication.error) {
            console.log(`ERROR: ${authentication.error.message}`);
            return done(null, false);
        }

        console.log(`User: '${authentication.user.username}' logged in successfully !!`);
        return done(null, user);
    });
});

module.exports = strategy;
