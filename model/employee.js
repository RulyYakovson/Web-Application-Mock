const debug = require("debug")("mongo:model-employee");
const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


module.exports = function (db) {
    const employeeSchema = Schema(
        {
            id: { type: String, required: true, unique: true },
            username: { type: String, required: true, unique: true },
            firstName: String,
            lastName: String,
            password: { type: String, maxlength: [8, 'Too long password'], minlength: [4, 'Too short password'] },
            gender: { type: String, enum: ['Male', 'Female', 'Gender'] },
            role: { type: String, enum: ['Employee', 'Admin', 'customer', 'Role'] },
            email: { type: String, required: true, unique: true },
            phone: { type: String, maxlength: [13, 'Invalid phone number'], minlength: [9, 'Invalid phone number'] },
            branch: Number,
            token: String,
            expiresOn: String,
            lastUpdate: Date,
            created: Date
        },
        { versionKey: false }
    );

    employeeSchema.plugin(passportLocalMongoose);

    employeeSchema.statics.CREATE = async function (req, res) {
        const newEmpDetails = req.body;
        const newEmp = new this({
            username: newEmpDetails.username,
            firstName: newEmpDetails.firstName,
            lastName: newEmpDetails.lastName,
            id: newEmpDetails.id,
            role: newEmpDetails.role,
            email: newEmpDetails.email,
            branch: newEmpDetails.branch,
            gender: newEmpDetails.gender,
        });
        await this.register(newEmp, newEmpDetails.password, (err, createdEmployee) => {
            if (err) {
                const errMsg = err.message;
                console.log(`ERROR: ${errMsg}`);
                if (errMsg.includes('duplicate key error') || errMsg.includes('username is already registered')) {
                    res.status(400).send(err.message);
                } else {
                    res.status(500).send(err.message);
                }
            } else {
                console.log(`A new employee:\n${createdEmployee}\nsuccessfully created !!`);
                res.status(200).send('OK');
            }
        });
    };

    employeeSchema.pre('save', function (next) {
        const date = new Date();
        this.lastUpdate = date;
        if (!this.created) {
            this.created = date;
        }
        next();
    });

    db.model("Employee", employeeSchema);
    debug("Employee model created successfully");
};

