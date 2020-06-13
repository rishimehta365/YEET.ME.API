const mongoose = require('mongoose'), 
passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose,
bcrypt = require('bcrypt'),
saltRounds = 10,
jwt = require('jsonwebtoken'),
asyncRedis = require("async-redis"),
client = asyncRedis.createClient(),
fs = require('fs'),
path = require('path'),
Society = require('../models/society');

client.on("error", function (err) {
    console.log("Error " + err);
});

require('dotenv').config();

const accessPrivateKEY  = fs.readFileSync(path.resolve(process.env.ACCESS_PRIVATE_KEY_FILE_PATH), 'utf8');
const refreshPrivateKEY  = fs.readFileSync(path.resolve(process.env.REFRESH_PRIVATE_KEY_FILE_PATH), 'utf8');

let VendorSchema = new Schema({
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
    company_name: {
        type: String,
        required: true,
        unique: true
    },
    milk: 
    [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Milk',
    }],
    state: {
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
    mobile_number: {
        type: String,
        required: true,
        unique: true
    },
    paytm_number: {
        type: String,
        required: false,
        unique: true
    },
    gPay_number: {
        type: String,
        required: false,
        unique: true
    },
    roles: {
        type: String,
        required: true,
        default: "vendor"
    },
    permissions:
    {   
        type: Array,
        required: true,
        default: ['read']
    },
    active: {
        type: Boolean,
        default: true
    }
  
    // milk: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Milk' }],
    // society: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Society' }],
},{
    timestamps: true
});

VendorSchema.plugin(passportLocalMongoose);

VendorSchema.methods.setPassword= async (password, callback)=>{
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

VendorSchema.methods.setVendor= async (id, email_id)=>{
    this._id = id;
    this.email_id = email_id;
};

VendorSchema.methods.validatePassword = function(password, hash, cb){
    
     bcrypt.compare(password, hash, (err, result)=>{
        if(result){
            cb({flag: true});
        }
        else{
            cb({flag: false});
        }
    });
};

VendorSchema.methods.generateAccessJWT = function(){

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
        expiresIn:  process.env.ACCESS_TOKEN_EXPIRY,    // 20 secs validity
        algorithm:  "RS256"    // RSASSA [ "RS256", "RS384", "RS512" ]
        };

    return jwt.sign({
        email_id: this.email_id,
        id: this._id,
        roles: this.roles,
        permissions: this.permissions,
    }, accessPrivateKEY, signOptions);
}

VendorSchema.methods.generateRefreshJWT = function(){
    
        
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
        expiresIn:  process.env.REFRESH_TOKEN_EXPIRY,    // 40 secs validity
        algorithm:  "RS256"    
        };

    return jwt.sign({
        email_id: this.email_id,
        id: this._id,
        roles: this.roles,
        permissions: this.permissions,
    }, refreshPrivateKEY, signOptions);
}
    
VendorSchema.methods.toAuthJSON = function(){

    let accessToken = this.generateAccessJWT();
    let refreshToken = this.generateRefreshJWT();

    client.set(this.email_id+":"+accessToken, refreshToken);

        return {
            _id: this._id,
            email_id: this.email_id,
            city: this.city,
            state: this.state,
            roles: this.roles,
            permissions: this.permissions,
            accessToken: accessToken,
            refreshToken: refreshToken
        };
    };

VendorSchema.methods.toJSON = function(){

    return {
        _id: this._id,
        email_id: this.email_id,
        email_is_verified: this.email_is_verified,
        first_name: this.first_name,
        last_name: this.last_name,
        company_name: this.company_name,
        milk: this.milk,
        state: this.state,
        city: this.city,
        mobile_number: this.mobile_number,
        paytm_number: this.paytm_number,
        gPay_number: this.gPay_number,
        roles: this.roles,
        permissions: this.permissions,
        active: this.active
        };
    };

const Vendor = mongoose.model('MilkVendors', VendorSchema);
module.exports = {Vendor};