const express = require('express');
const passport = require('passport');
const nodemailer = require('nodemailer');
const router = express.Router();
const repository_helper = require('../repositories/repository_helper');
const { getCustomer, setTempPass } = require('../repositories/customers_repository');
const expires = 10 * 60 * 1000; // min * sec * millis
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
            const tempPass = generatePass()
            resetPassword(user, tempPass, res);
            sendEmail(email, user.username, tempPass, res);
        } else if (user === null) {
            console.log(`User with email: '${email}' not found`);
            res.status(400).send('User not found');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('ERROR');
    }
});

const resetPassword = async (user, tempPass, res) => {
    user.tempPass = tempPass;
    user.expiresOn = Date.now() + expires;
    try {
        await setTempPass(user);
        return tempPass;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('ERROR');
    }
};

const sendEmail = (email, username, tempPass, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ruliweiss@gmail.com',
            pass: 'ruliweiss123'
        }
    });
    const mailOptions = {
        sender: "doNotReply@blabla", // ??????????
        to: email,
        subject: 'Password reset ✔',
        html: generateEmailHtml(username, tempPass)
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.error(err.message);
            res.status(500).send('ERROR');
        }
        else {
            console.log(info);
            res.status(200).send('OK');
        }
    });
};
const generatePass = () => Math.random().toString(36).substring(2);

const generateEmailHtml = (username, tempPass) =>
    `<h4 style="color: #500050;">Hello ${username},</h4>
        <h4 style="color: #500050;">Your password has been reset and is now: <label style="color: brown"> ${tempPass}</label>.<br>
        Note ! This password is for one-time use and it expires in 10 minutes.<br>
        As soon as you enter the site you will be asked to update your password again.</h4>
        <h4 style="color: #500050;">Regards,<br>
        The site team</h4>`

module.exports = router;
