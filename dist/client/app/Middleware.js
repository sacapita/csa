CSA.Middleware = Class.extend({
	init:function(canvas)
	{
      	var self = this;
		counter = 0;
      	canvas.getCommandStack().addEventListener(function(e){
			// Events are fired twice for some unknown reason
			if(e.isPostChangeEvent() && counter % 2 == 0){
				var writer = new csa.io.json.Writer();
				self.displaySVG(canvas);
				writer.marshal(canvas, null, function(json){
          			self.displayJSON(json);
					self.updateGraph(json);
				});
        	}
			counter++;
      	});
		// FIXME: Does not show SVG without setTimeout
		setTimeout(function(){
			self.displaySVG(canvas);
		}, 500);
	},
	// Debug information
  	displayJSON:function(json){
      	$("#json").text(JSON.stringify(json, null, 2));
  	},
	// Viewpoint thumbnails
	displaySVG:function(canvas){
		var writer = new csa.io.svg.Writer();
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
				var svgWriter = new csa.io.svg.Writer();
				svgWriter.marshal(thumbCanvas, function(svg){
					thumbnail.html(svg);
					thumbCanvas = null;
				});
			});
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
				//self.displayJSON(model);
			},
			error: function(err){
				console.log(err);
			}
		});
  	}
});
