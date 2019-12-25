let express = require('express');
let router = express.Router();
let repository = require('../repositories/branches_repository');
let auth = require('./auth_user');
let timeout = 1000;

router.get('/all', auth.authUser, async (req, res) => {
    console.log('Received get branches request');
    await setTimeout(async () => {
        data = {};
        data.userRole = req.userRole;
        let result = await repository.getAllBranches();
        console.log(`Fetch branches result: ${result.data}`);
        if (result.success) {
            data.branches = result && result.data;
            res.status(200);
        } else {
            console.log('An error occured while trying to fetch branches');
            res.status(400);
        }
        res.json(data);
    }, timeout);
});

module.exports = router;
