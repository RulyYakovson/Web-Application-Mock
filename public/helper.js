let users = require('../mock_db/usersData');
let flowers = require('../mock_db/flowers');
let branches = require('../mock_db/branches');
let customerRepository = require('../model')('Customer');

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

module.exports.getAllCustomers = async () => {
   let success = false;
   let result = null;
   await customerRepository.find({}, (err, customers) => {
       if (!err) {
            result = customers;
            success = true;
        }
    });
    return { success: success, data: result };
};

module.exports.removeCustomer = async (id) => {
    let user = await customerRepository.findOneAndDelete({ id: id });
    !!user ? console.log(`User: ${user} \nsuccessfully deleted !!`)
    : console.log(`ERROR: User with ID: ${id} not found !!`);
}

module.exports.addCustomer = async (customer) => {
    let createdCustomer = await customerRepository.CREATE(customer);
    console.log(`A new customer created: ${createdCustomer}`);
}

module.exports.updateCustomer = async (customer) => {
    let user = null;
    let fieldsToUpdate = { phone: customer.phone, address: customer.address, gender: customer.gender };
    user = await customerRepository.findOneAndUpdate({ id: customer.id }, fieldsToUpdate, { new: true });

    !!user ? console.log(`User: ${user} \nsuccessfully updeted !!`)
    : console.log(`Error while trying to update user with ID: ${customer.id}`);
}

module.exports.getAllFlowers = () => {
    return flowers;
}

module.exports.getAllBranches = () => {
    return branches;
}