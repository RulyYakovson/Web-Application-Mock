let express = require('express');
let router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'images/' })
let helper = require('./helper');
let timeout = 1500;

router.get('/all', async (req, res) => {
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

router.post('/add', upload.single('flower-img'), function (req, res, next) {
    helper.addFlower({name: req.body.name, description: req.body.description, price: req.body.price});
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
});

module.exports = router;
