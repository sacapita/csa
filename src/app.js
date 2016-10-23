/// <reference path='./typings/tsd.d.ts' />
"use strict";
var Common = require("cubitt-common");
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');
var Graph_1 = require("./Graph");
var CommandGenerator_1 = require("./CommandGenerator");
var Draw2D_1 = require("./Draw2D");
var app = express();
var router = express.Router();
var host = "http://185.3.208.201";
var appPort = 12345;
var backendPort = 8080;
var graph = null;
var sessionId;
var cg = null; // CommandGenerator
var d2dGraph;
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
routes();
router.use(express.static(__dirname + '/client'));
app.use('/', router);
app.listen(appPort, function () {
    console.log('Running at ' + host + ':' + appPort);
});
function routes() {
    router.get('/', function (req, res) {
        //sessionId = Common.Guid.newGuid();
        sessionId = Common.Guid.parse("cd46e14a-97ca-40e3-81be-ae1c18e7e114");
        console.log("sessionId for this session: " + sessionId.toString());
        console.log("-----------------------------------------");
        d2dGraph = new Graph_1.Graph();
        cg = new CommandGenerator_1.CommandGenerator(sessionId);
        sendCommands("/projects", { "id": sessionId });
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
        res.sendFile(path.join(__dirname, 'client', 'index.html'));
    });
    router.get('/app/project', function (req, res) {
        var url = host + ":" + backendPort + "/projects/" + sessionId + "/latest";
        request({
            url: url,
            method: "GET",
            json: true
        }, function (error, response, resBody) {
            if (error) {
                res.send("An error occured while GET: " + url);
            }
            else {
                var draw2d = new Draw2D_1.Draw2D();
                console.log(resBody);
                var deserializedProject = draw2d.deserialize(resBody);
                //draw2d.toJSON();
                res.send(deserializedProject);
            }
        });
    });
    // Called when a change is made to the Draw2D commandstack, propagate changes to cubitt to store them
    /*router.post('/update/graph', function (req, res) {
      var jsGraph = req.body.graph;
      var d2d = d2dGraph.serialize(JSON.stringify(jsGraph));
  
      let commands = cg.processGraph(d2d);
      sendCommands("/api/commands", commands);
      //console.log("-------> sendCommands is commented <-------- in " + __filename);
      res.send(JSON.stringify(commands));
    });*/
    // Called when a thumbnail is dropped onto the canvas to add a model
    router.post('/update/graph/model', function (req, res) {
        var model = req.body.model;
        console.log(model + " dropped on the canvas");
        var modelQuery = null; // TODO
        var result = getQuery(modelQuery);
        var draw2d = new Draw2D_1.Draw2D();
        var deserializedProject = draw2d.deserialize(result);
        //Return a project object (draw2d) with only the chosen model??
        res.send({ status: 200, message: "OK", data: deserializedProject });
    });
    // Called when a change is made to the Draw2D commandstack, propagate changes to cubitt to store them
    router.post('/graph/incremental', function (req, res) {
        var type = req.body.type;
        var elemId = req.body.elemId;
        var updates = req.body.updates;
        var commands = [];
        // Split multiple items of the request as multiple commands to form one transaction
        for (var key in updates) {
            var cmd = cg.incrementalCommand(type, elemId, key, updates[key]);
            commands.push(cmd);
        }
        // Send commands array to the command handler
        sendCommands("/projects/" + sessionId.toString(), { "commands": commands });
        res.send({ status: 200, message: "OK" });
    });
}
function getQuery(query) {
    // AJAX to query handler of cubitt
    var response = null;
    return response;
}
//Path with starting slash
function sendCommands(path, body, method) {
    if (method === void 0) { method = "POST"; }
    // AJAX to command handler of cubitt
    var url = 'http://localhost:' + backendPort + path;
    console.log("request to: ", url);
    var ant = "";
    request({
        url: url,
        method: method,
        json: true,
        headers: {
            "content-type": "application/json"
        },
        body: body
    }, function (error, response, resBody) {
        if (error) {
            console.log(error);
        }
        else {
            ant = resBody;
            console.log(response.statusCode, resBody);
        }
    });
}
