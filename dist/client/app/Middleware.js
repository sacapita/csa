CSA.Middleware = Class.extend({
	modelId: null,
	app: null,
	init:function(app, canvas)
	{
      	var self = this;
		self.app = app;
      	canvas.getCommandStack().addEventListener(function(e){
        	if(e.isPostChangeEvent()){

				var writer = new draw2d.io.json.Writer();
				self.displaySVG(canvas);
				writer.marshal(canvas, function(json){
          			self.displayJSON(json);
					self.updateGraph(json);
				});
        	}
      	});
		// Does not show SVG without setTimeout
		setTimeout(function(){
			self.displaySVG(canvas);
		}, 500);
	},
  	displayJSON:function(json){
      	$("#json").text(JSON.stringify(json, null, 2));
  	},
	displaySVG:function(canvas){
		var writer = new draw2d.io.svg.Writer();
		writer.marshal(canvas, function(svg){
			$(".viewpoint-thumb").html(svg);
		});
	},
  	updateGraph:function(json){
		var self = this;
      	//ajax to backend
		$.ajax({
			method: "POST",
			url: "http://localhost:8045/update/graph",
			type: "json",
			data: {graph: json, modelId: self.modelId},
			success: function(res){
				var model = JSON.parse(res);
				//self.displayJSON(model);
				self.modelId = model.modelId.guid;
			},
			error: function(err){
				console.log(err);
			}
		});
  	}
});
