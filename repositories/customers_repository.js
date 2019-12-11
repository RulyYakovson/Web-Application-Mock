let customerRepository = require('../model')('Customer');

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