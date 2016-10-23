"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var D2DAbstractElement_1 = require("./D2DAbstractElement");
/**
 * Element representing a Draw2D Node
 */
var D2DNodeElement = (function (_super) {
    __extends(D2DNodeElement, _super);
    function D2DNodeElement() {
        _super.apply(this, arguments);
    }
    /**
     * @inheritdoc
     */
    D2DNodeElement.prototype.toJSON = function () {
        return this.appendToObject({
            "id": this.Id,
            "type": this.type
        }, this.elements);
    };
    return D2DNodeElement;
}(D2DAbstractElement_1.D2DAbstractElement));
exports.D2DNodeElement = D2DNodeElement;
