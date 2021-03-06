/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/

/**
 * @class draw2d.io.json.Writer
 * Serialize the canvas document into a JSON object which can be read from the corresponding
 * {@link draw2d.io.json.Reader}.
 *
 *      // Create a JSON writer and convert it into a JSON-String representation.
 *      //
 *      var writer = new draw2d.io.json.Writer();
 *      writer.marshal(canvas, function(json){
 *         // convert the json object into string representation
 *         var jsonTxt = JSON.stringify(json,null,2);
 *
 *         // insert the json string into a DIV for preview or post
 *         // it via ajax to the server....
 *         $("#json").text(jsonTxt);
 *
 *      });
 *
 *
 *
 * @author Bart Smolders
 * @extends draw2d.io.Writer
 */
csa.io.json.Writer = draw2d.io.Writer.extend({

    init: function()
    {
        this._super();
    },

    /**
     * @method
     * Export the content to the implemented data format. Inherit class implements
     * content specific writer.
     * <br>
     * <br>
     *
     * Method signature has been changed from version 2.10.1 to version 3.0.0.<br>
     * The parameter <b>resultCallback</b> is required and new. The method calls
     * the callback instead of return the result.
     *
     * @param {draw2d.Canvas} canvas
     * @param {Function} resultCallback the method to call on success. The first argument is the result object, the second the base64 representation of the file content
     * @param {Object} resultCallback.json  the canvas document as JSON object
     * @param {String} resultCallback.base64  the canvas document as base encoded JSON
     */
    marshal: function(canvas, modelType, resultCallback)
    {
        // I change the API signature from version 2.10.1 to 3.0.0. Throw an exception
        // if any application not care about this changes.
        if(typeof resultCallback !== "function"){
            throw "Writer.marshal method signature has been change from version 2.10.1 to version 3.0.0. Please consult the API documentation about this issue.";
        }

        var result = [];

        // Assign unassigned edges to the source model
        canvas.addUnassignedLines();

        canvas.getModels(modelType).each(function(i, model){
            var m = model.getPersistentAttributes();
            var modelType = m.type;

            canvas.getFiguresFromType(modelType).each(function(i, figure){
                m.elements.push(figure.getPersistentAttributes());
            });

            canvas.getLinesFromType(modelType).each(function(i, element){
                m.elements.push(element.getPersistentAttributes());
            });

            result.push(m);
        });

    	var base64Content = draw2d.util.Base64.encode(JSON.stringify(result, null, 2));

    	resultCallback(result, base64Content);
    }
});
