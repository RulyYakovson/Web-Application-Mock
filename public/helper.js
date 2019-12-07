let users = require('../mock_db/usersData');
let flowers = require('../mock_db/flowers');
let branches = require('../mock_db/branches');
let customerRepository = require('../model')('Customer');
let employeeRepository = require('../model')('Employee');
let brancheRepository = require('../model')('Branch');

module.exports.getUser = async (userName, pass) => {
    let result = await customerRepository.findOne({ username: userName, password: pass });
    if (result) {
        console.log(`Customer: ${result} \nsuccessfully authenticated.`);
    } else {
        result = await employeeRepository.findOne({ username: userName, password: pass });
        if (result) {
            console.log(`Employee: ${result} \nsuccessfully authenticated.`);
        } else {
            console.log(`Cannot authenticate user: ${userName}.`);
        }
    }
    return result;
};

module.exports.getAllEmployees = async () => {
    let success = false;
    let result = null;
    await employeeRepository.find({}, (err, employees) => {
        console.log(err);
        if (!err) {
            result = employees;
            success = true;
         }
     });
     return { success: success, data: result };
};

module.exports.removeEmployee = async (id) => {
    let employee = await employeeRepository.findOneAndDelete({ id: id });
    !!employee ? console.log(`Employee: ${employee} \nsuccessfully deleted !!`)
    : console.log(`ERROR: Employee with ID: ${id} not found !!`);
};

module.exports.addEmployee = async (employee) => {
    let createdEmployee = await employeeRepository.CREATE(employee);
    console.log(`A new employee created: ${createdEmployee}`);
};

module.exports.updateEmployee = async (employee) => {
    let user = null;
    let fieldsToUpdate = { role: employee.role, branch: employee.branch, gender: employee.gender };
    user = await employeeRepository.findOneAndUpdate({ id: employee.id }, fieldsToUpdate, { new: true });

    !!user ? console.log(`Employee: ${user} \nsuccessfully updeted !!`)
    : console.log(`Error while trying to update employee with ID: ${employee.id}`);
};

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
};

module.exports.addCustomer = async (customer) => {
    let createdCustomer = await customerRepository.CREATE(customer);
    console.log(`A new customer created: ${createdCustomer}`);
};

module.exports.updateCustomer = async (customer) => {
    let user = null;
    let fieldsToUpdate = { phone: customer.phone, address: customer.address, gender: customer.gender };
    user = await customerRepository.findOneAndUpdate({ id: customer.id }, fieldsToUpdate, { new: true });

    !!user ? console.log(`User: ${user} \nsuccessfully updeted !!`)
    : console.log(`Error while trying to update user with ID: ${customer.id}`);
};

module.exports.getAllFlowers = () => {
    return flowers;
};

module.exports.getAllBranches = async () => {
    let success = false;
    let result = null;
    await brancheRepository.find({}, (err, branches) => {
        if (!err) {
            result = branches;
            success = true;
        }
    });
    return { success: success, data: result };
};