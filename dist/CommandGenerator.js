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
        for (var k in graph.elements) {
            var item = graph.elements[k];
            if (item.getType() == ElementType_1.ElementType.Model) {
                var elements = this.getModelElements(item, graph);
                var modelId = item.Id;
                this.Commands.push(new Commands.AddModelCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, item.Id, item.getProperty("type") + "_MODEL", item.getProperties()));
                for (var key in elements) {
                    var elem = elements[key];
                    switch (elem.getType()) {
                        case ElementType_1.ElementType.Node:
                            this.Commands.push(new Commands.AddNodeCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_NODE", elem.getProperties(), modelId));
                            break;
                        case ElementType_1.ElementType.Connector:
                            this.Commands.push(new Commands.AddConnectorCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_CONNECTOR", elem.getProperties(), modelId));
                            break;
                        case ElementType_1.ElementType.Edge:
                            var edgeElement = elem;
                            this.Commands.push(new Commands.AddEdgeCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_EDGE", elem.getProperties(), modelId, edgeElement.getStartConnector(), edgeElement.getEndConnector()));
                            break;
                    }
                }
            }
        }
        return this.Commands;
    };
    CommandGenerator.prototype.getModelElements = function (model, graph) {
        var elements = [];
        var children = [];
        children = model.getNodeNeighbours().concat(model.getEdgeNeighbours());
        for (var k in children) {
            elements.push(graph.getElement(children[k]));
        }
        return elements;
    };
    return CommandGenerator;
}());
exports.CommandGenerator = CommandGenerator;
