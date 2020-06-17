const mongoose = require('mongoose'),
passport = require('passport'),
LocalStrategy = require('passport-local');

var User = require('../models/user'),
    {Vendor} = require('../models/vendor');

passport.use('userLocal',new LocalStrategy({
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

passport.use('vendorLocal',new LocalStrategy({
    usernameField: 'vendor[email_id]',
    passwordField: 'vendor[password]',
}, (email, password, done) => {
    Vendor.findOne({email_id: email}).then((vendor) => {
        const authVendor = new Vendor(vendor);
        if(vendor) {
            authVendor.validatePassword(password, authVendor.password, (cb)=>{
                if(cb.flag){
                    return done(null, vendor);
                }
                else{
                    return done(null, false, {error: { 'email or password': 'is invalid'}});
                }
            });
        }
        else{
            return done(null, false, {error: { 'vendor': 'not found'}});
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
