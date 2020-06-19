const passport = require('passport'),
mongoose = require('mongoose'),
Vendor = require('../../models/vendor'),
constants = require('../../constants/constants');
const { connect } = require('http2');

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
  }).then(async (data)=>{
    if(data.length>0){
      return res.status(409).json({ error: constants.VENDOR_EXIST });
    }
    else{
      const createVendor = new Vendor(vendor);
      await createVendor.setPassword(vendor.password, (cb)=>{
        if(cb.success===constants.SUCCESS){
          createVendor.set("password", cb.hash);
          return createVendor.save()
            .then(() => res.status(201).json({ statusMessage: constants.ON_REGISTER_SUCCESS })
            ).catch((err)=> next(err)
          );
        }
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

