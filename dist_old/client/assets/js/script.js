$(function(){
	$.ajax({
		method: "GET",
		url: "http://localhost:8000/graph",
		type: "json",
		success: function(res){
			console.log("antwoord van 8000/graph", res);
		},
		error: function(err){
			console.log(err);
		}
	});
});
