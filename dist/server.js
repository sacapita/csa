"use strict";
var graph = require("cubitt-graph");
var commands = require("cubitt-commands");
var http = require("http");
var bodyParser = require( 'body-parser' );
var fs = require("fs");
var express = require('express');
var router = express.Router();
var path = require("path");

var app = express();

///////////// Configuration
var port = process.env.PORT || 8000;

///////////// Middlewares
app.use( bodyParser.json()); 
app.use( bodyParser.urlencoded({ extended: true })); 
app.use( express.static( __dirname + '/client' ));

///////////// Routes
require( './server/routes' )( app );

///////////// Start the app
app.listen( port, function() {
  console.log( 'Running at http://localhost:' + port );
});

exports = module.exports = app;