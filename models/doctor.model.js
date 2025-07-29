const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required:true},
    phone: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true, lowecase: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill valid email"]},
    password: {type: String, required: true},
    role: {type: String, required: true},
    address: {type: String, required: true}
}, {
    versionKey: false
})

const DoctorModel = mongoose.model("doctor", doctorSchema);
module.exports = {DoctorModel};