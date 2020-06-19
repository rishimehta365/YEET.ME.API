const mongoose = require('mongoose');

var Order = require('../../models/order'),
  url = require('url'),
  ObjectID = require('mongoose').ObjectID,
  request = require('request');


exports.createOrder = (req, res, next) => {
  const { body: { order } } = req;
  
  const createOrder = new Order(order);
        return createOrder.save().then(() => {
            return res.status(201).json({order: createOrder});
        });
}

exports.getOrders = (req, res, next) => {
  return Order.find({
    vendor: req.query.vendor
})
    .then((data) => {
      if(!data) {
        return res.sendStatus(400);
      }
      return res.json({orders: data});
    });
}