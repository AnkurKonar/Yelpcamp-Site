var express =  require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
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
    var newUser = new User({username: req.body.username});
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
        })
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

//Function to check if user logged in - Middleware

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}




module.exports = router;