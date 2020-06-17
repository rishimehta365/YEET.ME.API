const mongoose = require('mongoose'),
  Milk = require('../../models/milk'),
  {Vendor} = require('../../models/vendor'),
  constants = require('../../constants/constants'),
  ObjectID = require('mongoose').ObjectID;


  /* 
  {
	"milk": {
    "milk_name": "Amul",
    "rate_per_kgs": "45",
    "society": []
	}
}
  */

 exports.createMilk = async (req, res, next) => {
    const { body: { milk } } = req;
    
    await Milk.find({
      $and: [
        {name: milk.name}, 
        {vendor: milk.vendor},
        {slug: milk.slug}
      ]
    }).then(async (data) =>{
      if(data.length>0){
        return res.status(409).json({ error: constants.MILK_EXIST });
      }
      else{
        const createMilk = new Milk(milk);
        return createMilk.save().then(() => {
          // Vendor.findByIdAndUpdate(milk.vendor, 
          //   {"$push": { "milk": ObjectID(createMilk.id) }}, {"new": true, "upsert": true});
            return res.json({milk: createMilk});
        });
      }
    });
  }
  

  exports.getMilkById = (req, res, next) => {
    return Milk.findById(req.params.id, (err, data) => {
      if (err) {
        return next(err);
      }
      return res.json({milk: data});
    });
  }


  exports.getAllMilk = (req, res, next) => {
    
    return Milk.find({
        vendor: req.query.vendor
    })
        .then((data) => {
          if(!data) {
            return res.sendStatus(400);
          }
          return res.json({milks: data});
        });
  }

  exports. updateMilk = (req, res ,next) =>{
    const { body: { milk } } = req;
    
    console.log("Milk: ", milk);
    return Milk.findByIdAndUpdate(req.params.id, milk, {new:true}, (err, data) => {
      if (err) {
        return next(err);
      }
      return res.json({milk: data});
    });
  }
  

