/// <reference path='./typings/tsd.d.ts' />
import {GraphInterface} from "../node_modules/cubitt-graph/src/cubitt-graph";
import {CommandFactory} from "../node_modules/cubitt-commands/src/cubitt-commands";

import express = require('express');
import bodyParser = require('body-parser');
import http = require('http');
import path = require('path');
import commands = require("cubitt-commands");

var app = express();
//var Functions = functions.Functions;
var router = express.Router();
var port = 8000;
var graph = null;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get( '/', function( req, res ) {

    res.sendFile( path.join( __dirname, 'client', 'index.html' ));
  });

router.get('/add/model', function (req, res) {
      //console.log("add model", graph);
      console.log("graph from memory", graph);
      res.send(JSON.stringify(graph));
});

router.get('/graph', function (req, res) {
  var options = {
    host: 'localhost',
    port: 8001,
    path: '/api/query',
    method: 'POST'
  };
  http.request(options, cbFunction).end();
  var obj: { message: string; } = { message: "foo" }
  obj.message = "response";
});

function cbFunction(response){
  var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    graph = JSON.parse(str);
    console.log(graph);
  });
}

router.use(express.static(__dirname + '/client'));

app.use('/', router);
app.listen(port, function () {
    console.log('Running at http://localhost:' + port);
});
