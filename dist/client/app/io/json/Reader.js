/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.io.json.Reader
 * Read a JSON data and import them into the canvas. The JSON must be generated with the
 * {@link draw2d.io.json.Writer}.
 *
 * @extends draw2d.io.Reader
 */
csa.io.json.Reader = draw2d.io.Reader.extend({

    NAME : "csa.io.json.Reader",

    init: function(){
        this._super();
    },

    /**
     * @method
     *
     * Restore the canvas from a given JSON object.
     *
     * @param {draw2d.Canvas} canvas the canvas to restore
     * @param {Object} document the json object to load.
     */
    unmarshal: function(canvas, json){
        var result = new draw2d.util.ArrayList();

        if(typeof json === "string"){
            json = JSON.parse(json);
        }

        var node=null;
        $.each(json, $.proxy(function(i, model){
            var m = new csa.Model({id: model.id, type: model.type});

            canvas.addModel(m);

            $.each(model.elements, $.proxy(function(i, element){
                try{
                    var o = eval("new "+element.type+"()");
                    var source= null;
                    var target= null;
                    for(i in element){
                        var val = element[i];
                        if(i === "source"){
                            node = canvas.getFigure(val.node);
                            if(node===null){
                                throw "Source figure with id '"+val.node+"' not found";
                            }
                            source = node.getPort(val.port);
                            if(source===null){
                                throw "Unable to find source port '"+val.port+"' at figure '"+val.node+"' to unmarschal '"+element.type+"'";
                            }
                        }
                        else if (i === "target"){
                            node = canvas.getFigure(val.node);
                            if(node===null){
                                throw "Target figure with id '"+val.node+"' not found";
                            }
                            target = node.getPort(val.port);
                            if(target===null){
                                throw "Unable to find target port '"+val.port+"' at figure '"+val.node+"' to unmarschal '"+element.type+"'";
                            }
                        }
                    }
                    if(source!==null && target!==null){
                        // don't change the order or the source/target set.
                        // TARGET must always be the second one because some applications needs the "source"
                        // port in the "connect" event of the target.
                        o.setSource(source);
                        o.setTarget(target);
                    }
                    o.setPersistentAttributes(element);
                    canvas.add(o);
                    result.add(o);
                }
                catch(exc){
                    debug.error(element,"Unable to instantiate figure type '"+element.type+"' with id '"+element.id+"' during unmarshal by "+this.NAME+". Skipping figure..");
                    debug.error(exc);
                    debug.warn(element);
                }
            },this));
        },this));

        // restore group assignment
        //
        $.each(json, $.proxy(function(i, element){
            if(typeof element.composite !== "undefined"){
               var figure = canvas.getFigure(element.id);
               if(figure===null){
                   figure =canvas.getLine(element.id);
               }
               var group = canvas.getFigure(element.composite);
               group.assignFigure(figure);
            }
        },this));

        // recalculate all crossings and repaint the connections with
        // possible crossing decoration
        canvas.calculateConnectionIntersection();
        canvas.getLines().each(function(i,line){
            line.svgPathString=null;
            line.repaint();
        });
        canvas.linesToRepaintAfterDragDrop = canvas.getLines().clone();

        canvas.showDecoration();

        return result;
    }
});
