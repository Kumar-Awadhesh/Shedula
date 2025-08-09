const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    medicine: {type: String, required: true},
    dosages: {type: String, required: true},
    description: {type: String},
    userId: {type: mongoose.Schema.ObjectId, ref: "doctor", required: true}
},{
    versionKey: false,
    toJSON:{virtuals: true}
})

prescriptionSchema.virtual("doctor", {
    ref: "doctor",
    localField: "userId",
    foreignField: "_id"
})

const PresciptionModel = mongoose.model("prescription", prescriptionSchema);
module.exports = {PresciptionModel};