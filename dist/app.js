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
var cg = null;
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
        sessionId = Common.Guid.parse("cd46e14a-97ca-40e3-81be-ae1c18e7e114");
        console.log("sessionId for this session: " + sessionId.toString());
        d2dGraph = new Graph_1.Graph();
        cg = new CommandGenerator_1.CommandGenerator(sessionId);
        sendCommands("/projects", { "id": sessionId });
        res.sendFile(path.join(__dirname, 'client', 'index.html'));
    });
    router.get('/app/project', function (req, res) {
        var url = host + ":" + backendPort + "/projects/" + sessionId + "/latest";
        console.log(url);
        request({
            url: url,
            method: "GET",
            json: true,
        }, function (error, response, resBody) {
            if (error) {
                res.send("An error occured while GET: " + url);
            }
            else {
                var draw2d = new Draw2D_1.Draw2D();
                var deserializedProject = draw2d.deserialize(resBody);
                draw2d.toJSON();
                res.send(deserializedProject);
            }
        });
    });
    router.post('/update/graph', function (req, res) {
        var jsGraph = req.body.graph;
        var d2d = d2dGraph.serialize(JSON.stringify(jsGraph));
        var commands = cg.processGraph(d2d);
        sendCommands("/api/commands", commands);
        res.send(JSON.stringify(commands));
    });
    router.post('/update/graph/model', function (req, res) {
        var model = req.body.model;
        console.log(model + " in backend");
        var modelQuery = null;
        var result = getQuery(modelQuery);
        var draw2d = new Draw2D_1.Draw2D();
        var deserializedProject = draw2d.deserialize(result);
        res.send({ status: 200, message: "OK", data: deserializedProject });
    });
    router.post('/graph/incremental', function (req, res) {
        var type = req.body.type;
        var elemId = req.body.elemId;
        var updates = req.body.updates;
        var commands = [];
        console.log("incremental");
        for (var key in updates) {
            console.log("create command");
            var cmd = cg.incrementalCommand(type, elemId, key, updates[key]);
            console.log(cmd);
            commands.push(cmd);
        }
        res.send({ status: 200, message: "OK" });
    });
}
function getQuery(query) {
    var response = null;
    return response;
}
function sendCommands(path, body, method) {
    if (method === void 0) { method = "POST"; }
    var url = 'http://localhost:' + backendPort + path;
    console.log("request to: ", url);
    var ant = "";
    request({
        url: url,
        method: method,
        json: true,
        headers: {
            "content-type": "application/json",
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