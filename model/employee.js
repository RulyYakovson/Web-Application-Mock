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
            password: { type: String,/*required: true,*/ maxlength: [8, 'Too long password'], minlength: [4, 'Too short password'] },
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
        const employee = req.body;
        let newEmployee = null;
        newEmployee = await this.register(
            new this(
                {
                    username: employee.username,
                    id: employee.id,
                    role: employee.role,
                    address: employee.address,
                    branch: employee.branch,
                    gender: employee.gender,
                }
            ), employee.password, (err, createdEmployee) => {
                if (err) {
                    console.log(err.message);
                    // return null;
                }
                // createdEmployee = createdEmployee;
                //console.log(createdEmployee);
                //newEmployee = createdEmployee;
                // passport.authenticate('local')(req, res, () => {
                //     console.log(`A new employee:\n${createdEmployee}\nsuccessfully created !!`);
                // });
            });
            return newEmployee;
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

