// impot mongoose to create schema.
const mongoose = require("mongoose");

// create user schema.
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true, lowercase: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill valid email"]},
    password: {type: String, required: true},
    role: {type: String, enum: ["user", "doctor"], default: "user", required: true},
},{
    // prevent the version control of application.
    versionKey: false,
    //enable the virtuals to refer.
    toJSON: {virtuals: true}
})

//crate refference, user to appointment.
userSchema.virtual("appointment", {
    ref: "appointment",
    localField: "_id", //user's id.
    foreignField: "userid", //appointment's userid.
    justOne: false //to show all the recipe created by user/array of objects of recipe.
})

//create user model and export.
const UserModel = mongoose.model("user", userSchema);
module.exports = {UserModel};