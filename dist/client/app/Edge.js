csa.Edge = draw2d.Connection.extend({
    NAME: "csa.Edge",

    init : function(attr, shapeType)
    {
        this._super();

        // Extend Draw2D shapes the ugly way
		if(shapeType !== undefined){
			// this value is passed onDrop, but not when read from the document.js
        	var csaElement = new CSAElement(this, shapeType);
		}
    }
});
