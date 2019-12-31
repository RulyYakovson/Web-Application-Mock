let express = require('express');
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
    await setTimeout( () => {
        res.render('index', {userRole: req.session && req.session.role});
    }, timeout);
});

router.post('/login', async (req, res) => {
    const username = req.body.username;
    console.log(`Received login request for user: ${username}`);
    try {
        const decryptedPass = rsa.decrypt(req.body.password);
        console.log(`Decrypted password: '${decryptedPass}'`)
        let user = await repository_helper.getUser(username, decryptedPass);
        if (user) {
            console.log(`router.js:login:: User: Name: ${user.username}, Role: ${user.role}`);
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.role = user.role;
            res.status(200).send('OK')
        } else {
            res.status(401).send('ERROR');
        }
    } catch(err) {
        console.log(err.message);
    }
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
