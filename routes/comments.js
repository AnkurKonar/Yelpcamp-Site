var express =  require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// NEW COMMENTS ROUTE

router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err)
       {
           console.log(err);
       }
       else{
           res.render("comments/new",{campground: foundCampground});
       }
    });
});

// POST COMMENT ROUTE

router.post("/", middleware.isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
       if(err)
       {
           console.log(err);
           res.redirect("/campgrounds/:id");
       }
       else{
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   req.flash("error", "Something went Wrong!");
                   console.log(err);
               }
               else{
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    req.flash("success", "Sucessfully added comment!");
                    res.redirect("/campgrounds/" + foundCampground._id);   
               }
           });
       }
    });
});

// EDIT COMMENT ROUTE

router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});
    });
});

// UPDATE COMMENT ROUTE

router.put("/:comment_id", middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           req.flash("success", "Updated Comment!");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// DESTROY COMMENT ROUTE

router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            req.flash("success", "Comment Deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    }); 
});


module.exports = router;
