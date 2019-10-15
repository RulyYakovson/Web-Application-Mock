let users = require('../mock_db/usersData');
let flowers = require('../mock_db/flowers');

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
    let userAddedSuccessfully = false;
    if (!users.find( (user) => user.id === emp.id || user.username === emp.username)) {
        users.push(emp);
        userAddedSuccessfully = true;
    }
    console.log(users);
    return userAddedSuccessfully;
}

module.exports.updateEmployee = (emp) => {
    let userUpdatedSuccessfully = false;
    let user = users.find( (user) =>  user.id == emp.id ); // Important - Do not change to '===' since emp.id is a number
    console.log(user);
    if (user) {
        user.role = emp.role;
        user.branch = emp.branch;
        user.gender = emp.gender;
        userUpdatedSuccessfully = true;
    }
    console.log(users);
    return userUpdatedSuccessfully;
}

module.exports.getAllCustomers = () => {
    return users.filter( (user) => user.role === 'customer');
}

module.exports.removeCustomer = (id) => {
    users = users.filter( (user) => user.id !== id );
    console.log(users);
}

module.exports.addCustomer = (customer) => {
    let userAddesSuccessfully = false;
    if (!users.find( (user) => user.id === customer.id || user.username === customer.username)) {
        users.push(customer);
        userAddesSuccessfully = true;
    }
    console.log(users);
    return userAddesSuccessfully;
}

module.exports.updateCustomer = (customer) => {
    let userUpdatedSuccessfully = false;
    let user = users.find( (user) =>  user.id == customer.id ); // Important - Do not change to '===' since customer.id is a number
    console.log(user);
    if (user) {
        user.phone = customer.phone;
        user.address = customer.address;
        user.gender = customer.gender;
        userUpdatedSuccessfully = true;
    }
    console.log(users);
    return userUpdatedSuccessfully;
}

module.exports.getAllFlowers = () => {
    return flowers;
}