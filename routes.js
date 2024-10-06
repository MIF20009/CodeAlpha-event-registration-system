const express = require("express");
const router = express.Router();
const {Event, Registration, User} = require("./models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secret = "mostafa"

//creating user
router.post("/registration", async (req,res) => {
    const {userFullName, username, password} = req.body;
    const existingUser = await User.findOne({username});
    if (existingUser){
        return res.status(400).json({message : "This username already exists. "});
    }
    const hashedPass = await bcrypt.hash(password,10);
    const user = new User({
        userFullName,
        username,
        password : hashedPass,
        role : "user",
    })
    await user.save();
    res.status(202).json({message : "User registered successfully. "});
});

//login
router.post("/login", async (req,res) => {
    const {username, password} = req.body;
    const existingUsername = await User.findOne({username});
    if (!existingUsername){
        return res.status(400).json({message : "Invalid username or password. "});
    }
    const passwordsMatch = await bcrypt.compare(password, existingUsername.password);
    if (!passwordsMatch){
        return res.status(400).json({message : "Invalid username or password. "});
    }
    const token = jwt.sign({userID : existingUsername._id, role: existingUsername.role},secret,{expiresIn : "1h"});
    res.json({token});
});

//Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1] //bearer token format
    if (!token){
        return res.status(401).json({message : "Access denied, no token provided. "});
    }
    try{
        const verified = jwt.verify(token, secret);
        req.user = verified ; 
        next();
    } catch(err){
        res.status(400).json({message : "Invalid token. "});
    }
};

//registering events only for autheticated users
router.post("/register-for-event",authenticateToken, async (req,res) => {
    const registration = new Registration({
        eventID : req.body.eventID,
        userID : req.user.userID,
    });
    await registration.save();
    res.status(201).json({message : "Registered for event. "});
});

//Viewing events
router.get("/view-events", authenticateToken, async (req,res) => {
    const events = await Event.find();
    res.json(events);
});

//Posting events only from admin
router.post("/create-event", authenticateToken, async (req,res) => {
    if (req.user.role != "admin"){
        return res.status(403).json({message : "Access denied. "});
    }
    const {title, date, location} = req.body;
    const event = new Event({
        title,
        date,
        location,
    });
    await event.save();
    res.status(201).json({message : "Event created successfully. "});
});

//Viewing registrations for specific user 
router.get("/view-user-events", authenticateToken, async (req,res) => {
    const userId = req.user.userID;
    const events = await Registration.find({userID : userId}).populate("eventID");
    res.json({events});
});

//Deleting user registration
router.delete("/cancel-registration/:registrationID", authenticateToken, async (req,res) => {
    const regId = req.params.registrationID;
    const registration = await Registration.findOne({_id : regId, userID : req.user.userID});
    if (!registration){
        return res.status(404).json({message : "Registration not found, or you are not allowed to delete it. "});
    }
    await Registration.deleteOne({_id : regId});
    res.status(200).json({message : "Registration deleted. "});
});

//check admin
router.get("/check-admin", authenticateToken, async (req,res) => {
    if (req.user.role == "admin"){
        res.json({isAdmin : true});
    } else{
        res.status(403).json({message : "Access denied. Admins only. "});
    }
});

module.exports = router;