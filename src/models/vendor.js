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
    email: {
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
        required: false,
        minlength: 8
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: false
    },
    image: {
        url: String,
        type: String
    },
    product: 
    [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Product',
    }],
    state: {
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
    mobile: {
        type: Number,
        required: false,
        unique: true,
        maxlength: 10
    },
    paytm: {
        type: Number,
        required: false,
        maxlength: 10
    },
    gPay: {
        type: Number,
        required: false,
        maxlength: 10
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
    provider: {
        type: String,
        default: "SELF"
    },
    active: {
        type: Boolean,
        default: true
    }
  
},{
    timestamps: true
});

VendorSchema.plugin(passportLocalMongoose);

VendorSchema.pre("save", true , async function(next, done) {
    var self = this;
    if (self.password && self.password.length > 7) {
        await bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(self.password, saltRounds, (err, hash) => {
             if(err){
                 done(null);
                 next(err);
             }
                this.password = hash;
                done(null, this);
                next();
         });
         });
    }
    else{
        done(null,this);
        next();
    }

});

VendorSchema.methods.setPassword= async (password, callback)=>{
    // this.salt = crypto.randomBytes(16).toString('hex');
    // this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');

   await bcrypt.genSalt(saltRounds, (err, salt) => {
       bcrypt.hash(password, saltRounds, (err, hash) => {
        if(hash.length>0){
            callback({flag: true, hash: hash});
        }
    });
    });
};

VendorSchema.methods.setVendor= async (id, email)=>{
    this._id = id;
    this.email = email;
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
        subject: this.email+"", 
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
        email: this.email,
        id: this._id,
        roles: this.roles,
        permissions: this.permissions,
    }, accessPrivateKEY, signOptions);
}

VendorSchema.methods.generateRefreshJWT = function(){
    
        
    var sOptions = {
        issuer: "Authorization/Resource/This server",
        subject: this.email+"", 
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
        email: this.email,
        id: this._id,
        roles: this.roles,
        permissions: this.permissions,
    }, refreshPrivateKEY, signOptions);
}
    
VendorSchema.methods.toAuthJSON = function(){

    let accessToken = this.generateAccessJWT();
    let refreshToken = this.generateRefreshJWT();

    client.set(this.email+":"+accessToken, refreshToken);

        return {
            _id: this._id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
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
        email: this.email,
        email_is_verified: this.email_is_verified,
        firstName: this.firstName,
        lastName: this.lastName,
        image: this.image,
        companyName: this.companyName,
        product: this.product,
        state: this.state,
        city: this.city,
        mobile: this.mobile,
        paytm: this.paytm,
        gPay: this.gPay,
        roles: this.roles,
        permissions: this.permissions,
        provider: this.provider,
        active: this.active
        };
    };

const Vendor = mongoose.model('Vendor', VendorSchema);
module.exports = Vendor;