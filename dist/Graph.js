"use strict";
var Common = require("cubitt-common");
var ElementType_1 = require("./ElementType");
var NodeElement_1 = require("./NodeElement");
var ConnectorElement_1 = require("./ConnectorElement");
var EdgeElement_1 = require("./EdgeElement");
var ModelElement_1 = require("./ModelElement");
var Graph = (function () {
    function Graph() {
        this.Elements = {};
    }
    Graph.prototype.getElements = function () {
        return this.Elements;
    };
    Graph.prototype.getModelId = function () {
        return this.modelId;
    };
    Graph.prototype.parse = function (jsGraph, modelId) {
        var graph = new Graph();
        var json = JSON.parse(jsGraph);
        this.modelId = modelId;
        this.addModel(modelId, "DRAW2D_MODEL", {});
        var ports = [];
        var _loop_1 = function(key) {
            var elem = json[key];
            var elemId = elem.id;
            var elemProperties = [];
            var connectorsToAdd = [];
            switch (elem.type) {
                case "TableShape":
                case "LabelShape":
                    for (var prop in elem) {
                        var value = elem[prop];
                        if (prop == "ports" && elem.hasOwnProperty(prop)) {
                            for (var port in value) {
                                var portObject = value[port];
                                var portProperties = [];
                                for (var portProps in portObject) {
                                    portProperties[portProps] = portObject[portProps];
                                }
                                var connector = { id: portObject.id, type: portObject.type, elemId: elemId, props: portProperties };
                                connectorsToAdd.push(connector);
                                ports[portProperties["name"]] = portObject.id;
                            }
                        }
                        else {
                            elemProperties[prop] = value;
                        }
                    }
                    this_1.addNode(elemId, elem.type, modelId, elemProperties);
                    var self_1 = this_1;
                    connectorsToAdd.forEach(function (currentValue, index, arr) { self_1.addConnector(currentValue.id, currentValue.type, currentValue.elemId, currentValue.props); });
                    break;
                case "draw2d.Connection":
                    startNodeId = null;
                    startConnectorId = null;
                    endNodeId = null;
                    endConnectorId = null;
                    for (var prop in elem) {
                        var value = elem[prop];
                        if (prop == "source" && elem.hasOwnProperty("source")) {
                            startNodeId = Common.Guid.parse(elem.source.node);
                            startConnectorId = Common.Guid.parse(ports[elem.source.port]);
                        }
                        else if (prop == "target" && elem.hasOwnProperty("target")) {
                            endNodeId = Common.Guid.parse(elem.target.node);
                            endConnectorId = Common.Guid.parse(ports[elem.target.port]);
                        }
                        else {
                            elemProperties[prop] = value;
                        }
                    }
                    this_1.addEdge(elemId, elem.type, modelId, startNodeId, startConnectorId, endNodeId, endConnectorId, elemProperties);
                    break;
            }
        };
        var this_1 = this;
        var startNodeId, startConnectorId, endNodeId, endConnectorId;
        for (var key in json) {
            _loop_1(key);
        }
        return this;
    };
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
        if (model.getType() != ElementType_1.ElementType.Model) {
            throw new Error("GUID " + modelId.toString() + " does not belong to a model");
        }
        properties["type"] = type;
        var node = new NodeElement_1.NodeElement(id, ElementType_1.ElementType.Node, properties);
        node.addModelNeighbour(modelId);
        model.addNodeNeighbour(id);
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
        if (model.getType() != ElementType_1.ElementType.Model) {
            throw new Error("Element with GUID " + modelId.toString() + " is not a Model");
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
        var edge = new EdgeElement_1.EdgeElement(id, ElementType_1.ElementType.Edge, properties);
        edge.addStartConnector(startConnectorId);
        edge.addEndConnector(endConnectorId);
        startConnector.addEdgeNeighbour(id);
        endConnector.addEdgeNeighbour(id);
        model.addEdgeNeighbour(id);
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
        var connector = new ConnectorElement_1.ConnectorElement(id, ElementType_1.ElementType.Connector, properties);
        node.addConnectorNeighbour(id);
        connector.addNodeNeighbour(nodeId);
        this.Elements[id.toString()] = connector;
    };
    Graph.prototype.addModel = function (id, type, properties) {
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        properties["type"] = type;
        var model = new ModelElement_1.ModelElement(id, ElementType_1.ElementType.Model, properties);
        this.Elements[id.toString()] = model;
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
        var elements = this.Elements;
        for (var key in elements) {
            var elem = elements[key];
            var obj = {
                "id": elem.Id.toString(),
                "properties": elem.getProperties(),
                "neighbours": {
                    "models": elem.getModelNeighbours().map(function (val) { return val.toString(); }),
                    "nodes": elem.getNodeNeighbours().map(function (val) { return val.toString(); }),
                    "edges": elem.getEdgeNeighbours().map(function (val) { return val.toString(); }),
                    "connectors": elem.getConnectorNeighbours().map(function (val) { return val.toString(); })
                }
            };
            if (elem.getType() == ElementType_1.ElementType.Node) {
                graph.nodes[elem.Id.toString()] = obj;
            }
            else if (elem.getType() == ElementType_1.ElementType.Edge) {
                graph.edges[elem.Id.toString()] = obj;
            }
            else if (elem.getType() == ElementType_1.ElementType.Connector) {
                graph.connectors[elem.Id.toString()] = obj;
            }
            else {
                graph.models[elem.Id.toString()] = obj;
            }
        }
        return graph;
    };
    return Graph;
}());
exports.Graph = Graph;
