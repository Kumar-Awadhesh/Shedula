const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required:true},
    phone: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true, lowecase: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill valid email"]},
    password: {type: String, required: true},
    designation: {type: String, required: true},
    address: {type: String, required: true},
    role: {type: String, default: "doctor", required:true}
}, {
    versionKey: false,
    toJSON:{virtuals: true}
})

doctorSchema.virtual("prescription", {
    ref: "prescription",
    localField: "_id",
    foreignField: "userId",
    justOne: false
})


const DoctorModel = mongoose.model("doctor", doctorSchema);
module.exports = {DoctorModel};