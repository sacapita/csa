"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ElementType_1 = require("./ElementType");
var AbstractElement_1 = require("./AbstractElement");
var ModelElement = (function (_super) {
    __extends(ModelElement, _super);
    function ModelElement() {
        _super.apply(this, arguments);
    }
    ModelElement.prototype.getType = function () {
        return ElementType_1.ElementType.Model;
    };
    return ModelElement;
}(AbstractElement_1.AbstractElement));
exports.ModelElement = ModelElement;
