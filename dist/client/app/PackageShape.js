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
 csa.PackageShape = draw2d.SetFigure.extend({
    NAME: "csa.PackageShape",

    init : function(attr, shapeType)
    {
        this._super();
        this.setBackgroundColor("#ffffff");
        this.setStroke(0);
        this.setDimension(300,128);

        if(shapeType !== undefined){
           // this value is passed onDrop, but not when read from the document.js
            var csaElement = new CSAElement(this, shapeType);
        }

         this.classLabel = new draw2d.shape.basic.Label({
            text:"Package",
            stroke:0,
            fontColor:"#000000",
            radius: this.getRadius(),
            padding:5,
            resizeable:true,
            editor:new draw2d.ui.LabelInplaceEditor()
        });

        var InputLocator = new draw2d.layout.locator.InputPortLocator();
        var OutputLocator = new draw2d.layout.locator.OutputPortLocator();
        var TopLocator = new draw2d.layout.locator.TopLocator();
        var BottomLocator = new draw2d.layout.locator.BottomLocator();

        var input = this.createPort("hybrid", InputLocator);
        var output = this.createPort("hybrid", OutputLocator);
        var top = this.createPort("hybrid", TopLocator);
        var bottom = this.createPort("hybrid", BottomLocator);

        input.setName("input_"+this.id);
        output.setName("output_"+this.id);
        top.setName("top"+this.id);
        bottom.setName("bottom"+this.id);

        this.add(this.classLabel, new draw2d.layout.locator.Locator());

    },

    setName: function(name)
    {
        this.classLabel.setText(name);

        return this;
    },

    createSet: function(){
        var set = this._super();

        set.push( this.canvas.paper.rect(0, 0, 50, 10));
        set.push( this.canvas.paper.rect(0, 10, 150, 50));

        return set;
    },


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
                entity.getTopPort(0).setName("top"+e.id);
                entity.getBottomPort(0).setName("top"+e.id);
            },this));
        }

        return this;
    }

});

var shape = new csa.PackageShape();


/*csa.PackageShape = draw2d.setFigure.extend({
    NAME: "csa.PackageShape",

    init : function()
    {
        this._super();
 
        this.setBackgroundColor("f0f0ff");
        this.setStroke(1);
        this.setDimension(128,128);
    },
 
    createSet: function(){
        var set = this._super();
 
        set.push( this.canvas.paper.image("unnamed.png",0,0,128,128));
        set.push( this.canvas.paper.circle(20, 20, 10));
        return set;
    }

});

var shape = new BgColorImage();
canvas.add( shape,100,100);*/