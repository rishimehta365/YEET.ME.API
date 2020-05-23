const passport = require('passport'),
mongoose = require('mongoose'),
Vendor = require('../../models/vendor'),
Milk = require('../../models/milk'),
Society = require('../../models/society')
constants = require('../../constants/constants'),
url = require('url'),
ObjectID = require('mongoose').ObjectID,
request = require('request');

   /* 
  {
	"vendor": {
    "email_id": "vendor@gmail.com",
    "password": "vendor@123",
		"first_name": "Vendor",
		"last_name": "Singh",
    "company_name": "Milk Dairy",
    "milk_rate_per_kg": "75.0",
    "city": "Pune",
    "state": "MH",
    "mobile_number": "7447477330",
    "paytm_number": "7447477330",
		"gPay_number": "7447477330",
    "roles": "vendor",
    "permissions": ["read"]
	}
}
  */

exports.register = async(req, res, next) => {
  const { body: { vendor } } = req;

  if(!vendor.email_id) {
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
      {company_name: vendor.company_name}, 
      {mobile_number: vendor.mobile_number},
      {vendor_name: vendor.vendor_name}
    ]
  }).then(async (data)=>{
    if(data.length>0){
      return res.json({ error: "Vendor already exists!" });
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
  //     return createVendor.save().then((vendorData) => {
  //       vendor.milk.forEach(milkId=>{
  //         Milk.findByIdAndUpdate(milkId,  { $push: { vendor: vendorData.id } }, {new: true}, (err, model)=>{
  //         }
  //       );
  //       });

  //       vendor.society.forEach(societyId=>{
  //         Society.findByIdAndUpdate(societyId,  { $push: { vendor: vendorData.id } }, {new: true}, (err, model)=>{
  //         }
  //       );
  //       });
  //       res.json({ vendor: createVendor });
  // });
    }
  })
}

/* 
  {
  "vendor": 
    {
      "email_id": "raun@gmail.com",
      "password": "raun@123"
	  }
  }
*/

exports.login = (req, res, next) => {
  const { body: { vendor } } = req;

  if(!vendor.email_id) {
    return res.status(422).json({
      errors: {
        email_id: 'is required',
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
      console.log("Info", info);
      return next(err);
    }
    if(passportVendor) {
      return res.status(200).json({user: passportVendor.toAuthJSON()});
    }
    return res.status(403).json({error: 'Unauthorized Access Denied!'});
  })(req, res, next);
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
  Vendor.findById(req.params.id, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json({vendor: data});
  });
}

