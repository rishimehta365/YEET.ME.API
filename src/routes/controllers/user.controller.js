const passport = require('passport'),
mongoose = require('mongoose'),
User = mongoose.model('MilkUsers'),
constants = require('../../constants/constants'),
jwt = require('jsonwebtoken'),
redis = require('redis'),
client = redis.createClient();

require('dotenv').config();

/* 
  {
  "user": 
    {
      "email_id": "Joe",
      "password": "********",
		  "first_name": "Brij Dairy",
		  "last_name": "75.0",
		  "vendor": "Nilkamal",
      "wing": "B",
      "flat": "700",
		  "society": "Bhagwati",
      "default_in_kgs": "2",
      "city": "Pune",
      "state": "MH",
      "mobile_number": "7447477330",
      "role_based": "User"
	  }
  }
*/

exports.register = async (req, res, next) => {
  const { body: { user } } = req;
  
  if(!user.email_id) {
    return res.status(422).json({
      errors: {
        email: constants.IS_REQUIRED,
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: constants.IS_REQUIRED,
      },
    });
  }

  await User.find({
    $or: [
      {email_id: user.email_id}, 
      {mobile_number: user.mobile_number}
    ]
  }).then(async (data) =>{
    if(data.length>0){
      return res.status(409).json({ error: constants.USER_EXIST });
    }
    else{
      const createUser = new User(user);
      await createUser.setPassword(user.password, (cb)=>{
        if(cb.success===constants.SUCCESS){
          createUser.set("password", cb.hash);
          return createUser.save()
            .then(() => res.status(201).json({ statusMessage: constants.ON_REGISTER_SUCCESS }));
        }
      });
    }
  });
}


/* 
  {
  "user": 
    {
      "email_id": "raun@gmail.com",
      "password": "raun@123"
	  }
  }
*/

exports.login = (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email_id) {
    return res.status(422).json({
      errors: {
        email_id: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      console.log("Info", info);
      return next(err);
    }
    if(passportUser) {
      return res.status(200).json({user: passportUser.toAuthJSON()});
    }
    return res.status(403).json({error: 'Unauthorized Access Denied!'});
  })(req, res, next);
}


exports.token = (req, res, next)=>{
  const { body: { token } } = req;
  let id = token.id,
  email = token.email_id,
  refreshToken = token.refreshToken;

  if(refreshToken == null){
    return res.status(401).json({error: "Unauthorized!"});
  }

  
   
    if(refreshToken){
      const userToken = new User({user: {_id: id, email_id: email}});
      const token = userToken.generateAccessJWT();

    return res.status(201).json({token: token});
    }

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

