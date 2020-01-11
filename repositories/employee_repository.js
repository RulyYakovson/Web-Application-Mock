const employeeRepository = require('../model')('Employee');
const EditException = require('../exceptions/exceptions');
const { updateSession } = require('../utils/helper');

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

module.exports.updateEmployee = async employee => {
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

module.exports.editEmployee = async req => {
    const employee = req.body;
    const id = req.session.userId;
    let user = null;
    const fieldsToUpdate = {
        id: employee.id,
        username: employee.username,
        firstName: employee.firstName,
        lastName: employee.lastName,
        phone: employee.phone,
        gender: employee.gender,
        email: employee.email
    };
    user = await employeeRepository.findOneAndUpdate({ id: id }, fieldsToUpdate, { new: true });

    if (user) {
        console.log(`Employee: ${user} \nsuccessfully updeted !!`);
        updateSession(user, req.session);
    } else {
        const err = `Error while trying to update employee with ID: ${employee.id}`;
        console.log(err);
        throw new EditException(err);
    }
};

module.exports.setEmpToken = async emp => {
    let user = null;
    const fieldsToUpdate = { token: emp.token, expiresOn: emp.expiresOn };
    user = await employeeRepository.findOneAndUpdate({ id: emp.id }, fieldsToUpdate, { new: true });

    !!user ? console.log(`Successfully set token for user: '${user.username}'.`)
        : console.log(`Error while trying to set token for user with ID: ${emp.id}`);
};

module.exports.updatePassword = async (req, res) => {
    const username = req.session.username;
    await employeeRepository.findOne({ username: username }, async (err, user) => {
        if (err) {
            console.log(`Error while trying to find user to update password for. \nUser: '${username}' \nError: ${err.message}`);
            res.status(400).send('ERROR');
        } else if (!user) {
            console.log(`User: '${username}' not found`);
            res.status(400).send('ERROR');
        } else {
            user.changePassword(req.body.oldPassword, req.body.newPassword, (err, user) => {
                if (err) {
                    console.log(`Error while trying to update password for user: '${username}'. \n${err.message}`);
                    if (err.message.includes('Password or username is incorrect')) {
                        res.status(401).send('ERROR');
                    } else {
                        res.status(500).send('ERROR');
                    }
                } else {
                    console.log(`Password update successfully for user: \n'${user}'`);
                    res.status(200).send('OK');
                }
            });
        }
    });
};

module.exports.setNewPassword = async (req, res) => {
    const username = req.body.username;
    await employeeRepository.findOne({ username: username }, async (err, user) => {
        if (err) {
            console.log(`Error while trying to find user to change password for. \nUser: '${username}' \nError: ${err.message}`);
            res.status(500).send('ERROR');
        } else if (!user) {
            console.log(`User: '${username}' not found.`);
            res.status(400).send('ERROR');
        } else if (!isValidToken(req.body.token, user)) {
            console.log(`The received token for user: '${username}' has incorrect or expired.`);
            res.status(401).send('ERROR');
        } else {
            setPassword(req.body.password, user, username, res);
        }
    });
};

const isValidToken = (token, user) =>
    (token === user.token) && (user.expiresOn >= Date.now());

const setPassword = (password, userToSet, username, res) => {
    userToSet.setPassword(password, (err, user) => {
        if (err) {
            console.log(`Error while trying to change password for user: '${username}'. \n${err.message}`);
            res.status(500).send('ERROR');
        } else {
            user.token = undefined;
            user.expiresOn = undefined;
            user.save(err => {
                if (err) {
                    console.log(`Error while trying to save user after set password. \nUser: '${username}'. \nError: ${err.message}`);
                    res.status(500).send('ERROR');
                }
            })
            console.log(`Password change successfully for user: \n'${user}.'`);
            res.status(200).send('OK');
        }
    });
};