CSA.Middleware = Class.extend({

	init:function(canvas)
	{
      var self = this;
      canvas.getCommandStack().addEventListener(function(e){
        if(e.isPostChangeEvent()){
					var writer = new draw2d.io.json.Writer();
					writer.marshal(canvas, function(json){
          	self.displayJSON(json);
						self.updateGraph(json);
					});
        }
      });
  },
  displayJSON:function(json){
      $("#json").text(JSON.stringify(json, null, 2));
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
					self.displayJSON(JSON.parse(res));
					//console.log("8045:/update/graph success", res);
				},
				error: function(err){
					console.log(err);
				}
			});
  }
});
