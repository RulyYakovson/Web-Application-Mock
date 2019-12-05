const debug = require("debug")("mongo:model-customer");
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

module.exports = function(db) {
    let customerSchema = Schema(
        {
            id: { type: String, required: true, unique: true},
            username: { type: String, required: true, unique: true },
            password: { type: String, required: true, maxlength: [8, 'Too long password'], minlength: [4, 'Too short password'] },
            phone: { type: String, maxlength: [10, 'Invalid phone number'], minlength: [9, 'Invalid phone number'] },
            gender: { type: String, enum: ['Male', 'Female'] },
            role: { type: String, enum: ['Employee', 'Admin', 'customer'] },
            address: String,
            lastUpdate: Date,
            created: Date
        },
        { versionKey: false }
    );

    customerSchema.statics.CREATE = async function(customer) {
        return this.create(
            {
                username: customer.username,
                id: customer.id,
                password: customer.password,
                role: customer.role,
                phone: customer.phone,
                address: customer.address,
                gender: customer.gender,
            }
        );
    };

    customerSchema.pre('save', function(next){
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

