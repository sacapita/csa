// declare the namespace for this application
var CSA = {};

/**
 *
 * The **GraphicalEditor** is responsible for layout and dialog handling.
 *
 * @author Andreas Herz
 * @extends draw2d.ui.parts.GraphicalEditor
 */
CSA.Application = Class.extend(
{
    NAME : "CSA.Application",

    /**
     * @constructor
     *
     * @param {String} canvasId the id of the DOM element to use as paint container
     */
    init : function()
    {
	    this.view       = new CSA.View("canvas");
        this.toolbar    = new CSA.Toolbar("toolbar",  this.view );
        this.middleware = new CSA.Middleware(this.view);
    }
});
