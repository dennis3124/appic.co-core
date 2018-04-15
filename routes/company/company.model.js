var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema({
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
    companyUrl: {
        type: String
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true,
    collection: 'companies'
});

module.exports = mongoose.model('Company', companySchema);