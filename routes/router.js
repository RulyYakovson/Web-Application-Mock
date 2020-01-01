let express = require('express');
let passport = require('passport');
let router = express.Router();
let repository_helper = require('../repositories/repository_helper');
const rsa = require('../rsa/node-rsa');
let timeout = 1000;

router.put('/init_db', async (req, res) => {
    console.log('Received init db request');
    await setTimeout(async () => {
        await repository_helper.initDB();
        res.status(200).send('OK');
    }, timeout);
});

router.get('/', async (req, res) => {
    console.log('Received get index page request');
    res.status(200);
    await setTimeout(() => {
        res.render('index', { userRole: req.session && req.session.role });
    }, timeout);
});

router.post('/login', passport.authenticate('local'), async (req, res) => {
    const user = req.user;
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;
    console.log(`Session for User: '${user.username}', Role: '${user.role}' added successfully`);
    res.status(200).send('OK');
});

router.get('/logout', async (req, res) => {
    const user = req.session.username;
    console.log(`Received logout request for user: ${user}`);
    req.session.regenerate(() => {
        console.log(`User ${user} logged out`);
        res.redirect('/');
    });
});

module.exports = router;
