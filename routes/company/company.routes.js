var UtilsModule = "Companies";
var companyService = require('./company.service');
var config = require('../../config/config');
var jwt = require('express-jwt');
var auth = jwt({
    secret: config.jwt.secret,
    userProperty: 'payload'
});

module.exports = function (router, utils) {
    router.get('/', function(req, res) {
        companyService.getAll().then(function(data) {
            utils.responseBuilder.handleSuccess(UtilsModule, 'Get', res, data);
        }).catch(function(err) {
            utils.responseBuiler.handleError(UtilsModule, 'Get', res, err);
        })
    });

    router.get('/:id', function(req, res) {
        if (!req.params.id) {
            utils.responseBuilder.handleValidationError(UtilsModule, res, 'Id is required');
        }
        companyService.get(req.params.id).then(function(data) {
            utils.responseBuilder.handleSuccess(UtilsModule, 'Get', res, data);
        }).catch(function(err) {
            utils.responseBuiler.handleError(UtilsModule, 'Get', res, err);
        })
    });

    router.post('/', function(req, res) {
        if (!req.body.name || !req.body.description) {
            utils.responseBuilder.handleValidationError(UtilsModule, res, 'Company is required');
        }
        companyService.add(req.body).then(function(company) {
            utils.responseBuilder.handleSuccess(UtilsModule, 'Add', res, company);
        }).catch(function(err) {
            utils.responseBuilder.handleError(UtilsModule, 'Add', res, err)
        })
    });

    router.delete('/:id', function(req, res) {
       if (!req.params.id) {
           utils.responseBuilder.handleValidationError(UtilsModule, res, 'Id is required');
       }

       companyService.delete(req.params.id).then(function() {
           utils.responseBuilder.handleSuccess(UtilsModule, 'Delete', res, '');
       }).catch(function(err) {
           utils.responseBuilder.handleError(UtilsModule, 'Delete', res, err);
       })
    });

    router.get('/owner/:id', function(req, res) {
        if (!req.params.id) {
            utils.responseBuilder.handleValidationError(UtilsModule, res, 'Owner Id is required');
        }
        companyService.getByOwnerId(req.params.id).then(function(company) {
            utils.responseBuilder.handleSuccess(UtilsModule, 'Get', res, company);
        }).catch(function(err) {
            utils.responseBuilder.handleError(UtilsModule, 'Get', res, err);
        })
    });
    return router;
};
