const mongoose = require('mongoose');

var Vendor = require('../../models/vendor'),
Milk = require('../../models/milk'),
Society = require('../../models/society'),
  url = require('url'),
  ObjectID = require('mongoose').ObjectID,
  request = require('request');

   /* 
  {
	"vendor": {
		"vendor_name": "Joe",
		"company_name": "Brij Dairy",
		"milk_rate_per_kg": "75.0",
			"milk": ["5eaf2cb133da812b0493396a"
			],
		"mobile_number": "7447477330",
		"paytm_number": "7447477330",
		"gPay_number": "7447477330"
	}
}
  */

exports.createVendor = (req, res, next) => {
  const { body: { vendor } } = req;
  Vendor.find({
    $or: [
      {company_name: vendor.company_name}, 
      {mobile_number: vendor.mobile_number},
      {vendor_name: vendor.vendor_name}
    ]
  }).then((data)=>{
    if(data.length>0){
      return res.json({ error: "Vendor already exists!" });
    }
    else{
      const createVendor = new Vendor(vendor);
      return createVendor.save().then((vendorData) => {
        vendor.milk.forEach(milkId=>{
          Milk.findByIdAndUpdate(milkId,  { $push: { vendor: vendorData.id } }, {new: true}, (err, model)=>{
          }
        );
        });
        vendor.society.forEach(societyId=>{
          Society.findByIdAndUpdate(societyId,  { $push: { vendor: vendorData.id } }, {new: true}, (err, model)=>{
          }
        );
        });
        res.json({ vendor: createVendor });
  });
    }
  })
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

