module.exports.authEmployee = (req, res, next) => {
    if (isSessionExist(req) && isEmp(req.session.role)) {
        console.log(`Authentication for employee: '${req.session.username}' finish successfully`);
        req.userRole = req.session.role;
        next();
    }
    else {
        console.log('Faild to authenticate employee !!!');
        res.status(401);
        res.json({ status: 401 });
    }
};

module.exports.authUser = (req, res, next) => {
    if (isSessionExist(req)) {
        console.log(`Authentication for user: '${req.session.username}' finish successfully`);
        req.userRole = req.session.role;
        next();
    } else {
        console.log('Faild to authenticate user !!!');
        res.status(401);
        res.json({ status: 401 });
    }
};

const isSessionExist = req =>
    (req.session && req.session.userId && req.session.role);

const isEmp = role =>
    (role === 'Admin' || role === 'Employee');