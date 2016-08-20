/*
 * Temporary query service until backend provides one
 */
 /// <reference path='./typings/tsd.d.ts' />

 import express = require('express');
 import bodyParser = require('body-parser');
 import {CommandFactory} from "cubitt-commands";

 // Initialize empty graph for now
 var graph = null; //moet via backend opgehaald worden

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

var port = 8001;
app.listen(port, function () {
    console.log('Running at http://localhost:' + port);
});
