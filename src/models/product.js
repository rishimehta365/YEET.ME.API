const mongoose = require('mongoose');
const { Schema } = mongoose;



let ProductSchema = new Schema({
    name: {
        type: String
    },
    slug: {
        type: String
    },
    description: {
        type: String
    },
    priceTaxIncl: {
        type: Number,
        required: true,
        default: 0.0
    },
    images: [{
        url: String,
        type: String
    }],
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
},
{
    timestamps: true
});

var Product = mongoose.model('Product', ProductSchema);
module.exports = Product;