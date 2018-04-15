var Promise = require('bluebird');
var config = require('../config/config');
/* Contains core utility functions */
module.exports = (function() {
    'use strict';

    // Verify MongoDB connectivtiy status

    var isMongoConnAlive = function(mongoose) {

        return mongoose.connection.readyState !== 1

    };

    var aws = {
        uploadImage: function  uploadImageToS3(type, name, imageBuffer) {
            // AWS Middleware
            var aws = require('aws-sdk');
            aws.config.update({
                accessKeyId: config.aws.accessKeyId,
                secretAccessKey: config.aws.secretAccessKey,
                region: config.aws.region
            });
            var s3 = new aws.S3();
            var fileName = 'assets/images/' + type + '/' + name;
            var params = config.aws.params;
            params.Key = fileName;
            params.Body = imageBuffer;
            Promise.promisifyAll(Object.getPrototypeOf(s3));

            return s3.putObjectAsync(params).then(function(data) {
                return Promise.resolve('https://appics.s3.amazonaws.com/' + fileName);
            }).catch(function(err) {
                return Promise.reject(err);
            })
        }
    };

    // Response builder for all API responses.

    var responseBuilder = {
        handleSuccess: function(module, operation, res, data) {
            return res.status(200).json({
                success: true,
                body: {
                    "message": module + " " + operation + " is successful !",
                    "data": data
                }
            });
        },

        handleError: function(module, operation, res, data) {
            return res.status(500).json({
                success: false,
                body: {
                    "message": module + " " + operation + " is failed !",
                    "rootcause": data.message
                }
            });
        },

        handleNoDataError: function(module, operation, res, data) {
            return res.status(404).json({
                success: false,
                body: {
                    "message": module + " " + operation + " is failed !",
                    "rootcause": data.message
                }
            });
        },

        handleValidationError: function(module, res, message) {
            return res.status(400).json({
                success: false,
                body: {
                    "message": "Validation failed in " + module,
                    "rootcause": message
                }
            });
        }

    };


    return {
        isMongoConnAlive: isMongoConnAlive,
        responseBuilder: responseBuilder,
        aws: aws
    };
}());