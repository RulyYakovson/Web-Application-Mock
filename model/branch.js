const debug = require("debug")("mongo:model-branch");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = function (db) {
    const branchSchema = Schema(
        {
            name: { type: String, required: true, unique: true },
            branchesID: { type: String, required: true, unique: true },
            address: String,
            phone: String,
            map: String,
            lastUpdate: Date,
            created: Date
        },
        { versionKey: false }
    );

    branchSchema.statics.CREATE = async function (branch) {
        return this.create(
            {
                name: branch.name,
                branchesID: branch.branchesID,
                phone: branch.phone,
                address: branch.address,
                map: branch.map,
            }
        );
    };

    branchSchema.pre('save', function (next) {
        const date = new Date();
        this.lastUpdate = date;
        if (!this.created) {
            this.created = date;
        }
        next();
    });

    db.model("Branch", branchSchema);
    debug("Branch model created successfully");
};

