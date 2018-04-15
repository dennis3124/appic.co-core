// Parse Skip and Filter

module.exports = function(req, res, next) {
    if (!req.query.skip || !req.query.limit) {
        req.query.skip = 0;
        req.query.limit = 0;
        next();
    } else {
        req.query.skip = parseInt(req.query.skip);
        req.query.limit = parseInt(req.query.limit);
       next();
    }
};
