const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/User.models.js");
const generateAccessToken = require("../helper/generateAccessToken.helper.js");
const generateRefreshToken = require("../helper/generateRefreshToken.helper.js");


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/api/v1.hotel/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
    console.log(accessToken, refreshToken, profile);

    let user = await User.findOne({ googleId: profile.id });
    console.log(user);

    // If user doesn't exist, create new one
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        authProvider: 'google',
        name: profile.displayName,
        email: profile.emails[0].value,
        profile: profile.photos[0].value,
        is_verified: profile.emails[0].verified,
      });
    }
    
    //Making the object plain to generate the access and refresh tokens.
    const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        role: user.role
    }

    // Attach JWT tokens
    user.accessToken = await generateAccessToken(userData);
    user.refreshToken = await generateRefreshToken(userData);

    console.log("After", user);

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// No session since you're using JWT
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
