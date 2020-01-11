const customerRepository = require('../model')('Customer');
const EditException = require('../exceptions/exceptions');
const { updateSession } = require('../utils/helper');

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

module.exports.removeCustomer = async id => {
    const user = await customerRepository.findOneAndDelete({ id: id });
    !!user ? console.log(`User: ${user} \nsuccessfully deleted !!`)
        : console.log(`ERROR: User with ID: ${id} not found !!`);
};

module.exports.addCustomer = async (req, res) => {
    await customerRepository.CREATE(req, res);
};

module.exports.updateCustomer = async customer => {
    let user = null;
    let fieldsToUpdate = {
        phone: customer.phone,
        address: customer.address,
        gender: customer.gender
    };

    user = await customerRepository.findOneAndUpdate({ id: customer.id }, fieldsToUpdate, { new: true });

    !!user ? console.log(`User: ${user} \nsuccessfully updeted !!`)
    : console.log(`Error while trying to update user with ID: ${customer.id}`);
};

module.exports.editCustomer = async req => {
    const customer = req.body;
    const id = req.session.userId;
    let user = null;
    const fieldsToUpdate = {
            id: customer.id,
            username: customer.username,
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phone,
            gender: customer.gender,
            address: customer.email
        };
        
    user = await customerRepository.findOneAndUpdate({ id: id }, fieldsToUpdate, { new: true });

    if (user) {
        console.log(`User: ${user} \nsuccessfully updeted !!`);
        updateSession(user, req.session);
    } else {
        const err = `Error while trying to update user with ID: ${customer.id}`;
        console.log(err);
        throw new EditException(err);
    }
};

module.exports.setToken = async customer => {
    let user = null;
    const fieldsToUpdate = { token: customer.token, expiresOn: customer.expiresOn };
    user = await customerRepository.findOneAndUpdate({ id: customer.id }, fieldsToUpdate, { new: true });

    !!user ? console.log(`Successfully set token for user: '${user.username}'.`)
        : console.log(`Error while trying to set token for user with ID: ${customer.id}`);
};

module.exports.updatePassword = async (req, res) => {
    const username = req.session.username;
    await customerRepository.findOne({ username: username }, async (err, user) => {
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
    await customerRepository.findOne({ username: username }, async (err, user) => {
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
