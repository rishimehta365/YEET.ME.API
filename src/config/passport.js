const mongoose = require('mongoose'),
passport = require('passport'),
LocalStrategy = require('passport-local');

var User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'user[email_id]',
    passwordField: 'user[password]',
}, (email, password, done) => {
    User.findOne({email_id: email}).then((user) => {
        const authUser = new User(user);
        if(user) {
            authUser.validatePassword(password, authUser.password, (cb)=>{
                if(cb.flag){
                    return done(null, user);
                }
                else{
                    return done(null, false, {error: { 'email or password': 'is invalid'}});
                }
            });
        }
        else{
            return done(null, false, {error: { 'user': 'not found'}});
        }
        
    }).catch(done);
}));

passport.serializeUser((user, done) =>{
    done(null, user.id);
  });
  
passport.deserializeUser((id, done) =>{
    User.findById(id, (err, user) =>{
      done(err, user);
  });
});
