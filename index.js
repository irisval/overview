var svg = d3.select("#graph");
var width = 900;
var height = 800;
svg.attr("width", width).attr("height", height);

var groupings = {"0" : [0, 1], "1" : [2, 3, 4], "2" : [5], "3" : [6], "4" : [7, 8, 9], "5" : [10, 11, 12], "6" : [13]};
var simulation = d3.forceSimulation();
	simulation.force("link", d3.forceLink().id(function(d) {
		return d.id;
	})
);

simulation.force("charge", d3.forceManyBody());
simulation.force("center", d3.forceCenter(width/2, height/2));
simulation.force("link", d3.forceLink().distance(function(d) {
	return d.distance;
}).strength(0.1));





// var piyg = d3.scaleSequential(d3.interpolatePiYG);
var color = d3.scaleOrdinal(d3.schemeCategory20);
d3.json("data.json", function(err, graph) {
	if (err) console.log(err);
	// console.log(graph.nodes);
	var selects = document.querySelectorAll(".btn");

	var display = function() {
		var groups = groupings[this.id];
		var filteredNodes = graph.nodes.filter(function(e) {
			return e.group == 2 || e.group == 3 || e.group == 4;
		})
		console.log(filteredNodes);
		var minId = filteredNodes[0].id;
		var maxId = filteredNodes[filteredNodes.length - 1].id;

		var filteredLinks = graph.links.filter(function(e) {
			// return e.target <= maxId && e.source >= minId - 1;
			return e.target <= maxId && e.source >= minId;
		})
		console.log(filteredLinks);


		var nObj = {"nodes": filteredNodes, "links": filteredLinks};
		console.log(nObj);
		console.log("-------------");
		console.log(graph);

		displayGraph(nObj);
	}

	selects.forEach(function(e) {
		e.addEventListener('click', display);
	})
});

	function displayGraph(gr) {
		// console.log(n);
		// console.log(l);

		var link = svg.append("g").attr("class", "links").selectAll("line").data(gr.links).enter().append("line");
		var node = svg.append("g").attr("class", "nodes").selectAll("g").data(gr.nodes).enter().append("g");
		var circles = node.append("circle").attr("r", 5).attr("fill", function(d) { 
			return color(d.group); 
		}).call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

	  	var labels = node.append("text").text(function(d) {  
	  		return d.name;
	  	}).attr('x', 6).attr('y', 3).attr("class", "t").style('fill', 'white');

		  node.append("title").text(function(d) { 
		  	return d.name; 
		  });

	  	simulation.nodes(gr.nodes).on("tick", ticked);
	  	//simulation.force('link').links(gr.links);
	  	simulation.force('link', d3.forceLink(gr.links).id(function(d) {
	  		return d.id;
	  	}));



	 // 	simulation.force("link", d3.forceLink(gr.links)).links(gr.links);

	  		function ticked() {
			    link.attr("x1", function(d) { 
			    	return d.source.x;
			    });
			    link.attr("y1", function(d) { 
			    	return d.source.y; 
			    });
			    link.attr("x2", function(d) { 
			    	return d.target.x; 
			    });
			    link.attr("y2", function(d) { 
			    	return d.target.y; 
			    });
			    node.attr("transform", function(d) {
		          return "translate(" + d.x + "," + d.y + ")";
		        })
			}
	}
	

  


function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}


