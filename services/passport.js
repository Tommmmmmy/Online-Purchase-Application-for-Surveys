const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

//the same user that we get from googleStrategy callback and done functions.
//we get the user model from the database, and then user the id to set a cookie for the user to manage the authentication. 
passport.serializeUser((user, done) => {
    done(null, user.id);
    //null means there is no error object.
    //why user id instead of googleId? Just to make sure it still works when we use Facebook oauth or others.
});

//we use the id to find the user and allow user do the following actions.
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
});

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
}, async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ googleId: profile.id })
    if (existingUser) {
        done(null, existingUser);
    } else {
        const user = await new User({ googleId: profile.id }).save();
        done(null, user);
    }
}));