"use strict";
var Common = require("cubitt-common");
var Commands = require('cubitt-commands');
var ElementType_1 = require("./ElementType");
var CommandGenerator = (function () {
    function CommandGenerator(sessionId) {
        this.sessionId = sessionId;
    }
    CommandGenerator.prototype.processGraph = function (graph) {
        var commands = [];
        for (var k in graph.elements) {
            var item = graph.elements[k];
            if (item.getType() == ElementType_1.ElementType.Model) {
                var elements = this.getModelElements(item, graph);
                var modelId = item.Id;
                commands.push(new Commands.AddModelCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, item.Id, item.getProperty("type") + "_MODEL", item.getProperties()));
                for (var key in elements) {
                    var elem = elements[key];
                    switch (elem.getType()) {
                        case ElementType_1.ElementType.Node:
                            commands.push(new Commands.AddNodeCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_NODE", elem.getProperties(), modelId));
                            break;
                        case ElementType_1.ElementType.Connector:
                            commands.push(new Commands.AddConnectorCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_CONNECTOR", elem.getProperties(), modelId));
                            break;
                        case ElementType_1.ElementType.Edge:
                            var edgeElement = elem;
                            commands.push(new Commands.AddEdgeCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_EDGE", elem.getProperties(), modelId, edgeElement.getStartConnector(), edgeElement.getEndConnector()));
                            break;
                    }
                }
            }
        }
        return commands;
    };
    CommandGenerator.prototype.incrementalCommand = function (type, elemId, key, value) {
        var command;
        var elementType = ElementType_1.ElementType[type];
        switch (elementType) {
            case ElementType_1.ElementType.Node:
                command = new Commands.SetNodePropertyCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, Common.Guid.parse(elemId), key, value);
                break;
            case ElementType_1.ElementType.Edge:
                command = new Commands.SetEdgePropertyCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, Common.Guid.parse(elemId), key, value);
                break;
            case ElementType_1.ElementType.Model:
                command = new Commands.SetModelPropertyCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, Common.Guid.parse(elemId), key, value);
                break;
            case ElementType_1.ElementType.Connector:
                command = new Commands.SetConnectorPropertyCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, Common.Guid.parse(elemId), key, value);
                break;
            default:
                throw new Error("CREATE COMMAND ERROR: ElementType does not matching any existing ElementTypes");
        }
        return command;
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
