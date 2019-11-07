let express = require('express');
let router = express.Router();
let helper = require('../public/helper');
let timeout = 1500;

router.get('/', async (req, res, next) => {
    console.log('Received get index page request');
    user = helper.getUser(req.query.username, req.query.password);
    user && console.log(`router.js:: User: Name: ${user.username}, Role: ${user.role}`);
    res.status(200);
    await setTimeout(function () {
        res.render('index', {userRole: user && user.role});
    }, timeout);
});

router.get('/home', async (req, res, next) => {
    console.log('Received get home page request');
    user = helper.getUser(req.query.username, req.query.password);
    user && console.log(`router.js:home::: User: Name: ${user.username}, Role: ${user.role}`);
    res.status(200);
    await setTimeout(function () {
        res.render('mains/home');
    }, timeout);
});

router.get('/about', async (req, res, next) => {
    console.log('Received get about page request');
    res.status(200);
    await setTimeout(function () {
        res.render('mains/about');
    }, timeout);
});

router.get('/flowers', async (req, res) => {
    console.log('Received get flowers request');
    let flowers = helper.getAllFlowers();
    user = helper.getUser(req.query.username, req.query.password);
    await setTimeout(function () {
        data = {};
        if (user) {
            data.flowers = flowers;
            res.status(200);
            res.json(data);
        } else {
            res.status(401);
            data.status = 401;
            res.json(data);
        }
    }, timeout);
});

router.get('/branches', async (req, res) => {
    console.log('Received get branches request');
    let branches = helper.getAllBranches();
    user = helper.getUser(req.query.username, req.query.password);
    res.status(200);
    await setTimeout(function () {
        data = {};
        if (user) {
            data.branches = branches;
            res.status(200);
            res.json(data);
        } else {
            res.status(401);
            data.status = 401;
            res.json(data);
        }
    }, timeout);
});

router.get('/contact', async (req, res) => {
    console.log('Received get contact page request');
    res.status(200);
    await setTimeout(function () {
        res.render('mains/contact');
    }, timeout);
});

router.get('/all/employees', async (req, res) => {
    console.log('Received get all employees request');
    let employees = helper.getAllEmployees();
    user = helper.getUser(req.query.username, req.query.password);
    res.status(200);
    await setTimeout(function () {
        res.render('mains/employees', {employees: employees, userRole: user && user.role});
    }, timeout);
});

router.delete('/remove/employee/:id', (req, res, next) => {
    console.log(`Received remove employee request for ID: ${req.params.id}`);
    helper.removeEmployee(req.params.id);
    let employees = helper.getAllEmployees();
    user = helper.getUser(req.query.username, req.query.password);
    res.status(200);
    res.render('mains/employees', {employees: employees, userRole: user && user.role});
});

router.post('/add/emp', (req, res) => {
    let sucsses = helper.addEmployee(req.body);
    sucsses && res.status(200).send('OK');
    res.status(500).send('ERROR');
});

router.post('/update/emp', (req, res) => {
    let sucsses = helper.updateEmployee(req.body);
    sucsses && res.status(200).send('OK');
    res.status(500).send('ERROR');
});

router.get('/all/customers', async (req, res) => {
    console.log('Received get all customers request');
    let customers = helper.getAllCustomers();
    user = helper.getUser(req.query.username, req.query.password);
    res.status(200);
    await setTimeout(function () {
        res.render('mains/customers', {customers: customers, userRole: user && user.role});
    }, timeout);
});

router.delete('/remove/customer/:id', (req, res, next) => {
    console.log(`Received remove customer request for ID: ${req.params.id}`);
    helper.removeCustomer(req.params.id);
    let customers = helper.getAllCustomers();
    user = helper.getUser(req.query.username, req.query.password);
    res.status(200);
    res.render('mains/customers', {customers: customers, userRole: user && user.role});
});

router.post('/add/customer', (req, res) => {
    let sucsses = helper.addCustomer(req.body);
    sucsses && res.status(200).send('OK');
    res.status(500).send('ERROR');
});

router.post('/update/customer', (req, res) => {
    let sucsses = helper.updateCustomer(req.body);
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
