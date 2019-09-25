let users = require('../mock_db/usersData');

module.exports.getUserRole = (userName, pass) => {
    let user = users.find( (user) => user.username === userName && user.password === pass);
    console.log('user: ' + user);
    let role = user ?  user.role : null;
    return  role;
}