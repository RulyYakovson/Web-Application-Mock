const express = require('express');
const repository = require('../repositories/employee_repository');
const auth = require('./auth_user');
const { decrypt } = require('../encryption/node-rsa');
const router = express.Router();
const timeout = 1000;

router.get('/all', auth.authEmployee, async (req, res) => {
    console.log('Received get all employees request');
    await setTimeout(async () => {
        data = {};
        data.userRole = req.userRole;
        let result = await repository.getAllEmployees();
        console.log(`Fetch employees result: ${result.data}`);
        if (result.success) {
            data.employees = result && result.data;
            res.status(200);
        } else {
            console.log('An error occured while trying to fetch employees');
            res.status(400);
        }
        res.json(data);
    }, timeout);
});

router.delete('/remove/:id', auth.authEmployee, async (req, res) => {
    console.log(`Received remove employee request for ID: ${req.params.id}`);
    data = {};
    try {
        await repository.removeEmployee(req.params.id);
        data.userRole = req.userRole;
        let result = await repository.getAllEmployees();
        console.log(`Fetch employees result: ${result.data}`);
        if (result.success) {
            data.employees = result && result.data;
            res.status(200);
        } else {
            console.log('An error occured while trying to fetch employees');
            res.status(400);
        }
    } catch (err) {
        res.status(500);
        console.log(`Failed to delete employee with ID: ${req.params.id}`);
    }
    res.json(data);
});

router.post('/add', auth.authEmployee, async (req, res) => {
    try {
        req.body.password = decrypt(req.body.password);
        await repository.addEmployee(req, res);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('ERROR');
    }
});

router.post('/update', auth.authEmployee, async (req, res) => {
    try {
        await repository.updateEmployee(req.body);
        res.status(200).send('OK');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('ERROR');
    }
});

router.post('/new_pass', async (req, res) => {
    try {
        console.log(`Received set new password for user: ${req.body.username}`);
        req.body.password = decrypt(req.body.password);
        await repository.setNewPassword(req, res);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('ERROR');
    }
});

router.post('/change_pass', auth.authEmployee, async (req, res) => {
    try {
        req.body.oldPassword = decrypt(req.body.oldPassword);
        req.body.newPassword = decrypt(req.body.newPassword);
        await repository.updatePassword(req, res);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('ERROR');
    }
});

module.exports = router;
