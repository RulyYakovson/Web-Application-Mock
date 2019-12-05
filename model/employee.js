const debug = require("debug")("mongo:model-employee");
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

module.exports = function(db) {
    let employeeSchema = Schema(
        {
            id: { type: String, required: true, unique: true},
            username: { type: String, required: true, unique: true },
            password: { type: String, required: true, maxlength: [8, 'Too long password'], minlength: [4, 'Too short password'] },
            gender: { type: String, enum: ['Male', 'Female', 'Gender'] },
            role: { type: String, enum: ['Employee', 'Admin', 'customer', 'Role'] },
            branch: Number,
            lastUpdate: Date,
            created: Date
        },
        { versionKey: false }
    );

    employeeSchema.statics.CREATE = async function(employee) {
        return this.create(
            {
                username: employee.username,
                id: employee.id,
                password: employee.password,
                role: employee.role,
                address: employee.address,
                branch: employee.branch,
                gender: employee.gender,
            }
        );
    };

    employeeSchema.pre('save', function(next){
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

