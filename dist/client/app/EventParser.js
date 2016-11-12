CSA.EventParser = Class.extend({
	port: null,
	commandTypes: { Node: "Node", Edge: "Edge", Model: "Model", Connector: "Connector" },

	init:function(port)
	{
		// The port on which the application server is listening
		this.port = port;
	},

	/**
     * Parse a given event and send to backend to create an incremental command
	 * @param event, the event that occured on the View/Canvas
	 */
	parse:function(event){
		console.log(event);
		var command = event.command;
		var action = command.label;
		var updates = {}; // Object with all incremental updates that were performed during the event
		var elemId = null;
    var modelId = "98ab320d-dc64-42c3-bd86-709616e0d0f4";
    var commandType = "";
		var elementType = "";
    console.log("incremental");
    console.log(command);

		switch(action){
			case "Add Shape":
				console.log("Add Shape");
        commandType = "add"
        elementType = this.commandTypes.Node;
        elemId = command.figure.id;
        var props = command.figure;
        updates = {
          x: props.x,
          y: props.y,
          width: props.width,
          height: props.height,
          name: "shape1",
          cssClass: props.cssClass,
          alpha: props.alpha,
          bgColor: props.bgColor.hashString,
          stroke: props.stroke,
					userData: { shapeType: command.figure.userData.shapeType }
        };
				break;
			case "Delete Shape":
				console.log("Remove Shape");
					commandType = "delete";
					elementType = this.commandTypes.Node;
					elemId = command.figure.id;
				break;
			case "Move Shape":
				console.log("Move Shape");
        commandType = "setproperty";
				elementType = this.commandTypes.Node;
				elemId = command.figure.id;
				updates = {x: command.newX, y: command.newY};
				break;
			default:
				console.log(action + " is not supported for incremental updates in EventParser.js");
				break;
		}

		if(elementType != "" && elemId != null){
			this.sendToBackend(commandType, elementType, elemId, modelId, updates);
		}
	},

  sendToBackend:function(commandType, elementType, elemId, modelId, updates){
		var self = this;

		$.ajax({
			method: "POST",
			url: "http://185.3.208.201:" + this.port + "/graph/incremental",
			type: "json",
			data: {commandType: commandType, elementType: elementType, elemId: elemId, modelId: modelId, updates: updates},
			success: function(res){
				console.log("Result from incremental update", res);
			},
			error: function(err){
				console.log(err);
			}
		});
  	}
});
