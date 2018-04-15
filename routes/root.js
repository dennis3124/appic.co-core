var express = require('express');

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

    router.use('/posts', require('./post/post.routes')(postRouter, utils));
    router.use('/companies', require('./company/company.routes')(companyRouter, utils));

    return router;
};