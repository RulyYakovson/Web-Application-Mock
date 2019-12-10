const debug = require("debug")("mongo:model-flower");
const mongoose = require("mongoose");
let Double = require('@mongoosejs/double');
let Schema = mongoose.Schema;

module.exports = function(db) {
    let flowerSchema = Schema(
        {
            name: { type: String, required: true },
            price: { type: Double, required: true },
            description: String,
            src: {
                data: Buffer, 
                contentType: String 
            },
            lastUpdate: Date,
            created: Date
        },
        { versionKey: false }
    );

    flowerSchema.statics.CREATE = async function(flower) {
        return this.create(
            {
                name: flower.name,
                price: flower.price,
                src: flower.src,
                description: flower.description
            }
        );
    };

    flowerSchema.pre('save', function(next) {
            let date = new Date();
            this.lastUpdate = date;
            if (!this.created) {
                this.created = date;
            }
            next();
  });

  db.model("Flower", flowerSchema);
  debug("Flower model created successfully");
};

