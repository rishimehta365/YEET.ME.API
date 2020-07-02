const mongoose = require('mongoose'),
  Product = require('../../models/product'),
  Vendor = require('../../models/vendor'),
  constants = require('../../constants/constants'),
  ObjectID = require('mongoose').ObjectID;

 exports.createProduct = async (req, res, next) => {
    const { body: { product } } = req;
    
    await Product.find({
      $and: [
        {name: product.name}, 
        {vendor: product.vendor},
        {slug: product.slug}
      ]
    }).then(async (data) =>{
      if(data.length>0){
        return res.status(409).json({ error: constants.PRODUCT_EXIST });
      }
      else{
        const createProduct = new Product(product);
        return createProduct.save().then(() => {
          // Vendor.findByIdAndUpdate(product.vendor, 
          //   {"$push": { "product": ObjectID(createProduct.id) }}, {"new": true, "upsert": true});
            return res.json({product: createProduct});
        });
      }
    });
  }
  
  exports.getProductById = (req, res, next) => {
    return Product.findById(req.params.id, (err, data) => {
      if (err) {
        return next(err);
      }
      return res.json({product: data});
    });
  }


  exports.getAllProduct = (req, res, next) => {
    
    return Product.find({
        vendor: req.query.vendor
    })
        .then((data) => {
          if(!data) {
            return res.sendStatus(400);
          }
          return res.json({products: data});
        });
  }

  exports. updateProduct = (req, res ,next) =>{
    const { body: { product } } = req;
    
    return Product.findByIdAndUpdate(req.params.id, product, {new:true}, (err, data) => {
      if (err) {
        return next(err);
      }
      return res.json({product: data});
    });
  }
  

