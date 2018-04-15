//Expressjs module, require is node.js syntax to import the module.
var express = require('express');

//For file path, we will use it to point the Angular dist folder.
var path = require('path');

//body-parser extract the entire body portion of an incoming
//request stream and exposes it on req.body.
var bodyParser = require('body-parser');

// Mongoose for object mapping for mongodb
var mongoose = require('mongoose');

// Configuration -----------------------------

// Config files
var config = require('./config/config');
var app = express();


// Utils for all response handling
var utils = require('./utils/utils');

// Middleware for skip and limit
var skipLimit = require('./utils/skip-filter.middleware');

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));
// Connect mongoose instance to db
mongoose.connect(config.db.dev.url);
console.log(' Connected to [dev] Mongo Instance !');


// Define routes in another file
var apiRoutes = require('./routes/root')(express.Router(), utils);


// allow cross origin
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// set our port
var port = process.env.PORT || 8091;

// Start our server -------------------

app.listen(port, function() {
    console.log("Server listening on port: ", port);
});

// root
app.get('/', function(req, res) {
    res.send('Welcome to Appic.co API core root');
});


// User Skip and Filter Util Middleware
app.use(skipLimit);

app.use('/api', apiRoutes);

// Catch unauthorized errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json(
            {
                "message" : err.name + ": " + err.message,
                "success": false
            })
        ;
    }
});

exports = module.exports = app;