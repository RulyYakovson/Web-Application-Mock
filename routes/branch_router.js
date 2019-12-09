let express = require('express');
let router = express.Router();
let helper = require('./helper');
let timeout = 1500;

router.get('/all', async (req, res) => {
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

module.exports = router;
