const mongoose = require('mongoose');
const { Schema } = mongoose;



let MilkSchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    priceTaxIncl: {
        type: String,
        required: true,
        default: '0.0'
    },
    slug: {
        type: String
    },
    vendor: { 
        type: Schema.Types.ObjectId, 
        ref: 'Vendor' 
    },
    society: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Society' 
    }],
    state: {
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
});

var Milk = mongoose.model('Milk', MilkSchema);
module.exports = Milk;