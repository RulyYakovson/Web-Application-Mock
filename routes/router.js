let express = require('express');
let router = express.Router();
let helper = require('./helper');
let timeout = 1500;

router.put('/init_db', async (req, res, next) => {
    console.log('Received init db request');
    let user = await helper.getUser(req.query.username, req.query.password);
    user && console.log(`router.js:home::: User: Name: ${user.username}, Role: ${user.role}`);
    res.status(200);
    await setTimeout(async () => {
        await helper.initDB();
        res.status(200).send('OK');
    }, timeout);
});

router.get('/', async (req, res, next) => {
    console.log('Received get index page request');
    let user = await helper.getUser(req.query.username, req.query.password);
    user && console.log(`router.js:: User: Name: ${user.username}, Role: ${user.role}`);
    res.status(200);
    await setTimeout( () => {
        res.render('index', {userRole: user && user.role});
    }, timeout);
});

router.get('/home', async (req, res, next) => {
    console.log('Received get home page request');
    let user = await helper.getUser(req.query.username, req.query.password);
    user && console.log(`router.js:home::: User: Name: ${user.username}, Role: ${user.role}`);
    res.status(200);
    await setTimeout( () => {
        res.render('mains/home');
    }, timeout);
});

router.get('/about', async (req, res, next) => {
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

router.post('/login/:username/:password', async (req, res, next) => {
    console.log(`Received login request for user: ${req.params.username}`);
    let user = await helper.getUser(req.params.username, req.params.password);
    user && console.log(`router.js:login:: User: Name: ${user.username}, Role: ${user.role}`);
    user && res.status(200).send('OK');
    !user && res.status(401).send('ERROR');
});

module.exports = router;
