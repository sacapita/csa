

CSA.View = draw2d.Canvas.extend({

	init:function(id, width, height, zoomFactor)
    {
		this._super(id, width, height);

		this.setScrollArea("#"+id);

		if(!isNaN(zoomFactor)){
			this.setZoom(zoomFactor, true);
		}

		// Extend the Canvas with multiple models
		this.models = new draw2d.util.ArrayList();
	},

	/**
     * @method
     * Add model to internal models.<br>
     *
     * @param {csa.Model}
     **/
	addModel: function(model)
	{
		this.models.add(model);
	},

	/**
     * @method
     * Returns the internal models.<br>
     *
     * @protected
     * @return {draw2d.util.ArrayList}
     **/
    getModels: function()
    {
      return this.models;
    },

	/**
     * @method
     * Returns all lines/connections in this workflow/canvas of type shapeType.<br>
     *
     * @protected
     * @return {draw2d.util.ArrayList}
     **/
    getLinesFromType: function(shapeType)
    {
		shapeType = (typeof shapeType === 'undefined') ? null : shapeType;
		var lines = new draw2d.util.ArrayList();

		this.lines.each(function(i, line){
			if(line.userData.hasOwnProperty("shapeType") && line.userData.shapeType == shapeType){
				lines.push(line);
			}
		});
      	return lines;
    },

    /**
     * @method
     * Returns the internal figures of type shapeType.<br>
     *
     * @protected
     * @return {draw2d.util.ArrayList}
     **/
    getFiguresFromType: function(shapeType)
    {
		shapeType = (typeof shapeType === 'undefined') ? null : shapeType;
		var figures = new draw2d.util.ArrayList();

		this.figures.each(function(i, figure){
			if(figure.userData.shapeType !== null && figure.userData.shapeType == shapeType){
				figures.push(figure);
			}
		});
      	return figures;
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
