const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    medicine: {type: String, required: true},
    dosage: {type: String, required: true},
    description: {type: String},
    patientId: {type: String, required: true},
    userId: {type: mongoose.Schema.ObjectId, ref: "doctor", required: true}
},{
    versionKey: false,
    toJSON:{virtuals: true}
})

prescriptionSchema.virtual("doctor", {
    ref: "doctor",
    localField: "userId",
    foreignField: "_id",
    justOne: false
})

const PrescriptionModel = mongoose.model("prescription", prescriptionSchema);
module.exports = {PrescriptionModel};