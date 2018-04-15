var UtilsModule = "Posts";
var fs = require('fs');
var postService = require('./post.service');
var config = require('../../config/config');
var jwt = require('express-jwt');
var auth = jwt({
    secret: config.jwt.secret,
    userProperty: 'payload'
});
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

module.exports = function (router, utils) {
    router.get('/', function(req, res) {
        postService.getAll(req.query.skip, req.query.limit).then(function(posts) {
            utils.responseBuilder.handleSuccess(UtilsModule, 'Get', res, posts);
        }).catch(function(err) {
            utils.responseBuilder.handleError(UtilsModule, 'Get', res, err);
        })
    });

    router.get('/:id', function(req, res) {
        if (!req.params.id) {
            utils.responseBuilder.handleValidationError(UtilsModule , res, 'Id is needed');

        }
        postService.get(req.params.id).then(function(posts) {
            utils.responseBuilder.handleSuccess(UtilsModule, 'Get', res, posts);
        }).catch(function(err) {
            utils.responseBuilder.handleError(UtilsModule, 'Get', res, err);
        })
    });

    router.post('/', auth, function(req, res) {
        if (!req.body) {
            utils.responseBuilder.handleValidationError(UtilsModule, res, 'Body is required');
        }
        postService.add(req.body).then(function(post) {
            utils.responseBuilder.handleSuccess(UtilsModule, 'Create', res, post)
        }).catch(function(err) {
            utils.responseBuilder.handleError(UtilsModule, 'Create' , res, err);
        })
    });

    router.delete('/:id', function(req,res) {
        if (!req.params.id) {
            utils.responseBuilder.handleValidationError(UtilsModule, res, 'Id is required');
        }
       postService.delete(req.params.id).then(function() {
           utils.responseBuilder.handleSuccess(UtilsModule, 'Delete', res, '');
       }).catch(function(err) {
           utils.responseBuilder.handleError(UtilsModule, 'Delete', res, err);
       })
    });

    // Get post by companyId;
    router.get('/company/:id', function(req, res) {
        if (!req.params.id) {
            utils.responseBuilder.handleValidationError(UtilsModule, res, 'Company Id is required');
        }

        postService.getPostByCompanyId(req.params.id).then(function(posts) {
            utils.responseBuilder.handleSuccess(UtilsModule, 'Get', res, posts)
        }).catch(function(err) {
            utils.responseBuilder.handleError(UtilsModule, 'Get', res, err);
        })
    });

    router.post('/image/upload', upload.single('image'), function (req, res, next) {
        var file = req.file;
        var companyUrl = req.body.companyUrl;
        var stream = fs.createReadStream(file.path);
        var fileName = companyUrl+ '-' + file.filename;
        utils.aws.uploadImage('post', fileName, stream).then(function(url) {
            fs.unlinkSync(file.path);
            utils.responseBuilder.handleSuccess(UtilsModule, 'post', res, url);
        }).catch(function(err) {
            fs.unlinkSync(file.path);
            utils.responseBuilder.handleError(UtilsModule, 'post', res, err);
        })

    });

    return router;
};