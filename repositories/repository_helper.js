const customerRepository = require('../model')('Customer');
const employeeRepository = require('../model')('Employee');

module.exports.isEmpUser = async userName =>
    await employeeRepository.findOne({ username: userName }) ? true : false;

module.exports.getUserByEmail = async email => {
    let user = await customerRepository.findOne({ address: email });
    !user && (user = await employeeRepository.findOne({ email: email }));
    return user;
};
