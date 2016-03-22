"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var cubitt_commands_1 = require("cubitt-commands");
var cubitt_graph_cqrs_1 = require("cubitt-graph-cqrs");
var app = express();
app.use(bodyParser.json());
var router = express.Router();
var graph = new cubitt_graph_cqrs_1.CQRSGraph();
router.post('/query', function (req, res) {
	var json = graph.getGraph().serialize(graph.getGraph());
    return res.json(json);
});
app.use('/api', router);
app.listen(9090);