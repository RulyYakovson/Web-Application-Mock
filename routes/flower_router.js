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

const handleError = (err, res) => {
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Something went wrong!");
};

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

router.post('/add', uploadImgHandler, async (req, res) => {
    console.log(`Received add flower request,
        Name: ${req.body.name},
        Description: ${req.body.description},
        Price: ${req.body.price},
        Source: ${req.file.originalname}.`
    );

    let img = fs.readFileSync(req.file.path);
    let encode_image = img.toString('base64');
    src = {
        contentType: req.file.mimetype,
        data :new Buffer(encode_image, 'base64')
    }

    let flower = {
        name: req.body.name,
        price: req.body.price,
        src: src,
        description: req.body.description
    }

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
