"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ElementType_1 = require("./ElementType");
var AbstractElement_1 = require("./AbstractElement");
var ConnectorElement = (function (_super) {
    __extends(ConnectorElement, _super);
    function ConnectorElement() {
        _super.apply(this, arguments);
    }
    ConnectorElement.prototype.getType = function () {
        return ElementType_1.ElementType.Connector;
    };
    return ConnectorElement;
}(AbstractElement_1.AbstractElement));
exports.ConnectorElement = ConnectorElement;
