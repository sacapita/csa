/// <reference path='./typings/tsd.d.ts' />

declare var __dirname: any;
declare var __filename: any;

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
import {Draw2D} from "./Draw2D";

let app = express();
let router = express.Router();
let host = "http://185.3.208.201";
let appPort = 12345;
let backendPort = 8080;
let graph = null;
let sessionId: Common.Guid;
let cg = null; // CommandGenerator
let d2dGraph;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
routes();
router.use(express.static(__dirname + '/client'));
app.use('/', router);
app.listen(appPort, function () {
  console.log('Running at '+ host +':' + appPort);
});

function routes(){
  router.get( '/', function( req, res ) {
    //sessionId = Common.Guid.newGuid();
    sessionId = Common.Guid.parse("cd46e14a-97ca-40e3-81be-ae1c18e7e114");
    console.log("sessionId for this session: " + sessionId.toString());

    d2dGraph = new D2DGraph();
    cg = new CommandGenerator(sessionId);
    sendCommands("/projects", {"id" : sessionId});

    /*
    let removedModelsCommands = cg.removeState();
    setTimeout(function() {
      console.log("delete models");
      console.log(removedModelsCommands);
      sendCommands("/projects/" + sessionId, {commands: removedModelsCommands}, "POST");
    }, 1000);*/

    /*
    let cmds = cg.buildState();
    setTimeout(function() {
      console.log(cmds);
      sendCommands("/projects/" + sessionId, {commands: cmds}, "POST");
    }, 4000);*/

    res.sendFile( path.join( __dirname, 'client', 'index.html' ));
  });

  router.get( '/app/project', function( req, res ) {
    let url = host + ":" + backendPort + "/projects/" + sessionId + "/latest";
    console.log(url);
    request({
      url: url,
      method: "GET",
      json: true,
    }, function(error, response, resBody){
      if(error) {
        res.send("An error occured while GET: " + url);
      } else {
        let draw2d = new Draw2D();
        let deserializedProject = draw2d.deserialize(resBody);
        draw2d.toJSON();
        res.send(deserializedProject);
      }
    });
  });

  // Called when a change is made to the Draw2D commandstack, propagate changes to cubitt to store them
  router.post('/update/graph', function (req, res) {
    var jsGraph = req.body.graph;
    var d2d = d2dGraph.serialize(JSON.stringify(jsGraph));

    let commands = cg.processGraph(d2d);
    sendCommands("/api/commands", commands);
    //console.log("-------> sendCommands is commented <-------- in " + __filename);
    res.send(JSON.stringify(commands));
  });

  // Called when a thumbnail is dropped onto the canvas to add a model
  router.post('/update/graph/model', function(req, res) {
    let model = req.body.model;
    console.log(model + " in backend");
    let modelQuery = null; // TODO
    let result = getQuery(modelQuery);

    let draw2d = new Draw2D();
    let deserializedProject = draw2d.deserialize(result);
    //Return a project object (draw2d) with only the chosen model??

    res.send({status: 200, message: "OK", data: deserializedProject});
  });

  // TODO: DREPRECATED use /graph/incremental instead ??
  router.post('/graph/incremental', function(req, res){
    var type = req.body.type;
    var elemId = req.body.elemId;
    var updates = req.body.updates;
    var commands: Commands.Command[] = [];
    console.log("incremental");

    // Split multiple items of the request as multiple commands to form one transaction
    for(let key in updates){
        console.log("create command");
        var cmd = cg.incrementalCommand(type, elemId, key, updates[key]);
        console.log(cmd);
        commands.push(cmd);
    }

    // Send commands array to the command handler
    //sendCommands("/api/commands", commands);

    res.send({status: 200, message: "OK"});
  });
}

function getQuery(query): string{
  // AJAX to query handler of cubitt
  let response = null;
  return response;
}

//Path with starting /
function sendCommands(path: string, body: Object, method = "POST"): void{

  // AJAX to command handler of cubitt
  let url = 'http://localhost:' + backendPort + path;
  console.log("request to: ", url);
  let ant = "";
  request({
      url: url,
      method: method,
      json: true,
      headers: {
          "content-type": "application/json",
      },
      body: body
  }, function(error, response, resBody){
      if(error) {
          console.log(error);
      } else {
          ant = resBody;
          console.log(response.statusCode, resBody);
      }
  });
}
