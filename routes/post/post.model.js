var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    images: [{
        type: String

    }],
    description: {
        type: String,
        required: true
    },
    clicks: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    favorites: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    postUrl: {
        type: String
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    category: {
        type: String,
        enum: ['Smartwatches', 'Apps', '3D Printing' ]
    }
}, {
    collection: 'posts',
    timestamps: true
});

module.exports = mongoose.model('Posts', postSchema);