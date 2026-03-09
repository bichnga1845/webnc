const mongoose = require('mongoose');

const fashionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    details: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    style: {
        type: String,
        required: true,
        enum: ['Street Style', 'Trend', 'Runway']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Fashion', fashionSchema);
