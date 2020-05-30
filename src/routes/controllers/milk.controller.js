const mongoose = require('mongoose'),
  Milk = require('../../models/milk'),
  {Vendor} = require('../../models/vendor'),
  url = require('url'),
  ObjectID = require('mongoose').ObjectID,
  request = require('request');


  /* 
  {
	"milk": {
    "milk_name": "Amul",
    "rate_per_kgs": "45",
    "society": []
	}
}
  */

 exports.createMilk = (req, res, next) => {
    const { body: { milk } } = req;
    const createMilk = new Milk(milk);
    return createMilk.save().then(() => 
      Vendor.findByIdAndUpdate(milk.vendor, 
        {"$push": { "milk": createMilk.id }}, {"new": true, "upsert": true}).then(data=>res.json({ milk: createMilk })));
  }
  

  
  exports.getMilkById = (req, res, next) => {
    Milk.findById(req.params.id, (err, data) => {
      if (err) {
        return next(err);
      }
      return res.json({milk: data});
    });
  }
  

