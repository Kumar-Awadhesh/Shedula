const express = require("express"); //imoport express.
const bcrypt = require("bcrypt"); //import bcrypt.
const jwt = require("jsonwebtoken"); //import jsonwebtoken
const { AppointmentModel } = require("../models/appointment.model"); // import User Model from models.
const {UserModel} = require("../models/user.model"); // import user model to verify user.


const appointmentRouter = express.Router();

//asynchronous funtion to register Doctor.
appointmentRouter.post("/book", async (req, res) => {

    //get and destructure name/phone/email/password/role from req body.
    const { name, time, patientName, date, image, designation, doctorId, address } = req.body;

    //try and catch block to catch any errors.
    try {
        const token = req.headers.authorization?.split(" ")[1]
         //return please login response when token is false.
        if(!token){
            return res.json({msg: "PLease Login!"});
        }
        //verify token wether its valid and genuine or not, and capture the value in decoded variable.
        const decoded = jwt.verify(token, "shedula");
        //return inavalid token response when decoded is false.
        if(!decoded){
            return res.json({msg: "invalid token!"});
        } 
        //get user's id from decoded varable that is passed when token generated.
        const userid = decoded.userId;

        //check if User already registerd.
        const existUser = await UserModel.findById(userid);

        //return already registered response if User exist.
        if (!existUser) {
            return res.json({ msg: "User not found!" });
        }
       
        //set Appointment detail in data base and store in variable newAppointment
        const newAppointment = new AppointmentModel({ name, time, patientName, date, image, address, designation, doctorId, userid: userid });

        //check if any appointment already exixt.
        const existAppointment = await AppointmentModel.findOne({doctorId});
        
        //check if same appointment already exist.
        if(existAppointment?.doctorId?.toString() === doctorId){
           return res.json({msg: "Appointment already booked !"})
        }
        //save the Appointment in data base and return registered successfully response.
        await newAppointment.save();
        res.json({ msg: "Appointment Booked Successfully!" });
    }
    catch (err) {
        //log any error if catch.
        console.log("catch error:", err)
    }
})

//asynchronous funtion to get the Appointment profile.
appointmentRouter.get("/getAppointment", async (req, res) => {

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

         //get Appointment's id from decoded varable that is passed when token generated.
        const userId = decoded.userid;

        //get the existing User by their id and capture in existUser variabe.
        const existUser = await UserModel.findById(userId);

        //return User not found response when existUser is false.
        if (!existUser) {
            return res.json({ msg: "User not found!" });
        }

        //check the User role and authorized accordingly.
        if (existUser?.role === "user") {
            //find Appointment by id and populate their appointment and store in getAppointment variable.
            const getAppointment = await AppointmentModel.findById(userId).populate("user");
            //return getAppointment in response.
            return res.json({ msg: getAppointment });
        }



        //---------------------------------------- Need to Change when Doctor's Login Page Create----------------------------------------------------



        //check the User role and authorized accordingly.
        else if (existUser?.role === "doctor") {
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