/*
 * Temporary query service until backend provides one
 */
"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var cubitt_graph_cqrs_1 = require("cubitt-graph-cqrs");
var commands = require('cubitt-commands');
var graph = new cubitt_graph_cqrs_1.CQRSGraph();
var app = express();
app.use(bodyParser.json());
var router = express.Router();

router.post('/query', function (req, res) {
	console.log("http://localhost:9090");
	console.log(graph);
	//graph.addNode();
  return res.send(JSON.stringify(graph));
});
app.use('/api', router);

var port = 9090;
app.listen(port, function () {
    console.log('Running at http://localhost:' + port);
});
