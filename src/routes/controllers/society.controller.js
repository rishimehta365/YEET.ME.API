const mongoose = require('mongoose');

var Society = require('../../models/society'),
  url = require('url'),
  ObjectID = require('mongoose').ObjectID,
  request = require('request');


  /* 
  {
	"society": {
      "society_name": "Bhagwati Royale",
      "area_name": "Wakad",
    "vendor": []
	}
}
  */

 exports.createSociety = (req, res, next) => {
    const { body: { society } } = req;
    const createSociety = new Society(society);
    return createSociety.save().then(() => res.json({ society: createSociety }));
  }
  

  
  exports.getSocietyById = (req, res, next) => {
    Society.findById(req.params.id, (err, data) => {
      if (err) {
        return next(err);
      }
      return res.json({society: data});
    });
  }
  
  exports.getAllSocieties = (req, res, next) => {
    return Society.find()
        .then((data) => {
          if(!data) {
            return res.sendStatus(400);
          }
          return res.json({societies: data});
        });
  }

