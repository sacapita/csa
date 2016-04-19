// constructor
var CSAElement = function (element, shapeType) {
    this.element = element;
console.log("csaElement", this.element);
    // Custom properties for this shape
    this.element.userData = {};
    this.element.userData.shapeType = shapeType;
};
