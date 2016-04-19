// constructor
var CSAShape = function (figure, shapeType) {
    this.figure = figure;

    // Custom properties for this shape
    this.figure.userData = {};
    this.figure.userData.shapeType = shapeType;
};
