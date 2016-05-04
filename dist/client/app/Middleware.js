CSA.Middleware = Class.extend({
	app: null,
	init:function(app, canvas)
	{
      	var self = this;
		self.app = app;
      	canvas.getCommandStack().addEventListener(function(e){
			if(e.isPostChangeEvent()){
				var writer = new csa.io.json.Writer();
				self.displaySVG(canvas);
				writer.marshal(canvas, function(json){
          			self.displayJSON(json);
					self.updateGraph(json);
				});
        	}
      	});
		// FIXME: Does not show SVG without setTimeout
		setTimeout(function(){
			self.displaySVG(canvas);
		}, 500);
	},
  	displayJSON:function(json){
      	$("#json").text(JSON.stringify(json, null, 2));
  	},
	displaySVG:function(canvas){
		var writer = new csa.io.svg.Writer();
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
			data: {graph: json},
			success: function(res){
				var model = JSON.parse(res);
				self.displayJSON(model);
			},
			error: function(err){
				console.log(err);
			}
		});
  	}
});
