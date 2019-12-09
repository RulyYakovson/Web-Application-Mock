let express = require('express');
let router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'images/' })
let helper = require('../public/helper');
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

router.get('/flowers', async (req, res) => {
    console.log('Received get flowers request');
    let flowers = helper.getAllFlowers();
    let user = await helper.getUser(req.query.username, req.query.password);
    await setTimeout( () => {
        data = {};
        if (user) {
            data.flowers = flowers;
            res.status(200);
            res.json(data);
        } else {
            res.status(401);
            data.message = 'not authorized';
            data.status = 401;
            res.json(data);
        }
    }, timeout);
});

router.post('/add/flower', upload.single('flower-img'), function (req, res, next) {
    helper.addFlower({name: req.body.name, description: req.body.description, price: req.body.price});
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
});

router.get('/branches', async (req, res) => {
    console.log('Received get branches request');
    let user = await helper.getUser(req.query.username, req.query.password);
    await setTimeout(async () => {
        data = {};
        if (user) {
            data.userRole = user && user.role;
            let result = await helper.getAllBranches();
            console.log(`Fetch branches result: ${result.data}`);
            if (result.success) {
                data.branches = result && result.data;
                res.status(200);
            } else {
                console.log('An error occured while trying to fetch branches');
                res.status(400);
            }
        } else {
            res.status(401);
        }
        res.json(data);
    }, timeout);
});

router.get('/contact', async (req, res) => {
    console.log('Received get contact page request');
    res.status(200);
    await setTimeout( () => {
        res.render('mains/contact');
    }, timeout);
});

router.get('/all/employees', async (req, res) => {
    console.log('Received get all employees request');
    let user = await helper.getUser(req.query.username, req.query.password);
    await setTimeout(async () => {
        data = {};
        if (user) {
            data.userRole = user && user.role;
            let result = await helper.getAllEmployees();
            console.log(`Fetch employees result: ${result.data}`);
            if (result.success) {
                data.employees = result && result.data;
                res.status(200);
            } else {
                console.log('An error occured while trying to fetch employees');
                res.status(400);
            }
        } else {
            res.status(401);
        }
        res.json(data);
    }, timeout);
});

router.delete('/remove/employee/:id', async (req, res, next) => {
    console.log(`Received remove employee request for ID: ${req.params.id}`);
    data = {};
    try {
        await helper.removeEmployee(req.params.id);
        let user = await helper.getUser(req.query.username, req.query.password);
        if (user) {
            data.userRole = user && user.role;
            let result = await helper.getAllEmployees();
            console.log(`Fetch employees result: ${result.data}`);
            if (result.success) {
                data.employees = result && result.data;
                res.status(200);
            } else {
                console.log('An error occured while trying to fetch employees');
                res.status(400);
            }
        } else {
            res.status(401);
        }
    } catch(err) {
        res.status(500);
        console.log(`Failed to delete employee with ID: ${req.params.id}`);
    }
    res.json(data);
});

router.post('/add/emp', async (req, res) => {
    try {
        await helper.addEmployee(req.body);
        res.status(200).send('OK');
    } catch(err) { // TODO: send the error message and show it to the user...
        console.log(err.message)
        res.status(500).send('ERROR');
    }
});

router.post('/update/emp', async (req, res) => {
    try {
        await helper.updateEmployee(req.body);
        res.status(200).send('OK');
    } catch(err) {
        console.log(err.message)
        res.status(500).send('ERROR');
    }
});

router.get('/all/customers', async (req, res) => {
    console.log('Received get all customers request');
    let user = await helper.getUser(req.query.username, req.query.password);
    await setTimeout(async () => {
        data = {};
        if (user) {
            data.userRole = user && user.role;
            let result = await helper.getAllCustomers();
            console.log(`Fetch customers result: ${result.data}`);
            if (result.success) {
                data.customers = result && result.data;
                res.status(200);
            } else {
                console.log('An error occured while trying to fetch customers');
                res.status(400);
            }
        } else {
            res.status(401);
        }
        res.json(data);
    }, timeout);
});

router.delete('/remove/customer/:id', async (req, res, next) => {
    console.log(`Received remove customer request for ID: ${req.params.id}`);
    data = {};
    try {
        await helper.removeCustomer(req.params.id);
        let user = await helper.getUser(req.query.username, req.query.password);
        if (user) {
            data.userRole = user && user.role;
            let result = await helper.getAllCustomers();
            console.log(`Fetch customers result: ${result.data}`);
            if (result.success) {
                data.customers = result && result.data;
                res.status(200);
            } else {
                console.log('An error occured while trying to fetch customers');
                res.status(400);
            }
        } else {
            res.status(401);
        }
    } catch(err) {
        res.status(500);
        console.log(`Failed to delete user with ID: ${req.params.id}`);
    }
    res.json(data);
});

router.post('/add/customer', async (req, res) => {
    try {
        await helper.addCustomer(req.body);
        res.status(200).send('OK');
    } catch(err) { // TODO: send the error message and show it to the user...
        console.log(err.message)
        res.status(500).send('ERROR');
    }
});

router.post('/update/customer', async (req, res) => {
    try {
        await helper.updateCustomer(req.body);
        res.status(200).send('OK');
    } catch(err) {
        console.log(err.message)
        res.status(500).send('ERROR');
    }
});

router.post('/login/:username/:password', async (req, res, next) => {
    console.log(`Received login request for user: ${req.params.username}`);
    let user = await helper.getUser(req.params.username, req.params.password);
    user && console.log(`router.js:login:: User: Name: ${user.username}, Role: ${user.role}`);
    user && res.status(200).send('OK');
    !user && res.status(401).send('ERROR');
});

module.exports = router;
