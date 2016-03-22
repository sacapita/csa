"use strict";
var graph = require("cubitt-graph");
var commands = require("cubitt-commands");
var http = require("http");
var fs = require("fs");
var express = require('express');
var router = express.Router();
var path    = require("path");

var app = express();
app.set('views', './views');

app.get("/", function(req, res){
	res.sendFile(path.join(__dirname+'/views/index.html'));
});
app.listen(8000);
console.log("Listening on 127.0.0.1:8000");