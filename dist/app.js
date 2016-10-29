"use strict";
var Common = require("cubitt-common");
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');
var Graph_1 = require("./Graph");
var CommandGenerator_1 = require("./CommandGenerator");
var Draw2D_1 = require("./Draw2D");
var D2DModelElement_1 = require("./D2DModelElement");
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
        console.log("-----------------------------------------");
        d2dGraph = new Graph_1.Graph();
        cg = new CommandGenerator_1.CommandGenerator(sessionId);
        sendCommands("/projects", { "id": sessionId });
        res.sendFile(path.join(__dirname, 'client', 'index.html'));
    });
    router.get('/app/project', function (req, res) {
        var self = this;
        var url = host + ":" + backendPort + "/projects/" + sessionId + "/latest";
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
                var output = [];
                for (var e in deserializedProject.Elements) {
                    if (deserializedProject.Elements[e] instanceof D2DModelElement_1.D2DModelElement) {
                        output.push(deserializedProject.Elements[e]);
                    }
                }
                res.send(output);
            }
        });
    });
    router.post('/update/graph/model', function (req, res) {
        var model = req.body.model;
        console.log(model + " dropped on the canvas");
        var modelQuery = null;
        var result = getQuery(modelQuery);
        var draw2d = new Draw2D_1.Draw2D();
        var deserializedProject = draw2d.deserialize(result);
        res.send({ status: 200, message: "OK", data: deserializedProject });
    });
    router.post('/graph/incremental', function (req, res) {
        var commandType = req.body.commandType;
        var elementType = req.body.elementType;
        var elemId = req.body.elemId;
        var modelId = req.body.modelId;
        var updates = req.body.updates;
        var commands = [];
        if (commandType == "add") {
            commands.push(cg.createAddCommand(elementType, elemId, modelId, updates));
        }
        else if (commandType == "setproperty") {
            for (var key in updates) {
                var cmd = cg.createISetPropertyCommand(elementType, elemId, key, updates[key]);
                commands.push(cmd);
            }
        }
        console.log(commands);
        sendCommands("/projects/" + sessionId.toString(), { "commands": commands });
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
            console.log(response.statusCode, resBody, response.statusMessage);
        }
    });
}
