global.appRoot = __dirname;

var express = require('express');
var api = require('./api.js');
var config = require('./classes/config.js');

//init express engine
var app = express();

//init apps
api.initialize(app);

//port listen
app.listen(config.appSettings().port, function () {
    console.log('listening at port', config.appSettings().port);
});