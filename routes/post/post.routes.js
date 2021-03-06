var UtilsModule = "Posts";
var fs = require('fs');
var postService = require('./post.service');
var config = require('../../config/config');
var jwt = require('express-jwt');
var auth = jwt({
    secret: config.jwt.secret,
    userProperty: 'payload'
});


module.exports = function (router, utils, upload) {
    router.get('/', function (req, res) {
        postService.getAll(req.query.skip, req.query.limit).then(function (posts) {
            utils.responseBuilder.handleSuccess(UtilsModule, 'Get', res, posts);
        }).catch(function (err) {
            utils.responseBuilder.handleError(UtilsModule, 'Get', res, err);
        })
    });

    router.get('/:id', function (req, res) {
        if (!req.params.id) {
            utils.responseBuilder.handleValidationError(UtilsModule, res, 'Id is needed');

        }
        postService.get(req.params.id).then(function (posts) {
            utils.responseBuilder.handleSuccess(UtilsModule, 'Get', res, posts);
        }).catch(function (err) {
            utils.responseBuilder.handleError(UtilsModule, 'Get', res, err);
        })
    });

    router.post('/', auth, function (req, res) {
        if (!req.body) {
            utils.responseBuilder.handleValidationError(UtilsModule, res, 'Body is required');
        }
        postService.add(req.body).then(function (post) {
            utils.responseBuilder.handleSuccess(UtilsModule, 'Create', res, post)
        }).catch(function (err) {
            utils.responseBuilder.handleError(UtilsModule, 'Create', res, err);
        })
    });

    router.delete('/:id', function (req, res) {
        if (!req.params.id) {
            utils.responseBuilder.handleValidationError(UtilsModule, res, 'Id is required');
        }

        postService.delete(req.params.id).then(function () {
            utils.responseBuilder.handleSuccess(UtilsModule, 'Delete', res, '');
        }).catch(function (err) {
            utils.responseBuilder.handleError(UtilsModule, 'Delete', res, err);
        })
    });

    // Get post by companyId;
    router.get('/company/:id', function (req, res) {
        if (!req.params.id) {
            utils.responseBuilder.handleValidationError(UtilsModule, res, 'Company Id is required');
        }

        postService.getPostByCompanyId(req.params.id).then(function (posts) {
            utils.responseBuilder.handleSuccess(UtilsModule, 'Get', res, posts)
        }).catch(function (err) {
            utils.responseBuilder.handleError(UtilsModule, 'Get', res, err);
        })
    });

    // Get Posts in creation process by CompanyId
    router.get('/company/:id/creation', function (req, res) {
        if (!req.params.id) {
            utils.responseBuilder.handleValidationError(UtilsModule, res, 'Company Id is required');
        }

        postService.getPostInCreation(req.params.id).then(function(post) {
            utils.responseBuilder.handleSuccess(UtilsModule, 'Get', res, post);
        }).catch(function(err) {
            utils.responseBuilder.handleError(UtilsModule, 'Get', res, err);
        })
    });

    // Update Post
    router.put('/:id', function(req, res) {
        if (!req.params.id) {
            utils.responseBuilder.handleValidationError(UtilsModule, res, 'Post Id is required');
        }

        postService.updatePost(req.params.id, req.body).then(function(post) {
            utils.responseBuilder.handleSuccess(UtilsModule, 'PUT', res, post);

        }).catch(function(err) {
            utils.responseBuilder.handleError(UtilsModule, 'PUT', res, err);

        })
    });



    /* Image routes for post image handling */

    router.post('/image/upload', upload.single('image'), function (req, res) {
        var file = req.file;
        var companyId = req.body.companyId;
        var stream = fs.createReadStream(file.path);
        var fileName = companyId + '-' + file.filename;
        utils.aws.uploadImage('post', fileName, stream).then(function (url) {
            fs.unlinkSync(file.path);

            utils.responseBuilder.handleSuccess(UtilsModule, 'post', res, url);
        }).catch(function (err) {
            fs.unlinkSync(file.path);
            utils.responseBuilder.handleError(UtilsModule, 'post', res, err);
        })

    });

    router.post('/video/upload', upload.single('video'), function(req, res) {
        var file = req.file;
        var companyId = req.body.companyId;
        var stream = fs.createReadStream(file.path);
        var fileName = companyId + '-' + file.filename;
        utils.aws.uploadVideo('post', fileName, stream).then(function (url) {
            fs.unlinkSync(file.path);

            utils.responseBuilder.handleSuccess(UtilsModule, 'post', res, url);
        }).catch(function (err) {
            fs.unlinkSync(file.path);
            utils.responseBuilder.handleError(UtilsModule, 'post', res, err);
        })
    });



    router.post('/video/remove', function (req, res) {
        if (!req.body.fileName) {
            utils.responseBuilder.handleValidationError(UtilsModule, res, 'FileName required');
        }
        var filename = 'assets/images/post/' + req.body.fileName;
        utils.aws.removeVideo(filename).then(function(data) {
            utils.responseBuilder.handleSuccess(UtilsModule, 'post', res, data.message);
        }).catch(function (err) {
            utils.responseBuilder.handleError(UtilsModule, 'post', res, err);
        })
    });


    router.post('/image/remove', function (req, res) {
        if (!req.body.fileName) {
            utils.responseBuilder.handleValidationError(UtilsModule, res, 'FileName required');
        }
        var filename = 'assets/images/post/' + req.body.fileName;
        utils.aws.removeImage(filename).then(function(data) {
            utils.responseBuilder.handleSuccess(UtilsModule, 'post', res, data.message);
        }).catch(function (err) {
            utils.responseBuilder.handleError(UtilsModule, 'post', res, err);
        })
    });


    return router;
};