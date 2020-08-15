const mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  GoogleStrategy = require("passport-google-oauth2");

var Customer = require("../models/customer"),
  Vendor = require("../models/vendor");

passport.use(
  "customerLocal",
  new LocalStrategy(
    {
      usernameField: "customer[email]",
      passwordField: "customer[password]",
    },
    (email, password, done) => {
      Customer.findOne({ email: email })
        .then((customer) => {
          const authCustomer = new Customer(customer);
          if (customer) {
            authCustomer.validatePassword(
              password,
              authCustomer.password,
              (cb) => {
                if (cb.flag) {
                  return done(null, customer);
                } else {
                  return done(null, false, {
                    error: { "email or password": "is invalid" },
                  });
                }
              }
            );
          } else {
            return done(null, false, { error: { customer: "not found" } });
          }
        })
        .catch(done);
    }
  )
);

passport.use(
  "vendorLocal",
  new LocalStrategy(
    {
      usernameField: "vendor[email]",
      passwordField: "vendor[password]",
    },
    (email, password, done) => {
      email, password;
      Vendor.findOne({ email: email })
        .then((vendor) => {
          const authVendor = new Vendor(vendor);
          if (vendor) {
            authVendor.validatePassword(password, authVendor.password, (cb) => {
              if (cb.flag) {
                return done(null, vendor);
              } else {
                return done(null, false, {
                  error: { "email or password": "is invalid" },
                });
              }
            });
          } else {
            return done(null, false, { error: { vendor: "not found" } });
          }
        })
        .catch(done);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "390242058357-tnqu35rp7bij682da18ubv3edv19tdds.apps.googleusercontent.com",
      clientSecret: "hV4mCHBG07DoJc5DN7byUFay",
      callbackURL: "http://localhost:3000/api/v1/vendor/googleOAuth/redirect",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      Vendor.findOne({ email: profile.email })
        .exec()
        .then((vendor) => {
          if (vendor) {
            done(null, vendor);
          } else {
            let vendor = {
              email: profile.email,
              email_is_verified: profile.email_verified,
              firstName: profile.given_name,
              lastName: profile.family_name,
            };

            const createVendor = new Vendor(vendor);
            createVendor
              .save()
              .then((data) => done(null, data))
              .catch((err) => done(err));
          }
        })
        .catch((error) => done(error));
    }
  )
);

passport.serializeUser((customer, done) => {
  done(null, customer.id);
});

passport.deserializeUser((id, done) => {
  customer.findById(id, (err, customer) => {
    done(err, customer);
  });
});
