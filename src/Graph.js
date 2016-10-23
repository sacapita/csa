"use strict";
var Common = require("cubitt-common");
var ElementType_1 = require("./ElementType");
var NodeElement_1 = require("./NodeElement");
var ConnectorElement_1 = require("./ConnectorElement");
var EdgeElement_1 = require("./EdgeElement");
var ModelElement_1 = require("./ModelElement");
/**
 * Draw2D Graph object containing nodes, connectors and edges
 *
 */
var Graph = (function () {
    function Graph() {
        this.Elements = {};
    }
    Object.defineProperty(Graph.prototype, "elements", {
        get: function () {
            return this.Elements;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Convert a JSON Draw2D graph object to a Graph
     */
    Graph.prototype.serialize = function (jsGraph) {
        var graph = new Graph();
        var json = JSON.parse(jsGraph);
        for (var m in json) {
            var model = json[m];
            var modelId = (model.id ? Common.Guid.parse(model.id) : Common.Guid.newGuid());
            this.addModel(modelId, model.type, {});
            var ports = []; // ports from Draw2D aka connectors for this object
            var _loop_1 = function(key) {
                var elem = model.elements[key];
                var elemId = elem.id;
                var elemProperties = [];
                var connectorsToAdd = [];
                switch (elem.type) {
                    case "csa.Edge":
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
                                endConnectorId = Common.Guid.parse(elem.target.port.substring(6, elem.target.port.length));
                            }
                            else {
                                elemProperties[prop] = value;
                            }
                        }
                        this_1.addEdge(elemId, elem.type, modelId, startNodeId, startConnectorId, endNodeId, endConnectorId, elemProperties);
                        break;
                    default:
                        for (var prop in elem) {
                            var value = elem[prop];
                            if (prop == "ports" && elem.hasOwnProperty(prop)) {
                                for (var port in value) {
                                    // Add connector for each port
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
                }
            };
            var this_1 = this;
            var startNodeId, startConnectorId, endNodeId, endConnectorId;
            for (var key in model.elements) {
                _loop_1(key);
            }
        }
        return this;
    };
    /**
     * Returns an element given an GUID
     *
     * @param id GUID representing an element identifier
     */
    Graph.prototype.getElement = function (id) {
        var elem = this.Elements[id.toString()];
        if (elem == undefined) {
            throw new Error("Element with GUID " + id.toString() + " not found");
        }
        return elem;
    };
    /**
     * @inheritdoc
     */
    Graph.prototype.hasElement = function (id) {
        return this.Elements[id.toString()] !== undefined;
    };
    /**
     * @inheritdoc
     */
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
    /**
     * @inheritdoc
     */
    Graph.prototype.addEdge = function (id, type, modelId, startNodeId, startConnectorId, endNodeId, endConnectorId, properties) {
        if (properties === void 0) { properties = {}; }
        // Validate GUID
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        // Validate modelID
        var model = this.Elements[modelId.toString()];
        if (model == undefined) {
            throw new Error("No model with GUID " + modelId + " could be found");
        }
        if (model.getType() != ElementType_1.ElementType.Model) {
            throw new Error("Element with GUID " + modelId.toString() + " is not a Model");
        }
        // Validate startConnector
        var startConnector = this.Elements[startConnectorId.toString()];
        if (startConnector == undefined) {
            throw new Error("No startConnector with GUID " + startConnectorId + " could be found");
        }
        if (startConnector.getType() != ElementType_1.ElementType.Connector) {
            throw new Error("Invalid startConnectorId, " + startConnectorId + " does not belong to a connector");
        }
        // Validate endConnectorId
        // NOTICE
        // Commented because inter-model edges do not work in this construction
        // The end node and thus connector are not yet defined when the source model is the first model to be parsed
        /* var endConnector = this.Elements[endConnectorId.toString()];
         if (endConnector == undefined) {
             throw new Error("No endConnector with GUID " + endConnectorId + " could be found");
         }
        if (endConnector.getType() != ElementType.Connector) {
             throw new Error("Invalid endConnectorId, "  + endConnectorId + " does not belong to a connector");
         }*/
        properties["type"] = type;
        var edge = new EdgeElement_1.EdgeElement(id, ElementType_1.ElementType.Edge, properties);
        // By convention, element 0 is the start item, 1 is the end
        edge.addStartConnector(startConnectorId);
        edge.addEndConnector(endConnectorId);
        startConnector.addEdgeNeighbour(id);
        // endConnector.addEdgeNeighbour(id);
        model.addEdgeNeighbour(id);
        edge.addModelNeighbour(modelId);
        this.Elements[id.toString()] = edge;
    };
    /**
     * @inheritdoc
     */
    Graph.prototype.addConnector = function (id, type, nodeId, properties) {
        // Validate GUID
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        // Validate nodeId exists
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
    /**
     * @inheritdoc
     */
    Graph.prototype.addModel = function (id, type, properties) {
        // Validate GUID
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        properties["type"] = type;
        var model = new ModelElement_1.ModelElement(id, ElementType_1.ElementType.Model, properties);
        this.Elements[id.toString()] = model;
    };
    /**
     * Creates a Property dictionary from JSON
     *
     * @param jsonProperties JSON object that contains the properties
     */
    Graph.prototype.propertiesFromJSON = function (jsonProperties) {
        var properties = {};
        for (var propertyKey in jsonProperties) {
            properties[propertyKey] = jsonProperties[propertyKey];
        }
        return properties;
    };
    return Graph;
}());
exports.Graph = Graph;
