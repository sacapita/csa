"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var D2DAbstractElement_1 = require("./D2DAbstractElement");
/**
 * Element representing a Draw2D Model
 */
var D2DModelElement = (function (_super) {
    __extends(D2DModelElement, _super);
    function D2DModelElement() {
        _super.apply(this, arguments);
    }
    /**
     * @inheritdoc
     */
    D2DModelElement.prototype.toJSON = function () {
        return {
            "id": this.Id,
            "type": this.type,
            "elements": this.appendToArray([], this.elements)
        };
    };
    return D2DModelElement;
}(D2DAbstractElement_1.D2DAbstractElement));
exports.D2DModelElement = D2DModelElement;
