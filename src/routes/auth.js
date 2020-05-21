const jwt = require('express-jwt'),
jwtoken = require('jsonwebtoken'),
asyncRedis = require("async-redis"),
client = asyncRedis.createClient(),
request = require('request');

client.on("error", function (err) {
  console.log("Error " + err);
});

require('dotenv').config();


async function getTokenFromHeaders(req, res, next) {
  const { headers: { authorization, username } } = req;
  if(authorization && authorization.split(' ')[0] === 'Token') {
        let accessToken= authorization.split(' ')[1];
        try{
          let accessTokenDecoded = jwtoken.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
          if(accessTokenDecoded && accessTokenDecoded === username){
          next();
          }
          else{
            const err = new Error(`Accessing through incorrect email id!`);
            err.status = 'error';
            err.statusCode = 403;
            next(err);
          }
        }
        catch(err){
          if(err){
            if(err.name === "TokenExpiredError" && err.message === "jwt expired"){
                 let redis_token = await client.get(username); 
                 if(!redis_token){
                  const err = new Error(`Accessing through incorrect email id!`);
                  err.status = 'error';
                  err.statusCode = 403;
                  next(err);
                 }
                  try{
                   let refreshTokenDecoded= jwtoken.verify(redis_token, process.env.REFRESH_TOKEN_KEY);
                   if(refreshTokenDecoded){
                    let token=jwtoken.sign({
                      email_id: refreshTokenDecoded.email_id,
                      id: refreshTokenDecoded.id,
                      exp: Math.floor(Date.now() / 1000) + (60),
                  }, process.env.ACCESS_TOKEN_KEY);
                  next();
                  }
                  }catch(err){
                    if(err){
                      if(err.name === "TokenExpiredError" && err.message === "jwt expired"){
                        next(err);
                      }
                  }
                  }
             }
            }
        }
    }
};

const auth = {
  required: getTokenFromHeaders,
  optional: jwt({
    secret: process.env.ACCESS_TOKEN_KEY,
    userProperty: 'payload',
    credentialsRequired: false,
  }),
};

module.exports = auth;
