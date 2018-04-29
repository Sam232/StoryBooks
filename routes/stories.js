const router = require("express").Router();
const {ObjectID} = require("mongodb");

const {ensureAuthentication} = require("../helper/auth");

const {Story} = require("../models/Stories");
const {User} = require("../models/Users");

router.get("/", (req, res) => {
  Story.find({status: "public"})
  .populate("user")
  .sort({date: "desc"})
  .then((stories) => {
    if(stories.length > 0){
      return res.render("stories/index", {
        stories
      });
    }
    req.flash("success_msg", "No Public Stories Added");
    res.render("stories/index");
  })
  .catch((err) => {
    if(err){
      console.log("Unable To Fetch Public Stories", err);
    }
  });  
});

router.get("/user/:id", (req, res) => {
  var userId = req.params.id;

  Story.find({status: "public"}).populate("user").then((stories) => {
    if(stories.length > 0){
      var userStories = stories.filter((story) => {
        if(story.user._id.toHexString() === userId){
          return story;
        }
      });
      console.log(userStories)
      if(userStories.length > 0){
        return res.render("stories/index", {
          stories: userStories
        });
      }
      req.flash("error_msg", "This User Has Not Added Any Stories Yet.");
      res.redirect("/stories/");
    }
    req.flash("error_msg", "This User Has Not Added Any Stories Yet.");
    res.redirect("/stories/");
  })
  .catch((err) => {
    if(err){
      console.log("Unable To Fetch Stories", err);
    }
  });
});

router.get("/my", ensureAuthentication, (req, res) => {
  Story.find().populate("user").then((stories) => {
    if(stories.length > 0){
      var userStories = stories.filter((story) => {
        if(story.user._id.toHexString() === res.locals.user._id.toHexString()){
          return story;
        }
      });
     
      if(userStories.length > 0){
        return res.render("stories/index", {
          stories: userStories
        });
      }
      req.flash("error_msg", "This User Has Not Added Any Stories Yet.");
      res.redirect("/stories/");
    }
    req.flash("error_msg", "This User Has Not Added Any Stories Yet.");
    res.redirect("/stories/");
  })
  .catch((err) => {
    if(err){
      console.log("Unable To Fetch Stories", err);
    }
  });
});

router.get("/add", ensureAuthentication, (req, res) => {
  res.render("stories/add");
});

router.get("/edit", ensureAuthentication, (req, res) => {
  res.render("stories/edit");
});

router.get("/show/:id", (req, res) => {
  var storyId = req.params.id;

  if(ObjectID.isValid(storyId)){
    return Story.findOne({
      _id: storyId
    }).populate("user").populate("comments.commentUser").then((story) => {
      var userId = res.locals.user ? res.locals.user._id.toHexString() : "";

      if(story && story.status == "public"){
        return res.render("stories/show", {
          _id: story._id,
          title: story.title,
          body: story.body,
          userDetails: story.user,
          allowComment: story.allowComment,
          comments: story.comments.lenght === 0 ? null : story.comments,
          commentUser: story.commentUser,
          date: story.date
        });
      }
      else if(story && story.status == "private" && story.user._id.toHexString() == userId){
        return res.render("stories/show", {
          _id: story._id,
          title: story.title,
          body: story.body,
          userDetails: story.user,
          allowComment: story.allowComment,
          comments: story.comments.lenght === 0 ? null : story.comments,
          commentUser: story.commentUser,
          date: story.date
        });
      }
      else{
        req.flash("error_msg", "Not Authorized");
        res.redirect("/stories/");
      }
      
    })
    .catch((err) => {
      if(err){
        console.log("Unable To Fetch Story", err);
      }
    });
  }

  req.flash("error_msg", "Invalid Story Provided");
  res.redirect("/stories/");
});

router.get("/edit/:id", ensureAuthentication, (req, res) => {
  var storyId = req.params.id;

  if(ObjectID.isValid(storyId)){
    return Story.findById(storyId)
      .populate("user")
      .then((story) => {
        if(story){
          if(story.user._id.toHexString() === res.locals.user._id.toHexString()){
            return res.render("stories/edit", {
              story
            });
          }
          req.flash("error_msg", "Not Authorized.");
          res.redirect("/stories/");
        }
        else{
          req.flash("error_msg", "No Story\'s Id Matches The Provided Id.");
          res.redirect("/dashboard");
        }
        
      })
      .catch((err) => {
        if(err){
          console.log("Unable To Fetch User\'s Story", err);
        }
      });
  }
  req.flash("error_msg", "Invalid Story ID Provided");
  res.redirect("/dashboard");
})

router.post("/", (req, res) => {
  var newStory = {
    title: req.body.title,
    status: req.body.status,
    allowComment: req.body.allowComment === "on" ? true : false,
    body: req.body.body,
    user: res.locals.user._id
  }

  Story.findOne({
    user: res.locals.user._id,
    title: newStory.title
  }).then((story) => {
    if(story){
      req.flash("error_msg", "Title Of Story Already Exist");
      return res.redirect("/stories/add");
    }

    new Story(newStory).save().then((story) => {
      if(story){
        req.flash("success_msg", "New Story Added");
        return res.redirect(`/stories/show/${story._id}`);
      }

      req.flash("error_msg", "Unable To Add New Story, Try Again");
      res.redirect("/stories/add");
    })
    .catch((err) => {
      if(err){
        console.log("Unable To Add New Story", err);
      }
    });
  })
  .catch((err) => {
    if(err){
      console.log("Unable To Fetch Story", err);
    }
  });
});

router.post("/add/comment/:id", (req, res) => {
  var story = {
    id: req.params.id,
    body: req.body.userComment,
    date: Date.now(),
    user: res.locals.user._id
  };

  if(ObjectID.isValid(story.id)){
    return Story.findById(story.id).then((fetchedStory) => {
      if(fetchedStory){
        var allComments = fetchedStory.comments;
        allComments.unshift({
          commentBody: story.body,
          commentDate: story.date,
          commentUser: story.user
        });
        return Story.findByIdAndUpdate(story.id, {
          $set: {
            comments: allComments        
          }
        }, {new: true}).then((story) => {
          if(story){
            req.flash("success_msg", "New Comment Submitted");
            return res.redirect(`/stories/show/${story._id}`);
          }
          res.flash("error_msg", "Unable To Add Comment, Try Again");
          res.redirect(`stories/show/${story._id}`);
        })
        .catch((err) => {
          if(err){
            console.log("Unable To Fetch User\'s Story.", err);
          }
        });
      }
      req.flash("error_msg", "The Provided ID Does Not Match Any Story\'s ID");
      res.redirect("/stories/add");
    })
    .catch((err) => {
      if(err){
        console.log("Unable To Fetch User\'s Story.", err);
      }
    });
  }

});

router.put("/update/:id", ensureAuthentication, (req, res) => {
  storyUpdate = {
    id: req.params.id,
    title: req.body.title,
    status: req.body.status,
    allowComment: req.body.allowComment,
    body: req.body.body,
    date: Date.now()
  };

  if(ObjectID.isValid(storyUpdate.id)){
    return Story.findById(storyUpdate.id).then((story) => {
      if(story){
        return Story.findByIdAndUpdate(storyUpdate.id, {
          $set: {
            title: storyUpdate.title,
            status: storyUpdate.status,
            allowComment: storyUpdate.allowComment === "on" ? true : false,
            body: storyUpdate.body,
            date: Date.now()
          }          
        }, {new: true}).then((updatedStory) => {
          if(updatedStory){
            req.flash("success_msg", "Update Successful");
            return res.redirect("/dashboard");
          }
          req.flash("error_msg", "Update Unsuccessful");
          res.redirect("/dashboard");
        })
        .catch((err) => {
          if(err){
            console.log("Unable To Update User\'s Story", err);
          }
        });
      }
      req.flash("error_msg", "No Story's Id Matches The Provided Id.");
      res.redirect("/dashboard");
    })
    .catch((err) => {
      if(err){
        console.log("Unable To Fetch Users Story", err);
      }
    })
  }
  req.flash("error_msg", "Invalid Story ID Provided");
  res.redirect("/dashboard");
});

router.delete("/delete/:id", ensureAuthentication, (req, res) => {
  var storyId = req.params.id;

  if(ObjectID.isValid(storyId)){
    return Story.findById(storyId).then((story) => {
        if(story){
          return Story.findByIdAndRemove(storyId).then((deletedStory) => {
            if(deletedStory){
              req.flash("success_msg", "Delete Successful");
              return res.redirect("/dashboard");
            }
            req.flash("error_msg", "Unable To Delete Your Story");
            res.redirect("/dashboard");
          })
          .catch((err) => {
            if(err){
              console.log("Unable To Delete User\'s Story", err);
            }
          });
        }
        req.flash("error_msg", "No Story's Id Matches The Provided Id.");
        res.redirect("/dashboard");
      }
    )
    .catch((err) => {
      if(err){
        console.log("Unable To Fetch User\'s Story", err);
      }
    });    
  }
  req.flash("error_msg", "Invalid Story ID Provided");
  res.redirect("/dashboard");
});

module.exports = router;