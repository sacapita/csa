"use strict";
var Common = require("cubitt-common");
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');
var Graph_1 = require("./Graph");
var CommandGenerator_1 = require("./CommandGenerator");
var app = express();
var router = express.Router();
var port = 8045;
var graph = null;
var sessionId;
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.get('/', function (req, res) {
    sessionId = Common.Guid.newGuid();
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});
router.post('/update/graph', function (req, res) {
    var jsGraph = req.body.graph;
    var d2dGraph = new Graph_1.Graph();
    var modelId = req.body.modelId;
    var d2d = d2dGraph.parse(JSON.stringify(jsGraph));
    var cg = new CommandGenerator_1.CommandGenerator(sessionId);
    var commands = cg.process(d2d);
    sendCommands(commands);
    res.send(JSON.stringify(d2d));
});
function cbFunction(response) {
    var str = '';
    response.on('data', function (chunk) {
        str += chunk;
    });
    response.on('end', function () {
        graph = JSON.parse(str);
        console.log(graph);
    });
}
function sendCommands(commands) {
    request({
        url: 'http://localhost:9090/api/command',
        method: 'POST',
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: { commands: JSON.stringify(commands) }
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(response.statusCode, body);
        }
    });
}
router.use(express.static(__dirname + '/client'));
app.use('/', router);
app.listen(port, function () {
    console.log('Running at http://localhost:' + port);
});
