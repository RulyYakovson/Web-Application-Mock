const customerRepository = require('../model')('Customer');

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
    const fieldsToUpdate = { phone: customer.phone, address: customer.address, gender: customer.gender };
    user = await customerRepository.findOneAndUpdate({ id: customer.id }, fieldsToUpdate, { new: true });

    !!user ? console.log(`User: ${user} \nsuccessfully updeted !!`)
        : console.log(`Error while trying to update user with ID: ${customer.id}`);
};

module.exports.setTempPass = async customer => {
    let user = null;
    const fieldsToUpdate = { tempPass: customer.tempPass, expiresOn: customer.expiresOn };
    user = await customerRepository.findOneAndUpdate({ id: customer.id }, fieldsToUpdate, { new: true });

    !!user ? console.log(`Set temp password for user: ${user.username} finish successfully !!`)
        : console.log(`Error while trying to Set temp password for user with ID: ${customer.id}`);
};

module.exports.getCustomer = async email =>
    await customerRepository.findOne({ address: email });