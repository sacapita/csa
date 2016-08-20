/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.Model
 * A lightweight container for graphical objects. Models are not rendered to a {@link draw2d.Canvas} object but instead are used for grouping of elements
 *
 * @inheritable
 * @author Bart Smolders
 */
csa.Model = Class.extend({
    NAME : "csa.Model",

    /**
     * @constructor
     * Creates a new model element which is not assigned to any canvas.
     *
     *
     * @param {Object} [attr] the configuration of the model
     */
    init: function( properties ) {
        var _this = this;

        this.properties = {
            id : properties.id,
            type : properties.type
        }
    },

    getType: function(){
        return this.properties.type;
    },

    /**
     * @method
     * Return an objects with all important attributes for XML or JSON serialization
     *
     * @returns {Object}
     */
    getPersistentAttributes : function()
    {
        return { id: this.properties.id, type: this.properties.type, elements: [] };
    },
});
