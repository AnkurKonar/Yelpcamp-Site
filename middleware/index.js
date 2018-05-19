var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

// All the middleware goes here

var middlewareObject = {};

middlewareObject.checkCampgroundOwner = function(req, res, next){
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found!");
                res.redirect("back");
            } else {
                    // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                    if (!foundCampground) {
                        req.flash("error", "Item not found.");
                        return res.redirect("back");
                    }
                    // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
 
                    //does the user own the campground?
                if(foundCampground.author.id.equals(req.user._id))
                {
                    next();   
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
                
            }
        });   
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};


middlewareObject.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                  if (!foundComment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
 
                //does the user own the comment?
                if(foundComment.author.id.equals(req.user._id))
                {
                    next();   
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
                
            }
        });   
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

//To check the user if logged in

middlewareObject.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};



module.exports = middlewareObject;