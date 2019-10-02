let express = require('express');
let router = express.Router();
let helper = require('../public/helper');

router.get('/', function(req, res, next) {
    console.log('Received get index page request');
    user = helper.getUser(req.query.username, req.query.password);
    user && console.log(`router.js:: User: Name: ${user.username}, Role: ${user.role}`);
    res.status(200);
    res.render('index', {pageName:'Home', pageId:'home', userRole: user && user.role});
});

router.get('/home', function(req, res, next) {
    console.log('Received get home page request');
    user = helper.getUser(req.query.username, req.query.password);
    user && console.log(`router.js:home::: User: Name: ${user.username}, Role: ${user.role}`);
    res.status(200);
    res.render('mains/home', {pageName:'Home', pageId:'home'});
});

router.get('/about', function(req, res, next) {
    console.log('Received get about page request');
    res.status(200);
    res.render('mains/about', {pageName:'About', pageId:'about'});
});

router.get('/contact', (req, res) => {
    console.log('Received get contact page request');
    res.status(200);
    res.render('mains/contact', {pageName:'Contact', pageId:'contact'});
});

router.post('/login/:username/:password', function(req, res, next) {
    console.log(`Received login request for user: ${req.params.username}`);
    let user = helper.getUser(req.params.username, req.params.password);
    user && console.log(`router.js:login:: User: Name: ${user.username}, Role: ${user.role}`);
    res.status(200);
    user && res.send('OK');
    res.status(401).send('ERROR');
});

module.exports = router;
