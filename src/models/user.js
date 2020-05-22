const mongoose = require('mongoose'), 
passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose,
bcrypt = require('bcrypt'),
saltRounds = 10,
crypto = require('crypto'),
jwt = require('jsonwebtoken'),
asyncRedis = require("async-redis"),
client = asyncRedis.createClient(),
fs = require('fs'),
path = require('path');



client.on("error", function (err) {
    console.log("Error " + err);
});

require('dotenv').config();

const accessPrivateKEY  = fs.readFileSync(path.resolve(process.env.ACCESS_PRIVATE_KEY_FILE_PATH), 'utf8');
const refreshPrivateKEY  = fs.readFileSync(path.resolve(process.env.REFRESH_PRIVATE_KEY_FILE_PATH), 'utf8');


let UserSchema = new Schema({
    email_id: {
        type: String,
        required: true,
        unique: true
    },
    email_is_verified: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    vendor: {
        type: String
    },
    wing: {
        type: String
    },
    flat: {
        type: String
    },
    society: {
        type: String
    },
    default_in_kgs: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    mobile_number: {
        type: String,
        required: true,
        unique: true
    },
    role_based: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    },
},
{
    timestamps: true
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.methods.setPassword= async (password, callback)=>{
    // this.salt = crypto.randomBytes(16).toString('hex');
    // this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');

   await bcrypt.genSalt(saltRounds, (err, salt) => {
       bcrypt.hash(password, saltRounds, (err, hash) => {
        if(hash.length>0){
            callback({success: "success", hash: hash});
        }
    });
    });
};

UserSchema.methods.setUser= async (id, email_id)=>{
    this._id = id;
    this.email_id = email_id;
};

UserSchema.methods.validatePassword = function(password, hash, cb){
    
     bcrypt.compare(password, hash, (err, result)=>{
        if(result){
            cb({flag: true});
        }
        else{
            cb({flag: false});
        }
    });
};

UserSchema.methods.generateAccessJWT = function(){

    var sOptions = {
        issuer: "Authorization/Resource/This server",
        subject: this.email_id+"", 
        audience: "Client_Identity" // this should be provided by client
        };
        
    // Token signing options
    var signOptions = {
        issuer:  sOptions.issuer,
        subject:  sOptions.subject,
        audience:  sOptions.audience,
        expiresIn:  "20s",    // 20 secs validity
        algorithm:  "RS256"    // RSASSA [ "RS256", "RS384", "RS512" ]
        };

    return jwt.sign({
        email_id: this.email_id,
        id: this._id,
    }, accessPrivateKEY, signOptions);
}

UserSchema.methods.generateRefreshJWT = function(){
    
        
    var sOptions = {
        issuer: "Authorization/Resource/This server",
        subject: this.email_id+"", 
        audience: "Client_Identity" // this should be provided by client
        };
        
    // Token signing options
    var signOptions = {
        issuer:  sOptions.issuer,
        subject:  sOptions.subject,
        audience:  sOptions.audience,
        expiresIn:  "40m",    // 40 secs validity
        algorithm:  "RS256"    
        };

    var token = jwt.sign({
        email_id: this.email_id,
        id: this._id,
    }, refreshPrivateKEY, signOptions);

    client.set(this.email_id, token);

    return token;
}
    
UserSchema.methods.toAuthJSON = function(){

        return {
            _id: this._id,
            email_id: this.email_id,
            accessToken: this.generateAccessJWT(),
            refreshToken: this.generateRefreshJWT()
        };
    };

    UserSchema.methods.toJSON = function(){
        return {
            _id: this._id,
            email_id: this.email_id,
            email_is_verified: this.email_is_verified,
            first_name: this.first_name,
            last_name: this.last_name,
            vendor: this.vendor,
            wing: this.wing,
            flat: this.flat,
            society: this.society,
            default_in_kgs: this.default_in_kgs,
            city: this.city,
            state: this.state,
            mobile_number: this.mobile_number,
            role_based: this.role_based,
            active: this.active
        };
    };

var User = mongoose.model('MilkUsers', UserSchema);
module.exports = User;
