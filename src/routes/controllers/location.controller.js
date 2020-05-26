const mongoose = require('mongoose'),
Location = require('../../models/location');


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

exports.createLocation = (req, res, next) => {
  const { body: { location } } = req;
  const createLocation = new Location(location);
  createLocation.save().then((loc)=>{
      res.status(201).json({location: createLocation});
  })
}

exports.getLocationById = (req, res, next) => {
  return Location.findById(req.params.id, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json({location: data});
  });
}

exports.getLocationByParentId = (req, res, next) => {
  Location.find({parent: req.params.id}, (err, data) => {
  if (err) {
    return next(err);
  }
  return res.json({locations: data});
});
}

