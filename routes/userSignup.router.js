const express = require("express"); //imoport express.
const bcrypt = require("bcrypt"); //import bcrypt.
const jwt = require("jsonwebtoken"); //import jsonwebtoken
const { UserModel } = require("../models/user.model"); // import User Model from models.

const userRouter = express.Router();

//asynchronous funtion to register user.
userRouter.post("/register", async (req, res) => {

    //get and destructure name/phone/email/password/role from req body.
    const { name, phone, email, password, role } = req.body;

    //try and catch block to catch any errors.
    try {
        //check if user already registerd.
        const existUser = await UserModel.findOne({ email });

        //return already registered response if user exist.
        if (existUser) {
            return res.json({ msg: "User already Registerd" });
        }
        // hash the password using bcrypt and store in variable hash.
        const hash = await bcrypt.hash(password, 6);

        //return failed to hash password response if failed.
        if (!hash) {
            return res.json({ msg: "failed to create password!" });
        }
        //set user detail in data base and store in variable newUser
        const newUser = new UserModel({ name, phone, email, password: hash, role });

        //save the user in data base and return registered successfully response.
        await newUser.save();
        res.json({ msg: "User Registerd Successfully!" });
    }
    catch (err) {
        //log any error if catch.
        console.log("catch error", err);
    }
})

//asynchronous funtion to get the user profile.
userRouter.get("/profile", async (req, res) => {

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

         //get user's id from decoded varable that is passed when token generated.
        const userid = decoded.userId;

        //get the existing user by their id and capture in existUser variabe.
        const existUser = await UserModel.findById(userid);

        //return user not found response when existUser is false.
        if (!existUser) {
            return res.json({ msg: "User not found!" });
        }

        //check the user role and authorized accordingly.
        if (existUser?.role === "user") {
            //find user by id and populate their recipe and store in getUser variable.
            const getUser = await UserModel.findById(userid).populate("appointment");
            //return getUser in response.
            return res.json({ msg: getUser });
        }

        //check the user role and authorized accordingly.
        else if (existUser?.role === "admin") {
             //find user by id and populate their recipe and store in getAllUser variable.
            const getAllUser = await UserModel.find().populate("appointment");
            return res.json({ msg: getAllUser });
        }
        else {
            //return not authorized response.
            return res.json({ msg: "You are not authorized!" });
        }
    } 
    catch (err) {
        
    }
})



// export user router.
module.exports = { userRouter };