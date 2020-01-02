const debug = require("debug")("mongo:model-employee");
const passportLocalMongoose = require('passport-local-mongoose');
let passport = require('passport');
const mongoose = require("mongoose");
let Schema = mongoose.Schema;


module.exports = function (db) {
    let employeeSchema = Schema(
        {
            id: { type: String, required: true, unique: true },
            username: { type: String, required: true, unique: true },
            password: { type: String, maxlength: [8, 'Too long password'], minlength: [4, 'Too short password'] },
            gender: { type: String, enum: ['Male', 'Female', 'Gender'] },
            role: { type: String, enum: ['Employee', 'Admin', 'customer', 'Role'] },
            branch: Number,
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
            id: newEmpDetails.id,
            role: newEmpDetails.role,
            address: newEmpDetails.address,
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
        let date = new Date();
        this.lastUpdate = date;
        if (!this.created) {
            this.created = date;
        }
        next();
    });

    db.model("Employee", employeeSchema);
    debug("Employee model created successfully");
};

