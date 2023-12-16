
const express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose")
const User = require("./models/user"); 
let app = express();
const db=mongoose.connect("mongodb://127.0.0.1:27017/Users", {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

let port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Server Has Started!");
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
	secret: "Rusty is a dog",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(
	function(username, password, done) {
	  User.findOne({ username: username }, function (err, user) {
		if (err) { return done(err); }
		if (!user) { return done(null, false); }
		if (!user.verifyPassword(password)) { return done(null, false); }
		return done(null, user);
	  });
	}
  ));

//=====================
// ROUTES
//=====================

// Showing home page
app.get("/", function (req, res) {
	res.render("home.ejs");
});

// Showing secret page
app.get("/secret", isLoggedIn, function (req, res) {
	res.render("secret.ejs");
});

// Showing register form
app.get("/register", function (req, res) {
	res.render("register.ejs");
});

// Handling user signup
app.post("/register", async (req, res) => {
	const user = await User.create({
	username: req.body.username,
	password: req.body.password,

	});

	return res.status(200).json(user);
});

//Showing login form
app.get("/login", function (req, res) {
	res.render("login.ejs");
});

//Handling user login
app.post("/login", async function(req, res){
	try {
		// check if the user exists
		const user = await User.findOne({ username: req.body.username });
		if (user) {
		//check if password matches
		const result = req.body.password === user.password;
		if (result) {
			res.render("secret");
		} else {
			res.status(400).json({ error: "password doesn't match" });
		}
		} else {
		res.status(400).json({ error: "User doesn't exist" });
		}
	} catch (error) {
		res.status(400).json({ error });
	}
});

//Handling user logout 
app.get("/logout", function (req, res) {
	req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
});



function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/login.ejs");
}








// const LoginSchema=new mongoose.Schema({
//     name:{
//          type:String,
//          required:true
//     },
   
//     password:{
//         type:String,
//         required:true
//     }


// });

// const collection=new mongoose.model("Collection1",LoginSchema)

// const SignupSchema=new mongoose.Schema({
//     name:{
//          type:String,
//          required:true
//     },
//     password:{
//         type:String,
//         required:true
//     }
// });

// const collection2=new mongoose.model("Collection2",SignupSchema)

// module.exports={collection,collection2}



