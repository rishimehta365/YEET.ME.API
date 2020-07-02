const mongoose = require('mongoose');
const { Schema } = mongoose;



let SocietySchema = new Schema({
    name: {
        type: String
    },
    slug: {
        type: String
    },
    state: {
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
    area: {
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
});

var Society = mongoose.model('Society', SocietySchema);
module.exports = Society;