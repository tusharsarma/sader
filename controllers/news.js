mongoose=require('mongoose');
module.exports = function(async, Club, _, Users, Message, FriendResult) {
	var blogSchema = new mongoose.Schema({
		title: String,
		image: String,
		body: String,
		created: {type: Date, default: Date.now}
	});
	var Blog = mongoose.model("Blog", blogSchema);
	return {
		setRouting: function(router) {
			//router.get('/latest-football-news', this.footballNews);
			
 // INDEX ROUTE
 router.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
           res.render("indexx", {blogs: blogs, title: 'Sader - Latest News', user: req.user }); 
        }
    });
 });
 
 // NEW ROUTE
 router.get("/blogs/new", function(req, res){
     res.render("new", { title: 'Sader - Latest News', user: req.user });
 });
 
 // CREATE ROUTE
 router.post("/blogs", function(req, res){
     // create blog
     console.log(req.body);
     console.log("===========")
     console.log(req.body);
     Blog.create(req.body.blog, function(err, newBlog){
         if(err){
             res.render("new", { title: 'Sader - Latest News', user: req.user });
         } else {
             //then, redirect to the index
             res.redirect("/blogs");
         }
     });
 });
 
 // SHOW ROUTE
 router.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog , title: 'Sader - Latest News', user: req.user });
        }
    })
 });
 
 // EDIT ROUTE
 router.get("/blogs/:id/edit", function(req, res){
     Blog.findById(req.params.id, function(err, foundBlog){
         if(err){
             res.redirect("/blogs");
         } else {
             res.render("edit", {blog: foundBlog});
         }
     });
 })
 
 
 // UPDATE ROUTE
 router.put("/blogs/:id", function(req, res){
     req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err){
           res.redirect("/blogs");
       }  else {
           res.redirect("/blogs/" + req.params.id);
       }
    });
 });
 
 // DELETE ROUTE
 router.delete("/blogs/:id", function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
    //redirect somewhere
 });
 
		},
		footballNews: function(req, res) {
			res.render('news/footballnews', { title: 'Sader - Latest News', user: req.user });
		},
	};
};
