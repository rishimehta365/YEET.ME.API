const mongoose = require('mongoose');
const { Schema } = mongoose;

const LocationSchema = new Schema({
    location_name: {
        type: String
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Location'
    }
});

const Location = mongoose.model('Location', LocationSchema);
module.exports = Location;