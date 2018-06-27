var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    projectImage: {
        type: String
    },
    images: [{
        type: String
    }],
    video: {
        type: String
    },
    story: {
        type: String
    },
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
    },
    status: {
        type: String,
        enum: ['Creation', 'Development', 'Finished'],
        default: 'Creation'
        /* Creation meaning post is still under creation stage,
        *   Development for when post has finished creation
        */
    }
}, {
    collection: 'posts',
    timestamps: true
});

module.exports = mongoose.model('Posts', postSchema);