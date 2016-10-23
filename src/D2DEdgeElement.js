"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var D2DAbstractElement_1 = require("./D2DAbstractElement");
/**
 * Element representing a Draw2D Edgel
 */
var D2DEdgeElement = (function (_super) {
    __extends(D2DEdgeElement, _super);
    function D2DEdgeElement() {
        _super.apply(this, arguments);
    }
    /**
     * @inheritdoc
     */
    D2DEdgeElement.prototype.toJSON = function () {
        return this.appendToObject({
            "type": this.type,
            "id": this.Id
        }, this.elements);
    };
    return D2DEdgeElement;
}(D2DAbstractElement_1.D2DAbstractElement));
exports.D2DEdgeElement = D2DEdgeElement;
