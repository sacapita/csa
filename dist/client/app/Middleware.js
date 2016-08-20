CSA.Middleware = Class.extend({
	port: null,

	init:function(canvas, port)
	{
		this.port = port;
  	var self = this;
    this.getProject();
		counter = 0;
		var eventParser = new CSA.EventParser(port);
  	canvas.getCommandStack().addEventListener(function(e){
			// Events are fired twice for some unknown reason
			if(e.isPostChangeEvent() && counter % 2 == 0){
				eventParser.parse(e);
				var writer = new csa.io.json.Writer();
				self.displayThumnails(canvas);
				writer.marshal(canvas, null, function(json){
    			self.displayJSON(json);
					//self.updateGraph(json);
				});
    	}
			counter++;
  	});
		// FIXME: Does not show SVG without setTimeout
		setTimeout(function(){
			self.displayThumnails(canvas);
		}, 500);
	},
  getProject:function(){
    $.ajax({
			method: "GET",
			url: "http://185.3.208.201:" + this.port + "/app/project",
			type: "json",
			success: function(res){
				$("#deserialize").text(JSON.stringify(res, null, 2));
			},
			error: function(err){
				console.log(err);
			}
		});
  },
	// Debug information
	displayJSON:function(json){
  	$("#json").text(JSON.stringify(json, null, 2));
	},
	// Viewpoint thumbnails
	displayThumnails:function(canvas){
		$(".viewpoint-thumb").each(function(){
			var thumbnail = $(this);
			thumbnail.html("");
			var shapeType = $(this).data("type");
			// canvas voor elke thumbnail
			var thumbCanvas = new CSA.View($(this).attr("id"));
			// marchal met shapeType
			var thumbWriter = new csa.io.json.Writer();
			thumbWriter.marshal(canvas, shapeType, function(json){
				// unmarchal in die canvas
				var thumbReader = new csa.io.json.SimpleReader();
				thumbReader.unmarshal(thumbCanvas, json);
				// svg maken van die canvas en in de thumbnail de svg tonen
				var pngWriter = new csa.io.png.Writer();
				pngWriter.marshal(thumbCanvas, function(png){
					thumbnail.html("<img src=\"" + png + "\" class=\"viewpoint-thumbnail-img draw2d_droppable\" data-model=\"" + shapeType + "\" />");
					thumbCanvas = null;
				});
			});
		});
	},/*
	updateGraph:function(json){
		var self = this;
    //ajax to backend
		$.ajax({
			method: "POST",
			url: "http://185.3.208.201:" + this.port + "/update/graph",
			type: "json",
			data: {graph: json},
			success: function(res){
				var model = JSON.parse(res);
				self.displayJSON(model);
			},
			error: function(err){
				console.log(err);
			}
		});
	},*/
	renderDroppedModel:function(model){
		console.log(model + "render");
		$.ajax({
			method: "POST",
			url: "http://185.3.208.201:" + this.port + "/update/graph/model",
			type: "json",
			data: {model: model},
			success: function(res){
				// TODO: add response to commandstack/canvas
			},
			error: function(err){
				console.log(err);
			}
		});
	}
});
