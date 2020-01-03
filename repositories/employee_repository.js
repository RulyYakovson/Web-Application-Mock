const employeeRepository = require('../model')('Employee');

module.exports.getAllEmployees = async () => {
    let success = false;
    let result = null;
    await employeeRepository.find({}, (err, employees) => {
        err && console.error(err);
        if (!err) {
            result = employees;
            success = true;
        }
    });
    return { success: success, data: result };
};

module.exports.removeEmployee = async (id) => {
    const employee = await employeeRepository.findOneAndDelete({ id: id });
    !!employee ? console.log(`Employee: ${employee} \nsuccessfully deleted !!`)
        : console.error(`ERROR: Employee with ID: ${id} not found !!`);
};

module.exports.addEmployee = async (req, res) => {
    await employeeRepository.CREATE(req, res);
};

module.exports.updateEmployee = async (employee) => {
    let user = null;
    const fieldsToUpdate = {
        role: employee.role,
        branch: employee.branch,
        gender: employee.gender
    };
    user = await employeeRepository.findOneAndUpdate({ id: employee.id }, fieldsToUpdate, { new: true });

    !!user ? console.log(`Employee: ${user} \nsuccessfully updeted !!`)
        : console.log(`Error while trying to update employee with ID: ${employee.id}`);
};