"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ElementType_1 = require("./ElementType");
var AbstractElement_1 = require("./AbstractElement");
var EdgeElement = (function (_super) {
    __extends(EdgeElement, _super);
    function EdgeElement() {
        _super.apply(this, arguments);
    }
    /**
     * @inheritdoc
     */
    EdgeElement.prototype.getType = function () {
        return ElementType_1.ElementType.Edge;
    };
    /**
     * Returns the start ConnectorID
     */
    EdgeElement.prototype.getStartConnector = function () {
        return this.start;
    };
    /**
     * Returns the end ConnectorID
     */
    EdgeElement.prototype.getEndConnector = function () {
        return this.end;
    };
    /**
     * Sets the StartConnector
     *
     * @param ConnectorID ID of the connector
     */
    EdgeElement.prototype.addStartConnector = function (connectorId) {
        this.start = connectorId;
        this.addConnectorNeighbour(connectorId);
    };
    /**
     * Sets the EndConnector
     *
     * @param ConnectorID ID of the connector
     */
    EdgeElement.prototype.addEndConnector = function (connectorId) {
        this.end = connectorId;
        this.addConnectorNeighbour(connectorId);
    };
    return EdgeElement;
}(AbstractElement_1.AbstractElement));
exports.EdgeElement = EdgeElement;
