"use strict";
var ElementType_1 = require("./ElementType");
var AbstractElement = (function () {
    /**
     * @param id GUID of the Element that is created
     * @param properties of the Element
     */
    function AbstractElement(id, type, properties) {
        if (properties === void 0) { properties = {}; }
        this.id = id;
        this.type = type;
        this.properties = properties;
        this.nodeNeighbours = {};
        this.edgeNeighbours = {};
        this.connectorNeighbours = {};
        this.modelNeighbours = {};
    }
    Object.defineProperty(AbstractElement.prototype, "Id", {
        /**
         * Returns identifier of this element
         */
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a neighbour of type Node to this Element
     *
     * @param id Guid of the element that should be added
     */
    AbstractElement.prototype.addNodeNeighbour = function (id) {
        this.nodeNeighbours[id.toString()] = id;
    };
    /**
     * Adds a Neighbour of type Edge to this Element
     *
     * @param id Guid of the element that should be added
     */
    AbstractElement.prototype.addEdgeNeighbour = function (id) {
        this.edgeNeighbours[id.toString()] = id;
    };
    /**
     * Adds a neighbour of type Connector to this Element
     *
     * @param id Guid of the element that should be added
     */
    AbstractElement.prototype.addConnectorNeighbour = function (id) {
        this.connectorNeighbours[id.toString()] = id;
    };
    /**
     * Adds a neighbour of type Model to this Element
     *
     * @param id Guid of the element that should be added
     */
    AbstractElement.prototype.addModelNeighbour = function (id) {
        this.modelNeighbours[id.toString()] = id;
    };
    /**
     * Returns all neighbours, optionally filtered by ElementType
     *
     * @param type The elementtype to filter by, by default all elements are returned
     */
    AbstractElement.prototype.internalGetNeighbours = function (type) {
        if (type == ElementType_1.ElementType.Node) {
            return this.toArray(this.nodeNeighbours);
        }
        else if (type == ElementType_1.ElementType.Edge) {
            return this.toArray(this.edgeNeighbours);
        }
        else if (type == ElementType_1.ElementType.Connector) {
            return this.toArray(this.connectorNeighbours);
        }
        else if (type == ElementType_1.ElementType.Model) {
            return this.toArray(this.modelNeighbours);
        }
        else {
            var types = [];
            types.push(this.nodeNeighbours);
            types.push(this.edgeNeighbours);
            types.push(this.connectorNeighbours);
            types.push(this.modelNeighbours);
            var result = [];
            for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
                var elems = types_1[_i];
                for (var key in elems) {
                    result.push(elems[key]);
                }
            }
            return result;
        }
    };
    /**
     * Returns all neighbours
     */
    AbstractElement.prototype.getNeighbours = function () {
        return this.internalGetNeighbours();
    };
    /**
     * Returns all neighbours of type Node
     */
    AbstractElement.prototype.getNodeNeighbours = function () {
        return this.internalGetNeighbours(ElementType_1.ElementType.Node);
    };
    /**
     * Returns all neighbours of type Edge
     */
    AbstractElement.prototype.getEdgeNeighbours = function () {
        return this.internalGetNeighbours(ElementType_1.ElementType.Edge);
    };
    /**
     * Returns all neighbours of type Connector
     */
    AbstractElement.prototype.getConnectorNeighbours = function () {
        return this.internalGetNeighbours(ElementType_1.ElementType.Connector);
    };
    /**
     * Returns all neighbours of type Model
     */
    AbstractElement.prototype.getModelNeighbours = function () {
        return this.internalGetNeighbours(ElementType_1.ElementType.Model);
    };
    /**
     * Sets a property on this Element
     *
     * @param name Name of the property to set
     * @param value desired value
     */
    AbstractElement.prototype.setProperty = function (name, value) {
        this.properties[name] = value;
    };
    /**
     * Returns a value of a property of this Element
     *
     * @param name Name of the property to retrieve
     */
    AbstractElement.prototype.getProperty = function (name) {
        return this.properties[name];
    };
    /**
     * Returns all properties of this Element
     */
    AbstractElement.prototype.getProperties = function () {
        return this.properties;
    };
    /**
     * Converts a Dictionary to an Array
     *
     * @param dictionary The dictionary to convert
     */
    AbstractElement.prototype.toArray = function (dictionary) {
        var result = [];
        for (var key in dictionary) {
            var elem = dictionary[key];
            result.push(elem);
        }
        return result;
    };
    return AbstractElement;
}());
exports.AbstractElement = AbstractElement;
