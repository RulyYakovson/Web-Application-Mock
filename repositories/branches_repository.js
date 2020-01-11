const brancheRepository = require('../model')('Branch');

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