const express = require('express');
const passport = require('passport');
const nodemailer = require('nodemailer');
const router = express.Router();
const repository_helper = require('../repositories/repository_helper');
const { getCustomer } = require('../repositories/customers_repository');
const timeout = 1000;

router.put('/init_db', async (req, res) => {
    console.log('Received init db request');
    await setTimeout(async () => {
        await repository_helper.initDB();
        res.status(200).send('OK');
    }, timeout);
});

router.get('/', async (req, res) => {
    console.log('Received get index page request');
    res.status(200);
    await setTimeout(() => {
        res.render('index', { userRole: req.session && req.session.role });
    }, timeout);
});

router.post('/login', passport.authenticate('local'), async (req, res) => {
    const user = req.user;
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;
    console.log(`Session for User: '${user.username}', Role: '${user.role}' added successfully`);
    res.status(200).send('OK');
});

router.get('/logout', async (req, res) => {
    const user = req.session.username;
    console.log(`Received logout request for user: ${user}`);
    req.session.regenerate(() => {
        console.log(`User ${user} logged out`);
        res.redirect('/');
    });
});

router.post('/reset_pass', async (req, res) => {
    const email = req.body.email;
    console.log(`Received reset password request for email: ${email}`);
    try {
        const user = await getCustomer(email);
        if (user) {
            resetPassword(user);
            sendEmail(email, res);
        } else if (user === null) {
            console.log(`User with email: '${email}' not found`);
            res.status(400).send('User not found');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('ERROR');
    }
});

const resetPassword = user => {

};

const sendEmail = (email, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ruliweiss@gmail.com',
            pass: 'ruliweiss123'
        }
    });
    const mailOptions = {
        sender: "doNotReply@bla",
        to: email,
        subject: 'Password reset ✔',
        html: '<h1 style="color: red;">נשלח אליך מהאתר שלנו, מגניב אה?</h1>'
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err){
            console.error(err.message);
            res.status(500).send('ERROR');
        }
        else {
            console.log(info);
            res.status(200).send('OK');
        }
    });
};

module.exports = router;
