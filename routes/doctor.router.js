const express = require("express"); //imoport express.
const bcrypt = require("bcrypt"); //import bcrypt.
const jwt = require("jsonwebtoken"); //import jsonwebtoken
const { DoctorModel } = require("../models/doctor.model"); // import User Model from models.

const doctorRouter = express.Router();

//asynchronous funtion to register Doctor.
doctorRouter.post("/register", async (req, res) => {

    //get and destructure name/phone/email/password/role from req body.
    const { name, image, phone, email, password, role, address } = req.body;

    //try and catch block to catch any errors.
    try {
        //check if Doctor already registerd.
        const existDoctor = await DoctorModel.findOne({ email });

        //return already registered response if Doctor exist.
        if (existDoctor) {
            return res.json({ msg: "Doctor already Registerd" });
        }
        // hash the password using bcrypt and store in variable hash.
        const hash = await bcrypt.hash(password, 6);

        //return failed to hash password response if failed.
        if (!hash) {
            return res.json({ msg: "failed to create password!" });
        }
        //set Doctor detail in data base and store in variable newDoctor
        const newDoctor = new DoctorModel({ name, image, phone, email, password: hash, role, address });

        //save the Doctor in data base and return registered successfully response.
        await newDoctor.save();
        res.json({ msg: "Doctor Registerd Successfully!" });
    }
    catch (err) {
        //log any error if catch.
        console.log("catch error", err);
    }
})

//asynchronous funtion to get the Doctor profile.
doctorRouter.get("/profile", async (req, res) => {

    //try and catch block to catch any errors.
    try {
         //get the token from authorization if exist, and split by space to get the second element as token.
        const token = req.headers.authorization?.split(" ")[1];

        //return please login response when token is false.
        if (!token) {
            return res.json({ msg: "PLease Login!" });
        }
        
        //verify token wether its valid and genuine or not, and capture the value in decoded variable.
        const decoded = jwt.verify(token, "shedula");

        //return inavalid token response when decoded is false.
        if (!decoded) {
            return res.json({ msg: "invalid token!" });
        }

         //get Doctor's id from decoded varable that is passed when token generated.
        const Doctorid = decoded.DoctorId;

        //get the existing Doctor by their id and capture in existDoctor variabe.
        const existDoctor = await DoctorModel.findById(Doctorid);

        //return Doctor not found response when existDoctor is false.
        if (!existDoctor) {
            return res.json({ msg: "Doctor not found!" });
        }

        //check the Doctor role and authorized accordingly.
        if (existDoctor?.role === "user") {
            //find Doctor by id and populate their recipe and store in getDoctor variable.
            const getDoctor = await DoctorModel.findById(Doctorid)
            //return getDoctor in response.
            return res.json({ msg: getDoctor });
        }

        //check the Doctor role and authorized accordingly.
        else if (existDoctor?.role === "admin") {
             //find Doctor by id and populate their recipe and store in getAllDoctor variable.
            const getAllDoctor = await DoctorModel.find()
            return res.json({ msg: getAllDoctor });
        }
        else {
            //return not authorized response.
            return res.json({ msg: "You are not authorized!" });
        }
    } 
    catch (err) {
        
    }
})



// export Doctor router.
module.exports = { doctorRouter };