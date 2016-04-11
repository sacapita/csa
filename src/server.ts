/// <reference path='./typings/tsd.d.ts' />
import {GraphInterface} from "cubitt-graph";
import {CommandFactory} from "cubitt-commands";
import * as Common from "cubitt-common";
import * as Commands from "cubitt-commands";
import express = require('express');
import bodyParser = require('body-parser');
import http = require('http');
import path = require('path');
import {Graph as D2DGraph} from "./Graph";

var app = express();
var router = express.Router();
var port = 8045;
var graph = null;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get( '/', function( req, res ) {
    res.sendFile( path.join( __dirname, 'client', 'index.html' ));
  });

router.post('/update/graph', function (req, res) {
      var jsGraph = req.body.graph;
      let d2dGraph = new D2DGraph();
      var modelId = req.body.modelId;

      if(modelId){
          // parse plain guid to Guid object
          modelId = Common.Guid.parse(modelId);
      }else{
          modelId = Common.Guid.newGuid();
      }
      var d2d = d2dGraph.parse(JSON.stringify(jsGraph), modelId);
/*
      let dict: Common.Dictionary<string> = {};
      console.log("graph from memory", graph);
      var cmd = new Commands.AddModelCommand(
        Common.Guid.newGuid(), // id
        Common.Guid.newGuid(), // requestId
        Common.Guid.newGuid(), // sessionId
        Common.Guid.newGuid(), // elementId
        "FAM_NODE",
        dict
      );*/

      //var parsedCommand = Commands.CommandFactory.parse(cmd);

      res.send(JSON.stringify(d2d));
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
