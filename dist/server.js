"use strict";
var Common = require("cubitt-common");
var Commands = require("cubitt-commands");
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var app = express();
var router = express.Router();
var port = 8045;
var graph = null;
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});
router.post('/update/graph', function (req, res) {
    var graph = req.body.graph;
    for (var elem in graph) {
    }
    var dict = {};
    console.log("graph from memory", graph);
    var cmd = new Commands.AddModelCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), Common.Guid.newGuid(), Common.Guid.newGuid(), "FAM_NODE", dict);
    res.send(JSON.stringify(cmd));
});
router.get('/graph', function (req, res) {
    var options = {
        host: 'localhost',
        port: 8001,
        path: '/api/query',
        method: 'POST'
    };
    http.request(options, cbFunction).end();
    var obj = { message: "foo" };
    obj.message = "response";
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
router.use(express.static(__dirname + '/client'));
app.use('/', router);
app.listen(port, function () {
    console.log('Running at http://localhost:' + port);
});
