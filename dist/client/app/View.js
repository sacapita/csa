

CSA.View = draw2d.Canvas.extend({

	init:function(id, width, height, zoomFactor)
    {
		this._super(id, width, height);

		this.setScrollArea("#"+id);

		if(!isNaN(zoomFactor)){
			this.setZoom(zoomFactor, true);
		}
	},

	/**
     * @method
     * Returns all lines/connections in this workflow/canvas.<br>
     *
     * @protected
     * @return {draw2d.util.ArrayList}
     **/
    getLines: function(shapeType)
    {
      	return this.lines;
    },

    /**
     * @method
     * Returns the internal figures.<br>
     *
     * @protected
     * @return {draw2d.util.ArrayList}
     **/
    getFigures: function(shapeType)
    {
		shapeType = (typeof shapeType === 'undefined') ? null : shapeType;
		console.log(shapeType);
      	return this.figures;
    },


    /**
     * @method
     * Called if the user drop the droppedDomNode onto the canvas.<br>
     * <br>
     * Draw2D use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     *
     * @param {HTMLElement} droppedDomNode The dropped DOM element.
     * @param {Number} x the x coordinate of the drop
     * @param {Number} y the y coordinate of the drop
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * @private
     **/
    onDrop : function(droppedDomNode, x, y, shiftKey, ctrlKey)
    {
        var type = $(droppedDomNode).data("shape");
		var attr = new Object();
        var figure = eval("new "+type+"({},\"" + droppedDomNode[0].id +"\");");

		if(figure.NAME == "TableShape"){
        	figure.addEntity("id");
		}

        // create a command for the undo/redo support
        var command = new draw2d.command.CommandAdd(this, figure, x, y);
        this.getCommandStack().execute(command);
    }
});
