CSA.EventParser = Class.extend({
	port: null,
	commandTypes: { Node: "Node", Edge: "Edge", Model: "Model", Connector: "Connector" },

	init:function(port)
	{
		// The port on which the server is listening
		this.port = port;
	},

	/**
     * Parse a given event and send to backend to create an incremental command
	 * @param event, the event occured on the View/Canvas
	 */
	parse:function(event){
		console.log(event);
		var command = event.command;
		var action = command.label;
		var updates = {}; // Object with all incremental updates that were performed during the event
		var elemId = null;
		var type = "";

		switch(action){
			case "Add Shape":
				console.log("Add Shape");
				break;
			case "Move Shape":
				console.log("Move Shape");
				type = this.commandTypes.Node;
				elemId = command.figure.id;
				updates = {x: command.newX, y: command.newY};
				break;
			case "Connect Ports":
				console.log("Connect Ports");
				// source
				// target
				break;
			default:
				console.log(action + " is not supported for incremental updates in EventParser.js");
				break;
		}

		if(type != "" && elemId != null && Object.keys(updates).length !== 0){
			this.sendToBackend(type, elemId, updates);
		}
	},

  	sendToBackend:function(type, elemId, updates){
		var self = this;
      	//ajax to backend
		$.ajax({
			method: "POST",
			url: "http://localhost:" + this.port + "/graph/incremental",
			type: "json",
			data: {type: type, elemId: elemId, updates: updates},
			success: function(res){
				console.log("Result from incremental update", res);
			},
			error: function(err){
				console.log(err);
			}
		});
  	}
});
