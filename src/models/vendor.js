const mongoose = require('mongoose');
const { Schema } = mongoose;


let VendorSchema = new Schema({
    vendor_name: String,
    company_name: String,
    milk_rate_per_kg: String,
    city: String,
    state: String,
    mobile_number: String,
    paytm_number: String,
    gPay_number: String,
    milk: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Milk' }],
    society: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Society' }],
},{
    timestamps: true
});

var Vendor = mongoose.model('MilkVendors', VendorSchema);
module.exports = Vendor;