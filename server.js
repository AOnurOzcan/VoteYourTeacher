var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose'); 				// mongoose for mongodb
var database = require('./server/db-conf'); 			// load the database config
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

require('./server/teacher-routes')(restful, app);
var path = require("path");


try {
    fs.accessSync('client/build');
    app.use(express.static(path.resolve(__dirname + "/client/build")));
} catch (e) {
    app.use(express.static(path.resolve(__dirname + "/client")));
}

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
