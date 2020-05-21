const mongoose = require('mongoose');

var Order = require('../../models/order'),
  url = require('url'),
  ObjectID = require('mongoose').ObjectID,
  request = require('request');


  /* 
  {
	"order": {
	  "name": "Joe",
    "vendor": "Nilkamal",
    "wing": "B",
    "flat": "700",
    "society": "Bhagwati",
    "cart_in_kgs": "2.0",
    "mobile_number": "7447477330"
	}
}
  */

exports.createOrder = (req, res, next) => {
  const { body: { order } } = req;
  Order.find({

      mobile_number: order.mobile_number
    
  }).then((data) =>{
    console.log("Created At: ", order);
    console.log("Today's date: ", new Date().toISOString())

  //   var result="";
  //  var d = new Date();
  //  result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() + 
  //            " "+ d.getHours()+":"+d.getMinutes()+":"+
  //            d.getSeconds()+" "+d.getMilliseconds();
  //  return result;
    // if(data.length>0){
    //   return res.json({ error: "Order already exists!" });
    // }
    // else{
    //   const createOrder = new Order(order);
    //   return createOrder.save().then(() => res.json({ order: createOrder }));
    // }
  });
}

exports.getUserById = (req, res, next) => {
  User.findById(req.params.id, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json({user: data});
  });
}

exports.getAllUsers = (req, res, next) => {
  return User.find()
      .then((data) => {
        if(!data) {
          return res.sendStatus(400);
        }
        return res.json({user: data});
      });
}

exports.searchVendorUser = (req, res, next) => {
  let term = req.params.vendor;
  if (term) {
    User.find({
      vendor: term
    })
      .exec((err, data) => {
        if (err) {
          return next(err);
        }
        return res.json(data);
      });
  } else {
    User.find((err, data) => {
      if (err) {
        return next(err);
      }
      return res.json(data);
    });
  }
};

exports.deleteUser = (req, res, next) =>{
  let term = req.params.id;
  if (term) {
    User.findOneAndRemove(
      { meeting_id: req.params.id  }
    ).exec((err, data) => {
        if (err) {
          return next(err);
        }
        return res.json({success:data});
      });
  } else {
    User.find((err, data) => {
      if (err) {
        return next(err);
      }
      return res.json(data);
    });
  }
}

