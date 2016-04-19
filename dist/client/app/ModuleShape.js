/**
 * @class draw2d.shape.basic.Label
 * Implements a simple text with word wrapping.<br>The height of the element is automatic calculated. The widht of
 * the element is changeable by the user and respect the minWidth constraint.
 * <br>
 *
 * @author Bart Smolders
 * @since 1.0
 * @extends draw2d.shape.basic.Label
 */
csa.ModuleShape = draw2d.shape.basic.Rectangle.extend({
    NAME: "csa.ModuleShape",

    init : function(attr, shapeType)
    {
        this._super($.extend({bgColor:"#dbddde", color:"#d7d7d7", stroke:1, radius:1},attr));

        // Extend Draw2D shapes the ugly way
		if(shapeType !== undefined){
			// this value is passed onDrop, but not when read from the document.js
        	var csaElement = new CSAElement(this, shapeType);
		}

        this.classLabel = new draw2d.shape.basic.Label({
            text:"Module",
            stroke:0,
            fontColor:"#000000",
            radius: this.getRadius(),
            padding:5,
            resizeable:true,
            editor:new draw2d.ui.LabelInplaceEditor()
        });

        this.add(this.classLabel, new draw2d.layout.locator.TopLocator());
    },

    /**
     * @method
     * Set the name of the DB table. Visually it is the header of the shape
     *
     * @param name
     */
    setName: function(name)
    {
        this.classLabel.setText(name);

        return this;
    },


    /**
     * @method
     * Return an objects with all important attributes for XML or JSON serialization
     *
     * @returns {Object}
     */
    getPersistentAttributes : function()
    {
        var memento= this._super();

       memento.name = this.classLabel.getText();
       memento.entities   = [];

       this.children.each(function(i,e){
           if(i>0){ // skip the header of the figure
               memento.entities.push({
                   text:e.figure.getText(),
                   id: e.figure.id
               });
           }
       });

        return memento;
    },

    /**
     * @method
     * Read all attributes from the serialized properties and transfer them into the shape.
     *
     * @param {Object} memento
     * @return
     */
    setPersistentAttributes : function(memento)
    {
        this._super(memento);

        this.setName(memento.name);

        if(typeof memento.entities !== "undefined"){
            $.each(memento.entities, $.proxy(function(i,e){
                var entity =this.addEntity(e.text);
                entity.id = e.id;
                entity.getInputPort(0).setName("input_"+e.id);
                entity.getOutputPort(0).setName("output_"+e.id);
            },this));
        }

        return this;
    }
});
