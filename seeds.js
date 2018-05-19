var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Cloud's Rest", 
        images: "http://www.photosforclass.com/download/pixabay-548022?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Fec31b90f2af61c22d2524518b7444795ea76e5d004b0144393f4c27bafebb6_960.jpg&user=bhossfeld",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        images: "http://www.photosforclass.com/download/pixabay-1867275?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Fe83db7082af3043ed1584d05fb1d4e97e07ee3d21cac104497f6c57aa5e5b3bb_960.jpg&user=Pexels",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor", 
        images: "http://www.photosforclass.com/download/pixabay-2788677?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Feb32b9072ef3063ed1584d05fb1d4e97e07ee3d21cac104497f6c57aa5e5b3bb_960.jpg&user=jill111",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.remove({}, function(err) {
                if(err){
                    console.log(err);
                }
                console.log("removed comments!");
                 //add a few campgrounds
                data.forEach(function(seed){
                    Campground.create(seed, function(err, campground){
                        if(err){
                            console.log(err)
                        } else {
                            console.log("added a campground");
                            //create a comment
                            Comment.create(
                                {
                                    text: "This place is great, but I wish there was internet",
                                    author: "Homer"
                                }, function(err, comment){
                                    if(err){
                                        console.log(err);
                                    } else {
                                        campground.comments.push(comment);
                                        campground.save();
                                        console.log("Created new comment");
                                    }
                                });
                        }
                    });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;