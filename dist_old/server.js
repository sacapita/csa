"use strict";
var bodyParser = require("body-parser");
var express = require("express");
var http = require('http');
var path = require('path');
var functions = require('./Functions');
var commands = require("cubitt-commands");

var Functions = functions.Functions;
var app = express();
var router = express.Router();
var port = 8000;
var graph = null;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get( '/', function( req, res ) {
    //functions.blahh("message");
    res.sendFile( path.join( __dirname, 'client', 'index.html' ));
  });

router.get('/add/model', function (req, res) {
    //console.log("add model", graph);
    console.log(commands);
});

router.get('/graph', function (req, res) {
  var options = {
    host: 'localhost',
    port: 9090,
    path: '/api/query',
    method: 'POST'
  };
  http.request(options, cbFunction).end();
  var obj = {};
  obj.message = "response";
  return JSON.stringify(obj);
});

function cbFunction(response){
  var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });



  response.on('end', function () {
    graph = JSON.parse(str);
    console.log("callback", graph);
  });
}

router.use(express.static(__dirname + '/client'));

app.use('/', router);
app.listen(port, function () {
    console.log('Running at http://localhost:' + port);
});

exports = module.exports = app;
