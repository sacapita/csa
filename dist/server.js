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
var cg = null;
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.get('/', function (req, res) {
    sessionId = Common.Guid.newGuid();
    cg = new CommandGenerator_1.CommandGenerator(sessionId);
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});
router.post('/update/graph', function (req, res) {
    var jsGraph = req.body.graph;
    var d2dGraph = new Graph_1.Graph();
    var d2d = d2dGraph.serialize(JSON.stringify(jsGraph));
    var commands = cg.processGraph(d2d);
    console.log("-------> sendCommands is commented <-------- in " + __filename);
    res.send(JSON.stringify(commands));
});
router.post('/graph/incremental', function (req, res) {
    var type = req.body.type;
    var elemId = req.body.elemId;
    var updates = req.body.updates;
    var commands = [];
    console.log("incremental");
    for (var key in updates) {
        commands.push(cg.incrementalCommand(type, elemId, key, updates[key]));
    }
    res.send({ status: 200, message: "OK" });
});
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
