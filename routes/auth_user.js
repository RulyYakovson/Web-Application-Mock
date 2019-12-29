let repository_helper = require('../repositories/repository_helper');

// module.exports.authUser = async (req, res, next) => {
//     let user = await repository_helper.getUser(req.query.username, req.query.password);
//     if (user) {
//         req.userRole = user.role;
//         next();
//     } else {
//         res.status(401);
//         res.json({status: 401});
//     }
// };

// module.exports.authEmployee = async (req, res, next) => {
//     let user = await repository_helper.getUser(req.query.username, req.query.password);
//     let role = user && user.role;
//     if (role === 'Admin' || role === 'Employee') {
//         req.userRole = user.role;
//         next();
//     }
//     else {
//         res.status(401);
//         res.json({status: 401});
//     }
// };

module.exports.authEmployee = (req, res, next) => {
    if (isSessionExist(req) && isEmp(req.session.role)) {
        req.userRole = req.session.role;
        next();
    }
    else {
        res.status(401);
        res.json({status: 401});
    }
};

module.exports.authUser = (req, res, next) => {
    if (isSessionExist(req)) {
        req.userRole = req.session.role;
        next();
    } else {
        res.status(401);
        res.json({status: 401});
    }
};

const isSessionExist = req =>
    (req.session && req.session.userId && req.session.role);

const isEmp = role =>
    (role === 'Admin' || role === 'Employee');