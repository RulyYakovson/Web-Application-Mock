let users = require('../mock_db/usersData');

module.exports.getUser = (userName, pass) => {
    let user = users.find( (user) => user.username === userName && user.password === pass);
    return user;
}

module.exports.getAllEmployees = () => {
    return users.filter( (user) => user.role !== 'customer');
}

module.exports.removeEmployee = (id) => {
    users = users.filter( (user) => user.id !== id );
    console.log(users);
}

module.exports.addEmployee = (emp) => {
    let userAddesSuccessfully = false;
    if (!users.find( (user) => user.id === emp.id || user.username === emp.username)) {
        users.push(emp);
        userAddesSuccessfully = true;
    }
    console.log(users);
    return userAddesSuccessfully;
}