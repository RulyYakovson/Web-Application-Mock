const fs = require("fs");
const usersMock = require('../mock_db/usersData');
const flowersMock = require('../mock_db/flowers');
const branchesMock = require('../mock_db/branches');
const customerRepository = require('../model')('Customer');
const employeeRepository = require('../model')('Employee');
const brancheRepository = require('../model')('Branch');
const flowerRepository = require('../model')('Flower');
const branchHelper = require('./branches_repository');
const customerHelper = require('./customers_repository');
const employeeHelper = require('./employee_repository');
const flowerHelper = require('./flower_repository');

module.exports.isEmpUser = async userName =>
    await employeeRepository.findOne({ username: userName }) ? true : false;

module.exports.getUserByEmail = async email => {
    let user = await customerRepository.findOne({ address: email });
    !user && (user = await employeeRepository.findOne({ email: email }));
    return user;
};

module.exports.initDB = async () => {
    try {
        let result = await branchHelper.getAllBranches();
        if (this.initNeeded(result)) {
            await this.initBranchesDB();
        }

        result = await flowerHelper.getAllFlowers();
        if (this.initNeeded(result)) {
            this.initFlowersDB();
        }

        result = await customerHelper.getAllCustomers();
        if (this.initNeeded(result)) {
            await this.initCustomersDB();
        }

        result = await employeeHelper.getAllEmployees();
        if (this.initNeeded(result)) {
            await this.initEmployeesDB();
        }
    } catch (err) {
        console.error(err.message);
    }
};

module.exports.initBranchesDB = async () => {
    branchesMock.forEach(async branch => {
        await brancheRepository.CREATE(branch);
    });
};

module.exports.initCustomersDB = async () => {
    const customers = usersMock.filter((user) => user.role === 'customer');
    // customers.forEach(async customer => {
    //     await customerRepository.CREATE(customer);
    // });
    customers.forEach(async newCustomerDetails => {
        const newCustomer = new customerRepository({
            username: newCustomerDetails.username,
            firstName: newCustomerDetails.firstName,
            lastName: newCustomerDetails.lastName,
            id: newCustomerDetails.id,
            role: newCustomerDetails.role,
            address: newCustomerDetails.address,
            gender: newCustomerDetails.gender,
            phone: newCustomerDetails.phone,
        });
        await customerRepository.register(newCustomer, newCustomerDetails.password, (err, createdCustomer) => {
            if (err) {
                console.log(`Error whil trying to init customers: ${err.message}`);
            } else {
                console.log(`Insert customer: ${createdCustomer.username} into DB`);
            }
        });
    });
};

module.exports.initEmployeesDB = async () => {
    const employees = usersMock.filter((user) => user.role !== 'customer');
    // employees.forEach(async employee => {
    //     await employeeRepository.CREATE(employee);
    // });
    employees.forEach(async newEmpDetails => {
        const newEmp = new employeeRepository({
            username: newEmpDetails.username,
            firstName: newEmpDetails.firstName,
            lastName: newEmpDetails.lastName,
            id: newEmpDetails.id,
            role: newEmpDetails.role,
            email: newEmpDetails.email,
            branch: newEmpDetails.branch,
            gender: newEmpDetails.gender,
        });
        await employeeRepository.register(newEmp, newEmpDetails.password, (err, createdEmployee) => {
            if (err) {
                console.log(`Error while trying to init employees: ${err.message}`);
            } else {
                console.log(`Insert employee: ${createdEmployee.username} into DB`);
            }
        });
    });
};

module.exports.initFlowersDB = async () => {
    flowersMock.forEach(async elem => {
        const fileContent = fs.readFileSync(elem.src);
        const encodeFile = fileContent.toString('base64');
        const src = {
            contentType: 'image/png',
            data: new Buffer(encodeFile, 'base64')
        };

        const flower = {
            name: elem.name,
            price: elem.price,
            src: src,
            description: elem.description
        };
        await flowerRepository.CREATE(flower);
    });
};

module.exports.initNeeded = result =>
    (!result.success || !result.data || result.data.length === 0);