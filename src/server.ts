/// <reference path='./typings/tsd.d.ts' />
import {GraphInterface} from "cubitt-graph";
import * as Common from "cubitt-common";
import * as Commands from "cubitt-commands";
import express = require('express');
import bodyParser = require('body-parser');
import http = require('http');
import request = require('request');
import path = require('path');
import {Graph as D2DGraph} from "./Graph";
import {CommandGenerator} from "./CommandGenerator";

var app = express();
var router = express.Router();
var port = 8045;
var graph = null;
var sessionId: Common.Guid;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get( '/', function( req, res ) {
    sessionId = Common.Guid.newGuid();
    res.sendFile( path.join( __dirname, 'client', 'index.html' ));
  });

router.post('/update/graph', function (req, res) {
      var jsGraph = req.body.graph;
      let d2dGraph = new D2DGraph();
      var d2d = d2dGraph.serialize(JSON.stringify(jsGraph));

      let cg = new CommandGenerator(sessionId);
      let commands = cg.process(d2d);
      //sendCommands(commands);
      console.log("-------> sendCommands is commented <-------- in " + __filename);

      res.send(JSON.stringify(commands));
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

function sendCommands(commands){
    //console.log(commands, JSON.stringify(commands));
    //Lets configure and request
    request({
        url: 'http://localhost:9090/api/command',
        method: 'POST',
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: { commands: JSON.stringify(commands) }
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
        }
    });
}

router.use(express.static(__dirname + '/client'));

app.use('/', router);
app.listen(port, function () {
    console.log('Running at http://localhost:' + port);
});
