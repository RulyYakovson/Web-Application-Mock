let express = require('express');
let router = express.Router();
var fs = require("fs");
var multer  = require('multer');
const download = require('image-downloader')
let repository = require('../repositories/flower_repository');
let auth = require('./auth_user');
let path = './public/images';
let timeout = 1500;

var uploadImgHandler = multer({ storage: multer.diskStorage
    ({
        destination: function (req, file, callback) {
            callback(null, path);
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    })
}).single('flower-img');

router.get('/all', auth.authUser, async (req, res) => {
    console.log('Received get flowers request');
    await setTimeout(async () => {
        data = {};
        data.userRole = req.userRole;
        let result = await repository.getAllFlowers();
        console.log(`Fetch flowers result: ${result.data}`);
        if (result.success) {
            data.flowers = result && result.data;
            res.status(200);
        } else {
            console.log('An error occured while trying to fetch flowers');
            res.status(400);
        }
        res.json(data);
    }, timeout);
});

router.delete('/remove/:name', auth.authEmployee, async (req, res) => {
    console.log(`Received remove flower request for: ${req.params.name}`);
    data = {};
    try {
        await repository.removeFlower(req.params.name);
        data.userRole = req.userRole;
        let result = await repository.getAllFlowers();
        console.log(`Fetch flowers result: ${result.data}`);
        if (result.success) {
            data.flowers = result && result.data;
            res.status(200);
        } else {
            console.log('An error occured while trying to fetch flowers');
            res.status(400);
        }
    } catch(err) {
        res.status(500);
        console.log(`Failed to delete flower: ${req.params.name}`);
    }
    res.json(data);
});

router.post('/add', uploadImgHandler, async (req, res) => {
    try {
        let body = req.body;
        let url = body.url;
        let file = req.file;

        console.log(`Received add flower request,
            Name: ${body.name},
            Description: ${body.description},
            Price: ${body.price},
            Source: ${file ? file.originalname : url}.`
        );

        let imageTempPath = file && file.path;

        // If no file has been uploaded - try downloading from URL.
        !file && (imageTempPath = await downloadImage({ url: url, dest: path }));

        let mimetype = file ? file.mimetype : 'image/jpeg';
        try {
            await saveImage(imageTempPath, body, mimetype);
            res.status(200).send('OK');
        } catch(e) {
            console.log('ERROR: ' + e.message);
            res.status(500).send('ERROR');
        } finally {
            // Remove image from images folder
            fs.unlinkSync(imageTempPath);
        }

    } catch(err) { // TODO: send the error message and show it to the user...
        console.log(err.message)
        res.status(500).send(err.message);
    }
});

const downloadImage = async (options) => {
    try {
      const { filename, image } = await download.image(options);
      console.log(`Downloading image: ${filename} finish nsuccessfully.`);
      return filename;
    } catch (e) {
      console.error(e);
    }
};

const saveImage = async (tempPath, details, mimetype) => {
    let fileContent = fs.readFileSync(tempPath);
    let encodeFile = fileContent.toString('base64');
    let src = {
        contentType: mimetype,
        data :new Buffer(encodeFile, 'base64')
    };

    let flower = {
        name: details.name,
        price: details.price,
        src: src,
        description: details.description
    };

    await repository.addFlower(flower);
};

module.exports = router;