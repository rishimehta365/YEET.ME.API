const mongoose = require('mongoose');

var Society = require('../../models/society'),
  url = require('url'),
  ObjectID = require('mongoose').Types.ObjectId,
  request = require('request');

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

    if(req.query.city === "undefined" || req.query.state === "undefined"){
      return res.status(404).json('Please complete your profile!');
    }
   
    return Society.find({
      $and: [
        { city: ObjectID(req.query.city) },
        { state: ObjectID(req.query.state) }
    ]
    })
        .then((data) => {
          
          if(!data || data.length<=0) {
            console.log("Data: ", data);
            return res.status(400).json("Add delivery society to continue...!\r\n" +"Go to Menu -> E-Commerce -> Society");
          }
          return res.status(200).json({societies: data});
        });
  }

