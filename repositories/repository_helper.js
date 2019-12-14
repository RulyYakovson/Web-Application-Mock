var fs = require("fs");
let usersMock = require('../mock_db/usersData');
let flowersMock = require('../mock_db/flowers');
let branchesMock = require('../mock_db/branches');
let customerRepository = require('../model')('Customer');
let employeeRepository = require('../model')('Employee');
let brancheRepository = require('../model')('Branch');
let flowerRepository = require('../model')('Flower');
let brancHelper = require('./branches_repository');
let customerHelper = require('./customers_repository');
let employeeHelper = require('./employee_repository');
let flowerHelper = require('./flower_repository');



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

module.exports.initDB = async () => {
    try {
        let result = await brancHelper.getAllBranches();
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
    } catch(err) {
        console.log(err);
    }
};

module.exports.initBranchesDB = async () => {
    branchesMock.forEach(async branch => {
        await brancheRepository.CREATE(branch);
    });
};

module.exports.initCustomersDB = async () => {
    let customers = usersMock.filter( (user) => user.role === 'customer');
    customers.forEach(async customer => {
        await customerRepository.CREATE(customer);
    });
};

module.exports.initEmployeesDB = async () => {
    let employees = usersMock.filter( (user) => user.role !== 'customer');
    employees.forEach(async employee => {
        await employeeRepository.CREATE(employee);
    });
};

module.exports.initFlowersDB = async () => {
    flowersMock.forEach(async elem => {
    let fileContent = fs.readFileSync(elem.src);
    let encodeFile = fileContent.toString('base64');
    let src = {
        contentType: 'image/png',
        data :new Buffer(encodeFile, 'base64')
    };

    let flower = {
        name: elem.name,
        price: elem.price,
        src: src,
        description: elem.description
    };
        await flowerRepository.CREATE(flower);
    });
};

module.exports.initNeeded = result => (!result.success || !result.data || result.data.length === 0);