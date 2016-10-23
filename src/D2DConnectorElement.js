"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var D2DAbstractElement_1 = require("./D2DAbstractElement");
/**
 * Element representing a Draw2D Connector
 */
var D2DConnectorElement = (function (_super) {
    __extends(D2DConnectorElement, _super);
    function D2DConnectorElement() {
        _super.apply(this, arguments);
    }
    /**
     * @inheritdoc
     */
    D2DConnectorElement.prototype.toJSON = function () {
        return this.appendToObject({
            "id": this.Id,
            "type": this.type
        }, this.elements);
    };
    return D2DConnectorElement;
}(D2DAbstractElement_1.D2DAbstractElement));
exports.D2DConnectorElement = D2DConnectorElement;
