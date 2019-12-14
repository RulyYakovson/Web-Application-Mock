let express = require('express');
let router = express.Router();
let repository = require('../repositories/customers_repository');
let auth = require('./auth_user');
let timeout = 1500;

router.get('/all', auth.authEmployee, async (req, res) => {
    console.log('Received get all customers request');
    await setTimeout(async () => {
        data = {};
        data.userRole = req.userRole;
        let result = await repository.getAllCustomers();
        console.log(`Fetch customers result: ${result.data}`);
        if (result.success) {
            data.customers = result && result.data;
            res.status(200);
        } else {
            console.log('An error occured while trying to fetch customers');
            res.status(400);
        }
        res.json(data);
    }, timeout);
});

router.delete('/remove/:id', auth.authEmployee, async (req, res) => {
    console.log(`Received remove customer request for ID: ${req.params.id}`);
    data = {};
    try {
        await repository.removeCustomer(req.params.id);
        data.userRole = req.userRole;
        let result = await repository.getAllCustomers();
        console.log(`Fetch customers result: ${result.data}`);
        if (result.success) {
            data.customers = result && result.data;
            res.status(200);
        } else {
            console.log('An error occured while trying to fetch customers');
            res.status(400);
        }
    } catch(err) {
        res.status(500);
        console.log(`Failed to delete user with ID: ${req.params.id}`);
    }
    res.json(data);
});

router.post('/add', auth.authEmployee, async (req, res) => {
    try {
        await repository.addCustomer(req.body);
        res.status(200).send('OK');
    } catch(err) { // TODO: send the error message and show it to the user...
        console.log(err.message)
        res.status(500).send('ERROR');
    }
});

router.post('/update', auth.authEmployee, async (req, res) => {
    try {
        await repository.updateCustomer(req.body);
        res.status(200).send('OK');
    } catch(err) {
        console.log(err.message)
        res.status(500).send('ERROR');
    }
});

module.exports = router;
