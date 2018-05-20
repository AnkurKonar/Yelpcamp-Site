var express = require("express"),                   //Initializing express
    app = express(),                                //Setting app as express function
    bodyParser = require("body-parser"),            //Including body-parser
    mongoose = require("mongoose"),                 //Including the mongoose odm
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campgrounds"),   //Including the campgroundSchema js file
    Comment = require("./models/comment"),
    seedDB = require("./seeds"),
    User = require("./models/user");
    
// REQUIRING ROUTES
    
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

mongoose.connect('mongodb://localhost/yelp_camp');

app.use(bodyParser.urlencoded({extended: true}));   //Uses teh body parser engine
app.set("view engine", "ejs");                      //To control the ejs engine
app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

// Seed the database

// seedDB();    

// PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "Welcome to the Joker's kingdom",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.updated = req.flash("updated");
    next();
});


app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);              // appends /campgrounds to all campground routes
app.use("/campgrounds/:id/comments", commentRoutes);


//To start the server

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!!!");
});