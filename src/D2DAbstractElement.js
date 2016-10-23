"use strict";
var D2DAbstractElement = (function () {
    /**
     * @param id GUID of the Element that is created
     * @param properties of the Element
     */
    function D2DAbstractElement(id, type, elements, parentId) {
        if (elements === void 0) { elements = []; }
        this.id = id.toString();
        this.type = type;
        this.elements = elements;
        this.parentId = parentId;
    }
    Object.defineProperty(D2DAbstractElement.prototype, "Id", {
        /**
         * Returns identifier of this element
         */
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(D2DAbstractElement.prototype, "Elements", {
        get: function () {
            return this.elements;
        },
        enumerable: true,
        configurable: true
    });
    D2DAbstractElement.prototype.toJSON = function () {
        return this;
    };
    D2DAbstractElement.prototype.AddElement = function (element) {
        this.elements[element.id] = element;
    };
    D2DAbstractElement.prototype.appendToArray = function (arr, elements) {
        for (var k in elements) {
            var elem = elements[k];
            arr.push(elem.toJSON());
        }
        return arr;
    };
    D2DAbstractElement.prototype.appendToObject = function (obj, elements) {
        for (var k in elements) {
            obj[k] = elements[k];
        }
        return obj;
    };
    D2DAbstractElement.prototype.addConnector = function (connector) {
        if (typeof this.elements["ports"] === 'undefined') {
            this.elements["ports"] = [];
        }
        this.elements["ports"].push(connector);
    };
    return D2DAbstractElement;
}());
exports.D2DAbstractElement = D2DAbstractElement;
