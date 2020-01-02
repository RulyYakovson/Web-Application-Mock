const debug = require("debug")("mongo:model-customer");
const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

module.exports = function (db) {
    let customerSchema = Schema(
        {
            id: { type: String, required: true, unique: true },
            username: { type: String, required: true, unique: true },
            password: { type: String, maxlength: [8, 'Too long password'], minlength: [3, 'Too short password'] },
            phone: { type: String, maxlength: [10, 'Invalid phone number'], minlength: [9, 'Invalid phone number'] },
            gender: { type: String, enum: ['Male', 'Female', 'Gender'] },
            role: { type: String, enum: ['Employee', 'Admin', 'customer'] },
            address: String,
            lastUpdate: Date,
            created: Date
        },
        { versionKey: false }
    );

    customerSchema.plugin(passportLocalMongoose);

    customerSchema.statics.CREATE = async function (req, res) {
        const newCustomerDetails = req.body;
        const newCustomer = new this({
            username: newCustomerDetails.username,
            id: newCustomerDetails.id,
            role: newCustomerDetails.role,
            address: newCustomerDetails.address,
            gender: newCustomerDetails.gender,
            phone: newCustomerDetails.phone,
        });
        await this.register(newCustomer, newCustomerDetails.password, (err, createdCustomer) => {
            if (err) {
                const errMsg = err.message;
                console.log(`ERROR: ${errMsg}`);
                if (errMsg.includes('duplicate key error') || errMsg.includes('username is already registered')) {
                    res.status(400).send(err.message);
                } else {
                    res.status(500).send(err.message);
                }
            } else {
                console.log(`A new customer:\n${createdCustomer}\nsuccessfully created !!`);
                res.status(200).send('OK');
            }
        });
    };

    customerSchema.pre('save', function (next) {
        let date = new Date();
        this.lastUpdate = date;
        if (!this.created) {
            this.created = date;
        }
        next();
    });

    db.model("Customer", customerSchema);
    debug("Customer model created successfully");
};
