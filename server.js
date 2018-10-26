// require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const socketIO = require('socket.io');
const { Users } = require('./helpers/UsersClass');
const { Global } = require('./helpers/Global');
const compression = require('compression');
const helmet = require('helmet');
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

//ssl
// const fs = require('fs');
// const path = require('path');

const container = require('./container');

// const httpsOptions = {
// 	cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
// 	key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
// };

// format code has bug. 'Just write function params inline'
container.resolve(function(users, _, admin, home, group, results, privatechat, profile, interest, news) {
	mongoose.Promise = global.Promise;
	mongoose.connect(
		'mongodb://sader:iamnickhifi3@ds141623.mlab.com:41623/sader',
		{ useMongoClient: true },
		function(err) {
			if (err) {
				return console.log('mongodb connect error: %s', err.message);
			}
			console.log('mongodb is connecting...');
		},
	);

	const app = setupExpress();

	function setupExpress() {
		const app = express();

		const server = http.createServer(app);
		//change https
		// https.createServer(httpsOptions, app).listen(3000, () => {
		// 	console.log('Listening on port 3000');
		// });
		const io = socketIO(server);

		server.listen(process.env.PORT || 3000, () => {
			console.log('Listening on port 3000');
		});

		// Use Middlewares
		configureExpress(app);

		// Set SocketIO
		require('./socket/groupchat')(io, Users);
		require('./socket/friend')(io);
		require('./socket/globalroom')(io, Global, _);
		require('./socket/privatemessage')(io);

		// Setup router
		const router = require('express-promise-router')();
		users.setRouting(router);
		admin.setRouting(router);
		home.setRouting(router);
		group.setRouting(router);
		results.setRouting(router);
		privatechat.setRouting(router);
		profile.setRouting(router);
		interest.setRouting(router);
		news.setRouting(router);

		app.use(router);

		app.use(function(req, res) {
			res.render('404');
		});

		
		
		
		
		// var blogSchema = new mongoose.Schema({
		// 	title: String,
		// 	image: String,
		// 	body: String,
		// 	created: {type: Date, default: Date.now}
		// });
		// var Blog = mongoose.model("Blog", blogSchema);
		
		// RESTFUL ROUTES
		
		
		// INDEX ROUTE
		// app.get("/blogs", function(req, res){
		//    Blog.find({}, function(err, blogs){
		// 	   if(err){
		// 		   console.log("ERROR!");
		// 	   } else {
		// 		  res.render("indexx", {blogs: blogs}); 
		// 	   }
		//    });
		// });
		
		// // NEW ROUTE
		// app.get("/blogs/new", function(req, res){
		// 	res.render("new");
		// });
		
		// // CREATE ROUTE
		// app.post("/blogs", function(req, res){
		// 	// create blog
		// 	console.log(req.body);
		// 	console.log("===========")
		// 	console.log(req.body);
		// 	Blog.create(req.body.blog, function(err, newBlog){
		// 		if(err){
		// 			res.render("new");
		// 		} else {
		// 			//then, redirect to the index
		// 			res.redirect("/blogs");
		// 		}
		// 	});
		// });
		
		// // SHOW ROUTE
		// app.get("/blogs/:id", function(req, res){
		//    Blog.findById(req.params.id, function(err, foundBlog){
		// 	   if(err){
		// 		   res.redirect("/blogs");
		// 	   } else {
		// 		   res.render("show", {blog: foundBlog});
		// 	   }
		//    })
		// });
		
		// // EDIT ROUTE
		// app.get("/blogs/:id/edit", function(req, res){
		// 	Blog.findById(req.params.id, function(err, foundBlog){
		// 		if(err){
		// 			res.redirect("/blogs");
		// 		} else {
		// 			res.render("edit", {blog: foundBlog});
		// 		}
		// 	});
		// })
		
		
		// // UPDATE ROUTE
		// app.put("/blogs/:id", function(req, res){
		// 	req.body.blog.body = req.sanitize(req.body.blog.body)
		//    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		// 	  if(err){
		// 		  res.redirect("/blogs");
		// 	  }  else {
		// 		  res.redirect("/blogs/" + req.params.id);
		// 	  }
		//    });
		// });
		
		// // DELETE ROUTE
		// app.delete("/blogs/:id", function(req, res){
		//    //destroy blog
		//    Blog.findByIdAndRemove(req.params.id, function(err){
		// 	   if(err){
		// 		   res.redirect("/blogs");
		// 	   } else {
		// 		   res.redirect("/blogs");
		// 	   }
		//    })
		//    //redirect somewhere
		// });









	}

	function configureExpress(app) {
		app.use(compression());
		app.use(helmet());

		require('./passport/passport-local');
		require('./passport/passport-facebook');
		require('./passport/passport-google');

		app.use(express.static('public'));
		app.use(cookieParser());
		app.set('view engine', 'ejs');
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(expressSanitizer());
		app.use(methodOverride("_method"));

		app.use(validator());

		app.use(
			session({
				secret: 'thisisasecretkey',
				resave: true,
				saveUninitialized: true,
				store: new MongoStore({
					mongooseConnection: mongoose.connection,
				}),
			}),
		);

		app.use(flash());

		app.use(passport.initialize());
		app.use(passport.session());

		// ejs can use lodash
		app.locals._ = _;
	}
});
