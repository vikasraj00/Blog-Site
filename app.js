var expressSanitizer = require("express-sanitizer");
    methodOverride   = require("method-override"),
    bodyParser       = require("body-parser");
    mongoose         = require("mongoose");
    express          = require("express");
    app              = express();


// App Config
mongoose.connect("mongodb://localhost:27017/blogApp",{ useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
mongoose.set('useFindAndModify', false);
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");


// Mongoose/Model Config
var blogSchema = new mongoose.Schema({
title: String,
image: String,
body: String,
created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);


// Restful Routes
app.get("/", function(req, res){
    res.redirect("/blogs");
});

// Index Route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error!")
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    })
});


// New Route
app.get("/blogs/new", function(req, res){
    res.render("new");
});


// Create Route
app.post("/blogs", function(req, res){
    // Sanitize Body Input
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // Create Blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            console.log("Error!");
            console.log(err);
            res.render("new");
        } else {
            // Redirect to Index
            res.redirect("/blogs")
        }
    });
});


// Show Route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});


// Edit Route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});


// Update Route
app.put("/blogs/:id", function(req, res) {
    // Sanitize Body Input
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// Delete Route
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err, updatedBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});


app.listen(3000, function(){
    console.log("The Server Has Started on Port 3000");
});

