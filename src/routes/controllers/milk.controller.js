const mongoose = require('mongoose');

var Milk = require('../../models/milk'),
  url = require('url'),
  ObjectID = require('mongoose').ObjectID,
  request = require('request');


  /* 
  {
	"milk": {
	  "milk_name": "Amul",
    "vendor": []
	}
}
  */

 exports.createMilk = (req, res, next) => {
    const { body: { milk } } = req;
    const createMilk = new Milk(milk);
    return createMilk.save().then(() => res.json({ milk: createMilk }));
  }
  

  
  exports.getMilkById = (req, res, next) => {
    Milk.findById(req.params.id, (err, data) => {
      if (err) {
        return next(err);
      }
      return res.json({milk: data});
    });
  }
  

