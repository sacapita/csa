"use strict";
var Common = require("cubitt-common");
var Commands = require('cubitt-commands');
var ElementType_1 = require("./ElementType");
var CommandGenerator = (function () {
    function CommandGenerator(sessionId) {
        this.sessionId = sessionId;
        this.Commands = [];
    }
    CommandGenerator.prototype.process = function (graph) {
        var elements = graph.getElements();
        for (var key in elements) {
            var elem = elements[key];
            switch (elem.getType()) {
                case ElementType_1.ElementType.Model:
                    this.Commands.push(new Commands.AddModelCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_MODEL", elem.getProperties()));
                    break;
                case ElementType_1.ElementType.Node:
                    this.Commands.push(new Commands.AddNodeCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_NODE", elem.getProperties(), graph.getModelId()));
                    break;
                case ElementType_1.ElementType.Connector:
                    this.Commands.push(new Commands.AddConnectorCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_CONNECTOR", elem.getProperties(), graph.getModelId()));
                    break;
                case ElementType_1.ElementType.Edge:
                    var edgeElement = elem;
                    this.Commands.push(new Commands.AddEdgeCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_EDGE", elem.getProperties(), graph.getModelId(), edgeElement.getStartConnector(), edgeElement.getEndConnector()));
                    break;
            }
        }
        console.log(this.Commands);
    };
    return CommandGenerator;
}());
exports.CommandGenerator = CommandGenerator;
