let express = require('express');
let router = express.Router();
var path = require('path');
var fs = require("fs");
var multer  = require('multer');
let helper = require('./helper');
let timeout = 1500;

var uploadImgHandler = multer({ storage: multer.diskStorage
    ({
        destination: function (req, file, callback) {
            callback(null, './public/images');
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    })
}).single('flower-img');

router.get('/all', async (req, res) => {
    console.log('Received get flowers request');
    let user = await helper.getUser(req.query.username, req.query.password);
    await setTimeout(async () => {
        data = {};
        if (user) {
            data.userRole = user && user.role;
            let result = await helper.getAllFlowers();
            console.log(`Fetch flowers result: ${result.data}`);
            if (result.success) {
                data.flowers = result && result.data;
                res.status(200);
            } else {
                console.log('An error occured while trying to fetch flowers');
                res.status(400);
            }
        } else {
            res.status(401);
        }
        res.json(data);
    }, timeout);
});

router.delete('/remove/:id', async (req, res) => {
    console.log(`Received remove flower request for ID: ${req.params.id}`);
    data = {};
    try {
        let user = await helper.getUser(req.query.username, req.query.password);
        if (user) {
            await helper.removeFlower(req.params.id);
            data.userRole = user && user.role;
            let result = await helper.getAllFlowers();
            console.log(`Fetch flowers result: ${result.data}`);
            if (result.success) {
                data.flowers = result && result.data;
                res.status(200);
            } else {
                console.log('An error occured while trying to fetch flowers');
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

router.post('/add', uploadImgHandler, async (req, res) => {
    console.log(`Received add flower request,
        Name: ${req.body.name},
        Description: ${req.body.description},
        Price: ${req.body.price},
        Source: ${req.file.originalname}.`
    );

    let fileContent = fs.readFileSync(req.file.path);
    let encodeFile = fileContent.toString('base64');
    let src = {
        contentType: req.file.mimetype,
        data :new Buffer(encodeFile, 'base64')
    };

    let flower = {
        name: req.body.name,
        price: req.body.price,
        src: src,
        description: req.body.description
    };

    try {
        await helper.addFlower(flower);
        res.status(200).send('OK');
    } catch(err) { // TODO: send the error message and show it to the user...
        console.log(err.message)
        res.status(500).send('ERROR');
    }
});
    //helper.addFlower({name: req.body.name, description: req.body.description, price: req.body.price});
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any

module.exports = router;
