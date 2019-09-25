let express = require('express');
let router = express.Router();
let helper = require('../public/helper');

router.get('/', function(req, res, next) {
    console.log('Received get index page request');
//   let user = req.query.user;
//   let pass = req.query.pass;
//   if (auth.authUser(user,pass)){
//     console.log("user login");
    
//    res.render('index', {page:'Home', menuId:'home',user:user});
//     return;
//   }
    res.status(200);
    res.render('index', {pageName:'Home', pageId:'home'});
});

router.get('/home', function(req, res, next) {
    console.log('Received get home page request');
    res.status(200);
    res.render('mains/home', {pageName:'Home', pageId:'home'});
});

router.get('/about', function(req, res, next) {
    console.log('Received get about page request');
    res.status(200);
    res.render('mains/about', {pageName:'About', pageId:'about'});
});

router.get('/contact', (req, res) => {
    console.log('Received get contact page request');
    res.status(200);
    res.render('mains/contact', {pageName:'Contact', pageId:'contact'});
});

router.post('/login', function(req, res, next) {
    console.log('Received login request');
    console.log(req.body);
    let success = login(req.body.username, req.body.password);
    res.status(200);
    if (success) {
        res.send("SUCCESS");
    } else {
        res.send('FAILED');
    }
});

const login = (userName, password) => {
    let userRole = helper.getUserRole(userName, password);
    console.log(`user name: ${userName}, passward: ${password}, Role: ${userRole}`);
    if (userRole) {

        // TODO: insert user to URL...

        // location = `/?username=${userName}&password=${password}&role=${userRole}`;
        // console.log(location);
        return true;
    }
    return false;
}

module.exports = router;
