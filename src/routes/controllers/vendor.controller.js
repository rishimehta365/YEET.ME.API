const passport = require('passport'),
      Vendor = require('../../models/vendor'),
      constants = require('../../constants/constants'),
      nodemailer = require('nodemailer'),
      path = require('path'),
      Email = require('email-templates'),
      generatePassword = require('password-generator');

exports.register = async(req, res, next) => {
  const { body: { vendor } } = req;

  if(!vendor.email) {
    return res.status(422).json({
      errors: {
        email: constants.IS_REQUIRED,
      },
    });
  }

  if(!vendor.password) {
    return res.status(422).json({
      errors: {
        password: constants.IS_REQUIRED,
      },
    });
  }

  await Vendor.find({
    $or: [
      {email: vendor.email}, 
      {mobile: vendor.mobile},
      {companyName: vendor.companyName}
    ]
  }).then(async (data,err)=>{
    if(data.length>0){
      return res.status(409).json({ error: constants.VENDOR_EXIST });
    }
    else{
      const createVendor = new Vendor(vendor);
      return createVendor.save()
            .then(() => res.status(201).json({ statusMessage: constants.ON_REGISTER_SUCCESS })
            ).catch((err)=> {
              next(err);
            });
    }
  })
}

exports.login = (req, res, next) => {
  const { body: { vendor } } = req;

  if(!vendor.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!vendor.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('vendorLocal', { session: false }, (err, passportVendor, info) => {
    if(err) {
      return next(err);
    }
    if(passportVendor) {
      return res.status(200).json({vendor: passportVendor.toAuthJSON()});
    }
    return res.status(403).json({error: 'Unauthorized Access Denied!'});
  })(req, res, next);
}


exports.resetPassword = async(req, res, next) => {
  const { body: { vendor } } = req;

  if(vendor.password === vendor.newPassword){
    return res.status(400).json({error: "Cannot set current password"});
  }

  await vendor.setPassword(vendor.newPassword, (cb)=>{
    if(cb.success===constants.SUCCESS){
      vendor.set("password", cb.hash);
      console.log("New P: ", cb.hash);
    }
  });
}

exports.forgotPassword = (req, res, next) => {
  const { body : {email} } = req;
  const emailTemplate = new Email({
    preview: false,
    // uncomment below to send emails in development/test env:
    // send: true
    send: false
  }),
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'rishimehta365@gmail.com',
           pass: 'puppisinghji'
       }
   });
  Vendor.findOne({email: email.email}).then((vendor)=>{
    if(vendor){
      const updatePassword = new Vendor(vendor);
      let generatedPassword = generatePassword(8, false);
      updatePassword.setPassword(generatedPassword,(cb)=>{
        if(cb.success){
          updatePassword.set("password", cb.hash);
          Vendor.updateOne(
            { "_id": updatePassword._id}, // Filter
            {$set: {"password": updatePassword.password}}, // Update
            {upsert: true}).then((data)=>{

              emailTemplate.send({
                  template: path.join(__dirname, 'pages'),
                  locals: {
                    name: generatedPassword
                    }
                  })
              .then(data=>{
                
                const mailOptions = {
                  from: 'rishimehta365@gmail.com', // sender address
                  to: email.email, // list of receivers
                  subject: 'Password Reset', // Subject line
                  html: data.originalMessage.html // plain text body
                };
                
                transporter.sendMail(mailOptions, function (err, info) {
                  if(err){
                    return res.status(400).json("FAILED! Unable to send new password to your email.")
                  }
                  return res.status(200).json("New password has been sent successfully to your mail.")
                });
              })
              .catch(console.error);
          });
       }
    });
  }
    else{
      return res.status(400).json("Email not found. Please check.")
    }
  });
}

exports.getAllVendors = (req, res, next) => {
  return Vendor.find()
      .then((data) => {
        if(!data) {
          return res.sendStatus(400);
        }
        return res.json({vendors: data});
      });
}

exports.getVendorById = (req, res, next) => {
  return Vendor.findById(req.params.id, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json({vendor: data});
  });
}

exports.updateVendor = (req, res ,next) =>{
  const { body: { vendor } } = req;

  if(!vendor.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  return Vendor.findByIdAndUpdate(req.params.id, vendor, {new:true}, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json({vendor: data});
  });
}

