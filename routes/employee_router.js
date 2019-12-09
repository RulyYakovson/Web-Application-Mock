let express = require('express');
let router = express.Router();
let helper = require('./helper');
let timeout = 1500;

router.get('/all', async (req, res) => {
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

router.delete('/remove/:id', async (req, res, next) => {
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

router.post('/add', async (req, res) => {
    try {
        await helper.addEmployee(req.body);
        res.status(200).send('OK');
    } catch(err) { // TODO: send the error message and show it to the user...
        console.log(err.message)
        res.status(500).send('ERROR');
    }
});

router.post('/update', async (req, res) => {
    try {
        await helper.updateEmployee(req.body);
        res.status(200).send('OK');
    } catch(err) {
        console.log(err.message)
        res.status(500).send('ERROR');
    }
});

module.exports = router;
