const mongoose = require('mongoose');
const { Schema } = mongoose;


let OrderSchema = new Schema({
    name: String,
    vendor: String,
    wing: String,
    flat: String,
    society: String,
    cart_in_kgs: String,
    mobile_number: String,
    date: String
},
{
    timestamps: true
});

var Orders = mongoose.model('Orders', OrderSchema);
module.exports = Orders;
