let users = require('../mock_db/usersData');

module.exports.getUser = (userName, pass) => {
    let user = users.find( (user) => user.username === userName && user.password === pass);
    return user;
}