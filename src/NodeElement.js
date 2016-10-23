"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ElementType_1 = require("./ElementType");
var AbstractElement_1 = require("./AbstractElement");
/**
 * Element representing a true higher-level Node in the graph, see documentation for more information
 */
var NodeElement = (function (_super) {
    __extends(NodeElement, _super);
    function NodeElement() {
        _super.apply(this, arguments);
    }
    /**
     * @inheritdoc
     */
    NodeElement.prototype.getType = function () {
        return ElementType_1.ElementType.Node;
    };
    return NodeElement;
}(AbstractElement_1.AbstractElement));
exports.NodeElement = NodeElement;
