//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

//connection method for mongoose
mongoose.connect("mongodb://localhost:27017/PostsDB", {
  useNewUrlParser: true
});

// Create Mongoose Schema - a structure/ blueprint for what the document requires before being added to the collection of the PostsDB
const postSchema = new mongoose.Schema({
  blogTitle: { type: String, required: [true, "A title is required to post"] },
  blogContent: {
    type: String,
    required: [true, "You must include content to post"]
  }
});

// create Mongoose Model - specify the singular form of the collection Posts
// mongoose creates the collection Posts from the single word Post below
// the Model can be basically seen as the collection
const Post = mongoose.model("Post", postSchema);

// create a single post
const post1 = new Post({
  blogTitle: "coolMan",
  blogContent: "Totally awesome Cowabunga Excellent"
});

const post2 = new Post({
  blogTitle: "The Dude",
  blogContent: "Wasssup my wigger"
});

// post1.save(); // this saves a single post into the described collection

// saves many documents below
// Post.insertMany([post1, post2], function(err){
//     if (err) {
//       console.log(err)
//     } else {
//       console.log("successfully saved all posts to the Posts collection in the PostsDB");
//     }
// });

// READ or Retrieve = Find
// Post.find((err, posts) => {
//   if (err) {
//     console.log(err);
//   } else {
//     posts.forEach(post => {
//       console.log(post.blogTitle + ": " + post.blogContent);
//     });
//     mongoose.connection.close(); // closes mongoose conenction
//   }
// });

// UPDATE
// Post.updateMany(
//   { blogTitle: "Cool Man" },
//   { blogContent: "Cool Man is hungry for butts.  Wait...no I..." },
//   function(err) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Update Succesful");
//     }
//   }
// );

// DELETE
// Post.deleteOne({ blogTitle: "The Dude" }, function(err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Delete Succesful");
//   }
// });

// code that happens before database
const homeStartingContent = "Check out my Most Recent Posts!";
const aboutContent =
  "Everyone needs a good joke in their life.  This site is a growing collections of some terrible ones for you to enjoy.  We built this site for the happy ones who try not to take life too seriously!  Got a good one?  Please feel free to share if you'd like!  We'd love to hate it.  :)";
const contactContent =
  "Feel free to contact me regarding any of these terrible jokes.  If you would like to add a joke please go ahead and click the compose button below and you will be taken to the compose page. If you would like to report an obscene joke make by a previous guest of this site please contact me via the Email button below.  Thank you!";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// array holding posts
// let posts = [];

app.get("/", function(req, res) {
  Post.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      // let Title = posts.blogTitle;
      // let Content = posts.blogContent;

      res.render("home", {
        mainParagraph: homeStartingContent,
        posts: posts
        // postTitle: Title,
        // postContent: Content,
      });
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    mainParagraph: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", { mainParagraph: contactContent });
});

app.get("/compose", function(req, res) {
  let newText = req.body.newText;
  console.log(newText);
  res.render("compose", { mainParagraph: contactContent });
});

// Opening up an inidividual post - to the post.ejs page
app.get("/posts/:post", (req, res) => {
  let desiredPost = req.params.post;

  Post.findOne({ blogTitle: desiredPost }, (err, post) => {
    if (err) {
      console.log(err);
    } else {
      // let title = _.lowerCase(post.blogTitle);

      // if (title === _.lowerCase(req.params.post)) {
      //   console.log("match found");

        res.render("post", {
          title: _.upperCase(post.blogTitle),
          post: post.blogContent,
        });
      }
    
  });
});

// Post --pushes new posts to blog page
app.post("/compose", function(req, res) {
  let postName = req.body.postName;
  let postBody = req.body.postBody;

  // object holding posts and post titles

  const post1 = new Post({
    blogTitle: postName,
    blogContent: postBody
  });

  post1.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("successfully added composition");
      //posts.push(post);
      res.redirect("/");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
