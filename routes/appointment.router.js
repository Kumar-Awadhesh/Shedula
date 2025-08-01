const express = require("express"); //imoport express.
const bcrypt = require("bcrypt"); //import bcrypt.
const jwt = require("jsonwebtoken"); //import jsonwebtoken
const { AppointmentModel } = require("../models/appointment.model"); // import User Model from models.

const appointmentRouter = express.Router();

//asynchronous funtion to register Doctor.
appointmentRouter.post("/register", async (req, res) => {

    //get and destructure name/phone/email/password/role from req body.
    const { name, time, image, role, address } = req.body;

    //try and catch block to catch any errors.
    try {
        //check if Appointment already registerd.
        const existAppointment = await AppointmentModel.findOne({ name });

        //return already registered response if Appointment exist.
        if (existAppointment) {
            return res.json({ msg: "Appointment already Registerd" });
        }
       
        //set Appointment detail in data base and store in variable newAppointment
        const newAppointment = new AppointmentModel({ name, time, image, role, address });

        //save the Appointment in data base and return registered successfully response.
        await newAppointment.save();
        res.json({ msg: "Appointment Registerd Successfully!" });
    }
    catch (err) {
        //log any error if catch.
        console.log("catch error", err);
    }
})

//asynchronous funtion to get the Appointment profile.
appointmentRouter.get("/profile", async (req, res) => {

    //try and catch block to catch any errors.
    try {
         //get the token from authorization if exist, and split by space to get the second element as token.
        const token = req.headers.authorization?.split(" ")[1];

        //return please login response when token is false.
        if (!token) {
            return res.json({ msg: "PLease Login!" });
        }
        
        //verify token wether its valid and genuine or not, and capture the value in decoded variable.
        const decoded = jwt.verify(token, "recipe");

        //return inavalid token response when decoded is false.
        if (!decoded) {
            return res.json({ msg: "invalid token!" });
        }

         //get Appointment's id from decoded varable that is passed when token generated.
        const Appointmentid = decoded.AppointmentId;

        //get the existing Appointment by their id and capture in existAppointment variabe.
        const existAppointment = await AppointmentModel.findById(Appointmentid);

        //return Appointment not found response when existAppointment is false.
        if (!existAppointment) {
            return res.json({ msg: "Appointment not found!" });
        }

        //check the Appointment role and authorized accordingly.
        if (existAppointment?.role === "user") {
            //find Appointment by id and populate their recipe and store in getAppointment variable.
            const getAppointment = await AppointmentModel.findById(Appointmentid)
            //return getAppointment in response.
            return res.json({ msg: getAppointment });
        }

        //check the Appointment role and authorized accordingly.
        else if (existAppointment?.role === "admin") {
             //find Appointment by id and populate their recipe and store in getAllAppointment variable.
            const getAllAppointment = await AppointmentModel.find()
            return res.json({ msg: getAllAppointment });
        }
        else {
            //return not authorized response.
            return res.json({ msg: "You are not authorized!" });
        }
    } 
    catch (err) {
       console.log("catch error", err);
    }
})



// export Appointment router.
module.exports = { appointmentRouter };