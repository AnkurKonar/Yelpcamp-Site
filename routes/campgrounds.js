var express =  require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//INDEX - Route to the campgrounds

router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex}, function(err, allcampgrounds){
        if(err)
        {
            console.log("Error");
        }
        else{
            if(allcampgrounds.length < 1) {
                  noMatch = "No campgrounds match that query, please try again.";
            }
            res.render("campgrounds/index",{campgrounds:allcampgrounds, searchTerm: req.query.search, noMatch: noMatch}); 
        }
      });
    } else{
        //Get all Campgrounds from the DB
      Campground.find({}, function(err, allcampgrounds){
        if(err)
        {
            console.log("Error");
        }
        else{
           res.render("campgrounds/index", {campgrounds: allcampgrounds, currentUser: req.user, page: 'campgrounds', searchTerm: null, noMatch: noMatch}); 
        }
      });  
    }
});

//NEW - Route to the page for making a new campground

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//CREATE - Post route to add new campgrounds

router.post("/", middleware.isLoggedIn, function(req, res){
   //get data from form and add to campgrounds array
    var newName= req.body.name;
    var image = req.body.url;
    var newDes = req.body.des;
    var newPrice = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: newName, images: image, description: newDes, price: newPrice, author: author};
    Campground.create(newCampground , function(err, newlycreated){
        if(err)
        {
            console.log("Error inserting new campground");
            req.flash("error", "Couldn't create new Campground!");
        }
        else{
            req.flash("success", "Created new Campground!");
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//SHOW - More information on selected campground

router.get("/:id",function(req, res){
    //find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            //render show template with that campground
            res.render("campgrounds/show",{campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE

router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res){
    
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});    
        });   
});

// UPDATE CAMPGROUND ROUTE

router.put("/:id", middleware.checkCampgroundOwner, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground ,function(err, updatedCampground){
      if(err){
          req.flash("error", "Couldn't update Campground!");
          res.redirect("/campgrounds");
      } else {
          req.flash("success", "Updated Campground!");
          res.redirect("/campgrounds/" + req.params.id);
      }
    });
});

// DELETE CAMPGROUND ROUTE

router.delete("/:id", middleware.checkCampgroundOwner, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Couldn't delete Campground!");
            res.redirect("/campgrounds");
        } else{
            req.flash("error", "Deleted Campground!");
            res.redirect("/campgrounds");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;

