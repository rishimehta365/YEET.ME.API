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
   
    return Society.find({
      $and: [
        { city: ObjectID(req.query.city) },
        { state: ObjectID(req.query.state) }
    ]
    })
        .then((data) => {
          if(!data) {
            return res.sendStatus(400);
          }
          return res.json({societies: data});
        });
  }

