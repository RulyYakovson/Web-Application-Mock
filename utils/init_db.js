const fs = require("fs");
const usersMock = require('../mock_db/usersData');
const flowersMock = require('../mock_db/flowers');
const branchesMock = require('../mock_db/branches');
const customerRepository = require('../model')('Customer');
const employeeRepository = require('../model')('Employee');
const brancheRepository = require('../model')('Branch');
const flowerRepository = require('../model')('Flower');
const branchHelper = require('../repositories/branches_repository');
const customerHelper = require('../repositories/customers_repository');
const employeeHelper = require('../repositories/employee_repository');
const flowerHelper = require('../repositories/flower_repository');

const initBranchesDB = async () => {
    branchesMock.forEach(async branch => {
        await brancheRepository.CREATE(branch);
    });
};

const initCustomersDB = async () => {
    const customers = usersMock.filter((user) => user.role === 'customer');
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

const initEmployeesDB = async () => {
    const employees = usersMock.filter((user) => user.role !== 'customer');
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

const initFlowersDB = async () => {
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

const initNeeded = result =>
    (!result.success || !result.data || result.data.length === 0);

(async () => {
    try {
        let result = await branchHelper.getAllBranches();
        if (initNeeded(result)) {
            await initBranchesDB();
        }

        result = await flowerHelper.getAllFlowers();
        if (initNeeded(result)) {
            initFlowersDB();
        }

        result = await customerHelper.getAllCustomers();
        if (initNeeded(result)) {
            await initCustomersDB();
        }

        result = await employeeHelper.getAllEmployees();
        if (initNeeded(result)) {
            await initEmployeesDB();
        }
    } catch (err) {
        console.error(err.message);
    }
})();