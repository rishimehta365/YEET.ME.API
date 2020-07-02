const mongoose = require('mongoose');
const { Schema } = mongoose;

let OrderSchema = new Schema({
    slug: {
        type: String
    },
    customer: {
        type: Schema.Types.ObjectId, 
        ref: 'Customer'
    },
    vendor: { 
        type: Schema.Types.ObjectId, 
        ref: 'Vendor' 
    },
    product: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product' 
    },
    cart: {
        type: Number,
        default: 1.0
    },
    price: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        required: true,
        default: 0.0
    },
    total: {
        type: Number
    },
    status: [{
        name: {
            type: String
        },
        color: {
            type: String
        },
        date : {
            type: Date
        }
    }]
},
{
    timestamps: true
});

var Orders = mongoose.model('Order', OrderSchema);
module.exports = Orders;
