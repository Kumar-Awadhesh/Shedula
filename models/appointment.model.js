const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    time: {type: Date, required: true, unique: true},
    image: {type: String, required: true, unique: true},
    designation: {type: String, required: true},
    doctorId: {type: String, required: true},
    address: {type: String, required: true},
    userid: {type: mongoose.Schema.ObjectId, ref: "user", required: true},
}, {
    versionKey: false,
    toJSON: {virtuals: true}
})

appointmentSchema.virtual("user", {
    ref: "user",
    localField: "_id",
    foreignField: "userid"
})


const AppointmentModel = mongoose.model("appointment",appointmentSchema);
module.exports = {AppointmentModel}