const passport = require('passport'),
      Vendor = require('../../models/vendor'),
      constants = require('../../constants/constants'),
      nodemailer = require('nodemailer'),
      path = require('path'),
      Email = require('email-templates'),
      generatePassword = require('password-generator'),
      PubSub = require('pubsub-js');



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
      {mobile: vendor.mobile}
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
    return res.status(403).json({message:'Incorrect username or password.'});
  })(req, res, next);
}

exports.googleAuth = (req,res,next)=>{
  passport.authenticate('google', {
    scope: ['profile','email']
  })(req, res, next);
}


exports.googleAuthRedirect = (req, res, next) =>{
  passport.authenticate('google', (err, passportVendor, info) => {
    if(err) {
      return next(err);
    }
    if(passportVendor) {
      //return res.status(200).json({vendor: passportVendor.toAuthJSON()});
    var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
    responseHTML = responseHTML.replace('%value%', JSON.stringify({
      vendor: passportVendor.toAuthJSON()
    }));
    res.status(200).send(responseHTML);
    }
    return res.status(401).json({message:'Unauthorized!'});
  })(req, res, next);
}

exports.googleOAuth20 = (req, res, next) =>{

  const { body: { vendor } } = req;
  
  Vendor.findOne({email: vendor.email})
    .exec()
    .then((data)=>{
        if(data){
          return res.status(200).json({vendor: data.toAuthJSON()});
        }
        else{
            const createVendor = new Vendor(vendor);
            createVendor.save()
            .then((data) => {
              return res.status(200).json({vendor: createVendor.toAuthJSON()});
            })
            .catch((err)=> next(err));
        }
    })
    .catch((error)=>next(error))
  }

/*
* Reset Password:
* verifies the email or vendor id, entered password
* is updated for the respective vendor.
*
* author: Raunak Bhansali 
*/
exports.resetPassword = async(req, res, next) => {
  const { body: { vendor } } = req;
  Vendor.findOne({email: vendor.email}).then((vendorData)=>{
    if(vendorData){
      const updatePassword = new Vendor(vendorData);
      updatePassword.validatePassword(vendor.password, vendorData.password, (cb)=>{
        if(cb.flag){
          if(vendor.password === vendor.newPassword){
            return res.status(400).json({message: "Cannot set last password as current password"});
          }
          updatePassword.setPassword(vendor.newPassword,(cb)=>{
            if(cb.flag){
              updatePassword.set("password", cb.hash);
              Vendor.updateOne(
                { "_id": updatePassword._id}, // Filter
                {$set: {"password": updatePassword.password}}, // Update
                {upsert: true}).then((data)=>{
                  if(data){
                    return res.status(200).json({message: "password reset successfully"});
                  }
              });
           }
        });
        }
        else{
          return res.status(403).json({message: "please check current password"});
        }
      });
  }
    else{
      return res.status(400).json({message: "Email not found. Please check."})
    }
  });
}

/*
* Forgot Password:
* verifies the email, if exists a new password
* is created and sends to provided email.
*
* author: Raunak Bhansali 
*/
exports.forgotPassword = (req, res, next) => {
  const { body : { vendor } } = req;

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

  Vendor.findOne({email: vendor.email}).then((vendorData)=>{
    if(vendorData){
      const updatePassword = new Vendor(vendorData);
      let generatedPassword = generatePassword(8, false);
      updatePassword.setPassword(generatedPassword,(cb)=>{
        if(cb.flag){
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
                  to: vendor.email, // list of receivers
                  subject: 'Password Reset', // Subject line
                  html: data.originalMessage.html // plain text body
                };
                
                transporter.sendMail(mailOptions, function (err, info) {
                  if(err){
                    return res.status(400).json({message: "FAILED! Unable to send new password to your email."});
                  }
                  return res.status(200).json({message: "New password has been sent successfully to your mail."});
                });
              })
              .catch(console.error);
          });
       }
    });
  }
    else{
      return res.status(400).json({message: "Email not found. Please check."})
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

exports.pubsub = (req, res ,next) =>{
  console.log("ENTEREEED!");
  

  var mySpecificSubscriber = function (msg, data) {
    console.log('specific: ', data.price, data.id);
}
 
// subscribe only to 'car.drive' topics
PubSub.subscribe('vendor', mySpecificSubscriber);
 
// Publish some topics
PubSub.publish('vendor', {id: '5eed1a6f7fc17b08240e9d02', price: '56'});


}
