"use strict";
var ElementType_1 = require("./ElementType");
var NodeElement_1 = require("./NodeElement");
var ConnectorElement_1 = require("./ConnectorElement");
var EdgeElement_1 = require("./EdgeElement");
var Graph = (function () {
    function Graph() {
        this.Elements = {};
    }
    Graph.prototype.getElement = function (id) {
        var elem = this.Elements[id.toString()];
        if (elem == undefined) {
            throw new Error("Element with GUID " + id.toString() + " not found");
        }
        return elem;
    };
    Graph.prototype.hasElement = function (id) {
        return this.Elements[id.toString()] !== undefined;
    };
    Graph.prototype.addNode = function (id, type, modelId, properties) {
        if (properties === void 0) { properties = {}; }
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        var model = this.Elements[modelId.toString()];
        if (model == undefined) {
            throw new Error("No model with GUID " + modelId + " could be found");
        }
        properties["type"] = type;
        var node = new NodeElement_1.NodeElement(id, properties);
        node.addModelNeighbour(modelId);
        this.Elements[node.Id.toString()] = node;
    };
    Graph.prototype.addEdge = function (id, type, modelId, startNodeId, startConnectorId, endNodeId, endConnectorId, properties) {
        if (properties === void 0) { properties = {}; }
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        var model = this.Elements[modelId.toString()];
        if (model == undefined) {
            throw new Error("No model with GUID " + modelId + " could be found");
        }
        var startConnector = this.Elements[startConnectorId.toString()];
        if (startConnector == undefined) {
            throw new Error("No startConnector with GUID " + startConnectorId + " could be found");
        }
        if (startConnector.getType() != ElementType_1.ElementType.Connector) {
            throw new Error("Invalid startConnectorId, " + startConnectorId + " does not belong to a connector");
        }
        var endConnector = this.Elements[endConnectorId.toString()];
        if (endConnector == undefined) {
            throw new Error("No endConnector with GUID " + endConnectorId + " could be found");
        }
        if (endConnector.getType() != ElementType_1.ElementType.Connector) {
            throw new Error("Invalid endConnectorId, " + endConnectorId + " does not belong to a connector");
        }
        properties["type"] = type;
        var edge = new EdgeElement_1.EdgeElement(id, properties);
        edge.addStartConnector(startConnectorId);
        edge.addEndConnector(endConnectorId);
        startConnector.addEdgeNeighbour(id);
        endConnector.addEdgeNeighbour(id);
        edge.addModelNeighbour(modelId);
        this.Elements[id.toString()] = edge;
    };
    Graph.prototype.addConnector = function (id, type, nodeId, properties) {
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        var node = this.Elements[nodeId.toString()];
        if (node == undefined) {
            throw new Error("No node with GUID " + nodeId + " could be found");
        }
        if (node.getType() != ElementType_1.ElementType.Node) {
            throw new Error("Invalid nodeId, " + nodeId + " does not belong to a Node");
        }
        properties["type"] = type;
        var connector = new ConnectorElement_1.ConnectorElement(id, properties);
        node.addConnectorNeighbour(id);
        connector.addNodeNeighbour(nodeId);
        this.Elements[id.toString()] = connector;
    };
    Graph.prototype.deserialize = function (jsonObject) {
        var graph = new Graph();
        return graph;
    };
    Graph.prototype.propertiesFromJSON = function (jsonProperties) {
        var properties = {};
        for (var propertyKey in jsonProperties) {
            properties[propertyKey] = jsonProperties[propertyKey];
        }
        return properties;
    };
    Graph.prototype.serialize = function () {
        var graph = {
            "models": {},
            "nodes": {},
            "edges": {},
            "connectors": {}
        };
        return graph;
    };
    return Graph;
}());
exports.Graph = Graph;
