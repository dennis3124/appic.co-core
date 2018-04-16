var express = require('express');
// Multer to handle mutipart/formdata
var multer = require('multer');
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'temp/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

var upload = multer({ //multer settings
    storage: storage
});

module.exports = function(router, utils) {
    // Return message for root
    router.route('/').get(function(req, res) {
        res.send('Welcome to api root directory');
    });

    var postRouter = express.Router({
        mergeParams: true
    });

    var companyRouter = express.Router({
        mergeParams: true
    });

    router.use('/posts', require('./post/post.routes')(postRouter, utils, upload));
    router.use('/companies', require('./company/company.routes')(companyRouter, utils, upload));

    return router;
};