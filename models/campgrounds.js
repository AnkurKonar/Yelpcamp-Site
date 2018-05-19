var mongoose = require("mongoose");

//SCHEMA setup

var campgroundSchema = new mongoose.Schema({
   name: String,
   images: String,
   description: String,
   price: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Campground", campgroundSchema);