const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title : String,
    date : Date,
    location : String,
});

const registrationSchema = new mongoose.Schema({
    eventID : {type : mongoose.Schema.Types.ObjectId, ref : "Event"},
    userID : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
});

const userSchema = new mongoose.Schema({
    userFullName : String,
    username : {type: String, unique: true},
    password : String,
    role : {type : String, default : "user"},
});

const Event = mongoose.model("Event",eventSchema);
const Registration = mongoose.model("Registration",registrationSchema);
const User = mongoose.model("User",userSchema);

module.exports = {Event,Registration,User};  