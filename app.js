var bodyParser = require("body-parser");
    mongoose   = require("mongoose");
    express    = require("express");
    app        = express();


// App Config
mongoose.connect("mongodb://localhost:27017/blogApp",{ useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));


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

app.listen(3000, function(){
    console.log("The Server Has Started on Port 3000");
});

