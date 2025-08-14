const express = require("express"); //imoport express.
const bcrypt = require("bcrypt"); //import bcrypt.
const jwt = require("jsonwebtoken"); //import jsonwebtoken
const { PrescriptionModel } = require("../models/prescription.model"); // import User Model from models.
const {DoctorModel} = require("../models/doctor.model"); // import user model to verify user.


const prescriptionRouter = express.Router();

//asynchronous funtion to register Doctor.
prescriptionRouter.post("/addPrescription", async (req, res) => {

    //get and destructure name/phone/email/password/role from req body.
    const { medicine, dosage, description, patientId } = req.body;

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
        console.log(userid)

        //check if User already registerd.
        const existUser = await DoctorModel.findById(userid);
        console.log(existUser)
        //return already registered response if User exist.
        if (!existUser) {
            return res.json({ msg: "User not found!" });
        }

        //check only doctor can add prescription.
        if(existUser.role !== "doctor"){
            return res.json({msg: "You are not Authorized!"});
        }

        //get prescription from data base by medicine name.
        const existPrescription = await PrescriptionModel.findOne({medicine});
        
        //check if same Prescription already exist.
        if(existPrescription?.medicine?.toString() === medicine){
           return res.json({msg: "Prescription already added !"})
        }
       
        //set Prescription detail in data base and store in variable newPrescription
        const newPrescription = new PrescriptionModel({ medicine, dosage, description, patientId, userId: userid });

        //save the Prescription in data base and return registered successfully response.
        await newPrescription.save();
        res.json({ msg: "Prescription Added Successfully!" });
    }
    catch (err) {
        //log any error if catch.
        console.log("catch error:", err)
        res.json({msg: err.message});
    }
})

//asynchronous funtion to get the Prescription profile.
prescriptionRouter.get("/getPrescription", async (req, res) => {

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

         //get Prescription's id from decoded varable that is passed when token generated.
        const userId = decoded.userId;

        //get the existing User by their id and capture in existUser variabe.
        const existUser = await DoctorModel.findById(userId);

        //return User not found response when existUser is false.
        if (!existUser) {
            return res.json({ msg: "User not found!" });
        }

        //check the User role and authorized accordingly.
        if (existUser?.role === "user") {
            //find Prescription by id and populate their Prescription and store in getPrescription variable.
            const getPrescription = await PrescriptionModel.find({patientId});
            //return getPrescription in response.
            return res.json({ msg: getPrescription });
        }


        //check the User role and authorized accordingly.
        else if (existUser?.role === "doctor") {
             //find Prescription by id and populate their recipe and store in getAllPrescription variable.
            const getAllPrescription = await PrescriptionModel.findById(userId).populate("doctor");
            return res.json({ msg: getAllPrescription });
        }
        else {
            //return not authorized response.
            return res.json({ msg: "You are not authorized!" });
        }
    } 
    catch (err) {
       console.log("catch error", err);
       res.json({msg: err.message});
    }
})

prescriptionRouter.patch("/updatePrescription/:id", async(req, res) => {
    const {medicine, dosage, description, patientId} = req.body;
    const id = req.params.id;
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if(!token){
            res.json({msg: "PLease Login!"})
        }
        const decoded = jwt.verify(token, "shedula");

        if(!decoded){
            return res.json({msg: "Invalid token!"})
        }

        const userId = decoded.userId;

        const existUser = await DoctorModel.findById(userId);

        if(!existUser){
            return res.json({msg: "User Not Found!"});
        }

        if(existUser.role !== "doctor"){
            return res.json({msg: "You are not Authorized!"});
        }
       
        const updatePrescription = await PrescriptionModel.findByIdAndUpdate(id, {medicine, dosage, description, patientId});
        
        await updatePrescription.save();
        res.json({msg: "Prescription Updated Successfully!"})

    } 
    catch (err) {
        console.log("catch error", err);
        res.json({msg: err.message});
    }
})

prescriptionRouter.delete("/deletePrescription/:id", async(req, res) => {
    const {medicine, dosage, description, patientId} = req.body;
    const id = req.params.id;
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if(!token){
            res.json({msg: "PLease Login!"})
        }
        const decoded = jwt.verify(token, "shedula");

        if(!decoded){
            return res.json({msg: "Invalid token!"})
        }

        const userId = decoded.userId;

        const existUser = await DoctorModel.findById(userId);

        if(!existUser){
            return res.json({msg: "User Not Found!"});
        }

        if(existUser.role !== "doctor"){
            return res.json({msg: "You are not Authorized!"});
        }

        await PrescriptionModel.findByIdAndDelete(id, {medicine, dosage, description, patientId});
        res.json({msg: "Prescription Deleted Successfully!"})

    } 
    catch (err) {
        console.log("catch error", err);
        res.json({msg: err.message});
    }
})



// export Prescription router.
module.exports = { prescriptionRouter };