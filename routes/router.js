let express = require('express');
let router = express.Router();
let repository_helper = require('../repositories/repository_helper');
let timeout = 1500;

router.put('/init_db', async (req, res) => {
    console.log('Received init db request');
    await setTimeout(async () => {
        await repository_helper.initDB();
        res.status(200).send('OK');
    }, timeout);
});

router.get('/', async (req, res) => {
    console.log('Received get index page request');
    let user = await repository_helper.getUser(req.query.username, req.query.password);
    user && console.log(`router.js:: User: Name: ${user.username}, Role: ${user.role}`);
    res.status(200);
    await setTimeout( () => {
        res.render('index', {userRole: user && user.role});
    }, timeout);
});

router.get('/home', async (req, res) => {
    console.log('Received get home page request');
    let user = await repository_helper.getUser(req.query.username, req.query.password);
    user && console.log(`router.js:home::: User: Name: ${user.username}, Role: ${user.role}`);
    res.status(200);
    await setTimeout( () => {
        res.render('mains/home');
    }, timeout);
});

router.get('/about', async (req, res) => {
    console.log('Received get about page request');
    res.status(200);
    await setTimeout( () => {
        res.render('mains/about');
    }, timeout);
});

router.get('/contact', async (req, res) => {
    console.log('Received get contact page request');
    res.status(200);
    await setTimeout( () => {
        res.render('mains/contact');
    }, timeout);
});

router.post('/login/:username/:password', async (req, res) => {
    console.log(`Received login request for user: ${req.params.username}`);
    let user = await repository_helper.getUser(req.params.username, req.params.password);
    user && console.log(`router.js:login:: User: Name: ${user.username}, Role: ${user.role}`);
    user && res.status(200).send('OK');
    !user && res.status(401).send('ERROR');
});

module.exports = router;
