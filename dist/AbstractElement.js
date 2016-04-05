"use strict";
var AbstractElement = (function () {
    function AbstractElement(id, properties) {
        if (properties === void 0) { properties = {}; }
        this.id = id;
        this.properties = properties;
    }
    Object.defineProperty(AbstractElement.prototype, "Id", {
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    AbstractElement.prototype.addNodeNeighbour = function (id) {
        this.nodeNeighbours[id.toString()] = id;
    };
    AbstractElement.prototype.addEdgeNeighbour = function (id) {
        this.edgeNeighbours[id.toString()] = id;
    };
    AbstractElement.prototype.addConnectorNeighbour = function (id) {
        this.connectorNeighbours[id.toString()] = id;
    };
    AbstractElement.prototype.addModelNeighbour = function (id) {
        this.modelNeighbours[id.toString()] = id;
    };
    AbstractElement.prototype.setProperty = function (name, value) {
        this.properties[name] = value;
    };
    AbstractElement.prototype.getProperty = function (name) {
        return this.properties[name];
    };
    AbstractElement.prototype.getProperties = function () {
        return this.properties;
    };
    return AbstractElement;
}());
exports.AbstractElement = AbstractElement;
