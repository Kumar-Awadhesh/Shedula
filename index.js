const express = require("express"); //import express.
const cors = require("cors"); //import cors.
const path = require("path")
const mongoose = require("mongoose"); //import mongoose.
const {userRouter} = require("./routes/userSignup.router"); //import user router from routes.
const {appointmentRouter} = require("./routes/appointment.router"); //import recipe router from routes.
const {loginRouter} = require("./routes/userLogin.router"); //import login router from routes
const {doctorRouter} = require("./routes/doctor.router")

const app = express(); //initilize app variable to store express access.
app.use(express.json()); //initialize express json to 
app.use(cors()); //call cors middle ware to solve cors error.
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/user", userRouter); //user's endpoint/routes.
app.use("/appointment", appointmentRouter); //appointment's endpoint/routes.
app.use("/login", loginRouter); //login endpoint/routes
app.use("/doctor", doctorRouter) //doctor's endpoint/routes.

//server local host initilizing.
app.listen(3201, async() => {

    //try catch block to catch any error.
    try {
        //connecting to data base through mongoose.
        await mongoose.connect("mongodb+srv://kumaravi0506:Gabriel%40511@myfirst-cluster.nvsvh.mongodb.net/Shedula-data?retryWrites=true&w=majority&appName=MyFirst-Cluster");
        console.log("connected to database");
        console.log("server running at http://localhost:3201");
    } 
    catch (err) {
        //log any error if fails to connect.
        console.log("catch error", err);
    }

})