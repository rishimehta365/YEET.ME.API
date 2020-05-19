const mongoose = require('mongoose');
const { Schema } = mongoose;



let MilkSchema = new Schema({
    milk_name: String,
    vendor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }]
});

var Milk = mongoose.model('Milk', MilkSchema);
module.exports = Milk;