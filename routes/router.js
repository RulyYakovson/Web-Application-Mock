let express = require('express');
let router = express.Router();
let helper = require('../public/helper');

router.get('/', (req, res, next) => {
    console.log('Received get index page request');
    user = helper.getUser(req.query.username, req.query.password);
    user && console.log(`router.js:: User: Name: ${user.username}, Role: ${user.role}`);
    res.status(200);
    res.render('index', {pageName:'Home', pageId:'home', userRole: user && user.role});
});

router.get('/home', (req, res, next) => {
    console.log('Received get home page request');
    user = helper.getUser(req.query.username, req.query.password);
    user && console.log(`router.js:home::: User: Name: ${user.username}, Role: ${user.role}`);
    res.status(200);
    res.render('mains/home', {pageName:'Home', pageId:'home'});
});

router.get('/about', (req, res, next) => {
    console.log('Received get about page request');
    res.status(200);
    res.render('mains/about', {pageName:'About', pageId:'about'});
});

router.get('/contact', (req, res) => {
    console.log('Received get contact page request');
    res.status(200);
    res.render('mains/contact', {pageName:'Contact', pageId:'contact'});
});

router.get('/all/employees', (req, res) => {
    console.log('Received get all employees request');
    let employees = helper.getAllEmployees();
    res.status(200);
    res.render('mains/employees', {employees: employees, pageName:'Contact', pageId:'contact'});
});

router.delete('/remove/employee/:id', (req, res, next) => {
    console.log(`Received remove employee request for ID: ${req.params.id}`);
    helper.removeEmployee(req.params.id);
    let employees = helper.getAllEmployees();
    res.status(200);
    res.render('mains/employees', {employees: employees, pageName:'Contact', pageId:'contact'});
});

router.post('/add/emp', (req, res) => {
    let sucsses = helper.addEmployee(req.body);
    sucsses && res.status(200).send('OK');
    res.status(500).send('ERROR');
});

router.post('/login/:username/:password', (req, res, next) => {
    console.log(`Received login request for user: ${req.params.username}`);
    let user = helper.getUser(req.params.username, req.params.password);
    user && console.log(`router.js:login:: User: Name: ${user.username}, Role: ${user.role}`);
    user && res.status(200).send('OK');
    res.status(401).send('ERROR');
});

module.exports = router;
