var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose'); 				// mongoose for mongodb
var database = require('server/db-conf'); 			// load the database config
var bodyParser = require('body-parser');
var compression = require('compression');
var restful = require('node-restful');

var app = express();
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(compression());


//MongoDB Configuration
mongoose.Promise = global.Promise;
mongoose.connect(database.localUrl);

require('./teacher-routes')(restful, app);

try {
    fs.accessSync('client/build');
    app.use(express.static('client/build'));
} catch (e) {
    app.use(express.static('client'));
}

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
