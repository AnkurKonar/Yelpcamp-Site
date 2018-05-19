var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    
// USER SCHEMA

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);                   //Adds method to the user

module.exports = mongoose.model("User", UserSchema);        //Exports the user to the app.js 