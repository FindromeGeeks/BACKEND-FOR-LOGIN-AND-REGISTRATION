const express=require("express")
const router=express.Router()
const bcrypt=require('bcrypt')
const User = require('../models/user');
router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if the user already exists in the database
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }
  
      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user instance and save it to the database
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();
  
      res.status(201).json({ message: "Registration successful." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Registration failed." });
    }
  });
  
  
  // Login Route
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find the user by username in the database
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(400).json({ message: "User not found." });
      }
  
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password." });
      }
  
      // Here, you can implement session management or token-based authentication
  
      res.status(200).json({ message: "Login successful." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Login failed." });
    }
  });
  
module.exports=router






// const controller=require("../authcontroller/authcontroller")

// router.post("/register",authcontroller.register)



// const passport=require('passport');
// const  GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

// passport.use(new GoogleStrategy({
//     clientID:     GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://yourdomain:3000/auth/google/callback",
//     passReqToCallback   : true
//   },
//   function(request, accessToken, refreshToken, profile, done) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));