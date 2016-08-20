"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var graph = null;
var app = express();
app.use(bodyParser.json());
var router = express.Router();
router.post('/query', function (req, res) {
    console.log("http://localhost:9090");
    console.log(graph);
    return res.send(JSON.stringify(graph));
});
app.use('/api', router);
var port = 8001;
app.listen(port, function () {
    console.log('Running at http://localhost:' + port);
});
