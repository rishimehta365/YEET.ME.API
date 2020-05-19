const mongoose = require('mongoose');
const { Schema } = mongoose;



let SocietySchema = new Schema({
    society_name: String,
    area_name: String,
    vendor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }]
});

var Society = mongoose.model('Society', SocietySchema);
module.exports = Society;