const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title : String,
    date : Date,
    location : String,
});

const registrationSchema = new mongoose.Schema({
    eventID : {type : mongoose.Schema.Types.ObjectId, ref : "Event"},
    userFullName : String,
    userEmail : String, 
});

const Event = mongoose.model("Event",eventSchema);
const Registration = mongoose.model("Registration",registrationSchema);

module.exports = {Event,Registration};  