var express =  require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var request = require("request");
var async = require("async");
var nodeMailer = require("nodemailer");
var crypto = require("crypto");
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var User = require("../models/user");



//Route to the landing page

router.get("/", function(req, res){
    res.render("landing");
});



// ============
// AUTH ROUTES
// ============


// show register form

router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});

router.post("/register", function(req, res){
    const captcha = req.body["g-recaptcha-response"];
    if (!captcha) {
      console.log(req.body);
      req.flash("error", "Please select captcha");
      return res.redirect("/register");
    }
     // secret key
    var secretKey = process.env.CAPTCHA;
    // Verify URL
    var verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;
    // Make request to Verify URL
    request.get(verifyURL, (err, response, body) => {
      // if not successful
      if (body.success !== undefined && !body.success) {
        req.flash("error", "Captcha Failed");
        return res.redirect("/register");
      }
        var newUser = new User({
             username: req.body.username, 
             firstname: req.body.firstname, 
             lastname: req.body.lastname, 
             email: req.body.email, 
             avatar: req.body.avatar
            });
        if(req.body.adminCode == "secretcode123"){
            newUser.isadmin = true;
        }
        User.register( newUser, req.body.password, function(err, user){
            if(err){
                req.flash("error", err.message);
                return res.redirect("/register");
            }
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to yelpcamp, " + user.username + ".");
                res.redirect("/campgrounds");
            });
        });
    });
});

// Show login form

router.get("/login", function(req, res){
    res.render("login", {page: 'login'});
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// LOGOUT

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

// USER PROFILES

router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
       if(err){
           req.flash("error","Something went wrong!");
           res.redirect("/campgrounds");
       } else{
           Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
               if(err){
                    req.flash("error","Something went wrong!");
                    res.redirect("/campgrounds");
               } else{
                  res.render("users/show", {user: foundUser, campgrounds: campgrounds}); 
               }
           });
       }
    });
});

//Function to check if user logged in - Middleware

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}




module.exports = router;