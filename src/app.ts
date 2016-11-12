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
import {D2DAbstractElement} from "./D2DAbstractElement"
import {D2DModelElement} from "./D2DModelElement"

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
    console.log("-----------------------------------------");

    d2dGraph = new D2DGraph();
    cg = new CommandGenerator(sessionId);

    //Setup database table for the sessionID
    // sendCommands("/projects", {"id" : sessionId});

    /*
    let removedModelsCommands = cg.removeState();
    setTimeout(function() {
      console.log("delete models");
      console.log(removedModelsCommands);
      sendCommands("/projects/" + sessionId, {commands: removedModelsCommands}, "POST");
    }, 1000);*/

    //
    // let cmds = cg.buildState();
    // setTimeout(function() {
    //   console.log(cmds);
    //   sendCommands("/projects/" + sessionId, {"commands": cmds});
    // }, 4000);

    res.sendFile( path.join( __dirname, 'client', 'index.html' ));
  });

  router.get( '/app/project', function( req, res ) {
    let self = this;
    let url = host + ":" + backendPort + "/projects/" + sessionId + "/latest";
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

        let output = [];
        for(let e in deserializedProject.Elements){
          if(deserializedProject.Elements[e] instanceof D2DModelElement){
            output.push(deserializedProject.Elements[e]);
          }
        }
        res.send(output);
      }
    });
  });

  // Called when a thumbnail is dropped onto the canvas to add a model
  router.post('/update/graph/model', function(req, res) {
    let model = req.body.model;
    console.log(model + " dropped on the canvas");
    let modelQuery = null; // TODO
    let result = getQuery(modelQuery);

    let draw2d = new Draw2D();
    let deserializedProject = draw2d.deserialize(result);
    //Return a project object (draw2d) with only the chosen model??

    res.send({status: 200, message: "OK", data: deserializedProject});
  });

  // Called when a change is made to the Draw2D commandstack, propagate changes to cubitt to store them
  router.post('/graph/incremental', function(req, res){
    var commandType = req.body.commandType;
    var elementType = req.body.elementType;
    var elemId = req.body.elemId;
    var modelId = req.body.modelId;
    var updates = req.body.updates;
    var commands: Object[] = [];

    // Split multiple items of the request as multiple commands to form one transaction
    if(commandType == "add"){
      commands.push(cg.createAddCommand(elementType, elemId, modelId, updates));
    }
    else if(commandType == "setproperty"){
      for(let key in updates){
          var cmd = cg.createISetPropertyCommand(elementType, elemId, key, updates[key]);
          commands.push(cmd);
      }
    }
console.log(commands);
    // Send commands array to the command handler
    sendCommands("/projects/" + sessionId, {"commands": commands});

    res.send({status: 200, message: "OK"});
  });
}

function getQuery(query): string{
  // AJAX to query handler of cubitt
  let response = null;
  return response;
}

//Path with starting slash
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
          console.log(response.statusCode, resBody, response.statusMessage);
      }
  });
}
