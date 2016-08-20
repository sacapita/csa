"use strict";
var Common = require("cubitt-common");
var D2DModelElement_1 = require("./D2DModelElement");
var D2DNodeElement_1 = require("./D2DNodeElement");
var D2DConnectorElement_1 = require("./D2DConnectorElement");
var D2DEdgeElement_1 = require("./D2DEdgeElement");
var Draw2D = (function () {
    function Draw2D() {
        this.Elements = {};
    }
    Object.defineProperty(Draw2D.prototype, "elements", {
        get: function () {
            return this.Elements;
        },
        enumerable: true,
        configurable: true
    });
    Draw2D.prototype.deserialize = function (jsonObject) {
        var draw2d = new Draw2D();
        var models = jsonObject['models'];
        for (var modelKey in models) {
            var model = models[modelKey];
            var id = Common.Guid.parse(model["id"]);
            var properties = this.propertiesFromJSON(model["properties"]);
            draw2d.addModel(id, properties["type"], properties);
        }
        var nodes = jsonObject['nodes'];
        for (var nodeKey in nodes) {
            var node = nodes[nodeKey];
            var id = Common.Guid.parse(node["id"]);
            var properties = this.propertiesFromJSON(node["properties"]);
            var modelId = Common.Guid.parse(node["neighbours"]["models"]["parent"][0]);
            draw2d.addNode(id, properties["type"], modelId, properties);
        }
        var connectors = jsonObject['connectors'];
        for (var connectorKey in connectors) {
            var connector = connectors[connectorKey];
            var id = Common.Guid.parse(connector["id"]);
            var properties = this.propertiesFromJSON(connector["properties"]);
            var nodeId = Common.Guid.parse(connector["neighbours"]["nodes"]["parent"]["0"]);
            draw2d.addConnector(id, properties['type'], properties, nodeId);
        }
        var edges = jsonObject['edges'];
        for (var edgeKey in edges) {
            var edge = edges[edgeKey];
            var id = Common.Guid.parse(edge["id"]);
            var properties = this.propertiesFromJSON(edge["properties"]);
            var modelId = Common.Guid.parse(edge["neighbours"]["models"]["parent"][0]);
            var startConnector = Common.Guid.parse(edge["neighbours"]["connectors"]["parent"][0]);
            var endConnector = Common.Guid.parse(edge["neighbours"]["connectors"]["parent"][1]);
            draw2d.addEdge(id, properties["type"], modelId, startConnector, endConnector, properties);
        }
        return draw2d;
    };
    Draw2D.prototype.addModel = function (id, type, properties) {
        if (properties === void 0) { properties = {}; }
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        var model = new D2DModelElement_1.D2DModelElement(id, type, {});
        this.Elements[id.toString()] = model;
    };
    Draw2D.prototype.addNode = function (id, type, modelId, properties) {
        if (properties === void 0) { properties = {}; }
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        var node = new D2DNodeElement_1.D2DNodeElement(id, type, properties, modelId);
        this.Elements[id.toString()] = node;
        var model = this.getElement(modelId);
        model.AddElement(node);
    };
    Draw2D.prototype.addConnector = function (id, type, properties, nodeId) {
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        var connector = new D2DConnectorElement_1.D2DConnectorElement(id, type, properties, nodeId);
        this.Elements[id.toString()] = connector;
        var node = this.getElement(nodeId);
        node.addConnector(connector);
    };
    Draw2D.prototype.addEdge = function (id, type, modelId, startConnectorId, endConnectorId, properties) {
        if (properties === void 0) { properties = {}; }
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        var edge = new D2DEdgeElement_1.D2DEdgeElement(id, type, properties, modelId);
        this.Elements[id.toString()] = edge;
        var model = this.getElement(modelId);
        model.AddElement(edge);
    };
    Draw2D.prototype.getElement = function (id) {
        var elem = this.Elements[id.toString()];
        if (elem == undefined) {
            throw new Error("Element with GUID " + id.toString() + " not found");
        }
        return elem;
    };
    Draw2D.prototype.hasElement = function (id) {
        return this.Elements[id.toString()] !== undefined;
    };
    Draw2D.prototype.toJSON = function () {
        var project = [];
        for (var k in this.Elements) {
            var model = this.Elements[k];
            project.push(model.toJSON());
            break;
        }
        return project;
    };
    Draw2D.prototype.propertiesFromJSON = function (jsonProperties) {
        var properties = {};
        for (var propertyKey in jsonProperties) {
            properties[propertyKey] = jsonProperties[propertyKey];
        }
        return properties;
    };
    return Draw2D;
}());
exports.Draw2D = Draw2D;
