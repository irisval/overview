document.addEventListener("DOMContentLoaded", function(){
	var svg = d3.select("#graph");
var width = 1000;
var height = 760;
svg.attr("width", width).attr("height", height);

// svg.attr("align", "center");
var groupings = {
    "0": [0, 1],
    "1": [2, 3, 4],
    "2": [5],
    "3": [6],
    "4": [7, 8, 9],
    "5": [10, 11, 12],
    "6": [13, 14]
};


var colorRanges = {
	"0": ['#00ADEF', '#1e5799'],
    "1": ['#1e5799','#6d237c'],
    "2": ['#6d237c','#bf0489'],
    "3": ['#bf0489','#bb2145'],
    "4": ['#bb2145','#D25F32'],
    "5": ['#D25F32','#f6bd16'],
    "6": ['#f6bd16','#FFF200']
}

var colorGroups = {
	"0": "#00ADEF",
	"1": "#0F8EBF",
	"2": "#1e5799",
	"3": "#354790",
	"4": "354790",
	"5": "#6d237c",
	"6": "#bf0489",
	"7": "#bb2145",
	"8": "#C1333F",
	"9": "#CB4C37",
	"10": "#d25f32",
	"11": "#DC7B29",
	"12": "#EEAA1B",
	"13": "#f6bd16",
	"14": "#FCE206"
}
var simulation = d3.forceSimulation();
simulation.force("link", d3.forceLink().id(function(d) {
    return d.id;
}));

simulation.force("charge", d3.forceManyBody());
simulation.force("center", d3.forceCenter(width / 2, height / 2));
// simulation.force("link", d3.forceLink().distance(function(d) {
//     return d.distance + 10;
// }).strength(0.1));





// var piyg = d3.scaleSequential(d3.interpolatePiYG);
// var color = d3.scaleOrdinal(d3.schemeCategory20);
d3.json("data.json", function(err, graph) {
    if (err) console.log(err);
    // console.log(graph.nodes);
    var selects = document.querySelectorAll(".btn");

    var display = function() {
        var i = this.id;
        var next = parseInt(this.id) + 1;
        if (i != 6) {
        	this.classList.add("hidden");
        	document.getElementById(next).classList.remove("hidden");

        	var groups = groupings[i];
	        var filteredNodes = graph.nodes.filter(function(e) {
	            // return e.group == 2 || e.group == 3 || e.group == 4;
	            return groups.includes(e.group);
	        })
	        console.log(filteredNodes);
	        var minId = filteredNodes[0].id;
	        var maxId = filteredNodes[filteredNodes.length - 1].id;

	        var filteredLinks = graph.links.filter(function(e) {
	            // return e.target <= maxId && e.source >= minId - 1;
	            return e.target <= maxId && e.source >= minId;
	        })
	        console.log(filteredLinks);

	        var nObj = {
	            "nodes": filteredNodes,
	            "links": filteredLinks
	        };
	        // console.log(nObj);
	        // console.log("-------------");
	        // console.log(graph);

	        displayGraph(nObj, i);

        }
       
     // https://medium.com/ninjaconcept/interactive-dynamic-force-directed-graphs-with-d3-da720c6d7811  

      
    }

    selects.forEach(function(e) {
        e.addEventListener('click', display);
    })
    function displayGraph(gr, i) {
    	svg.selectAll('circle').style("opacity", 0.3);
    	svg.selectAll('line').style("opacity", 0.3);
    	svg.selectAll('text').style("opacity", 0.1);
	  	console.log(gr.nodes[gr.nodes.length -1].id);
	 	var color = d3.scaleLinear().domain([gr.nodes[0].id, gr.nodes[gr.nodes.length -1].id]).range(colorRanges[i]);
	    var link = svg.append("g").attr("class", "links").selectAll("line").data(gr.links).enter().append("line").style("stroke", function(d){
	            return colorGroups[graph.nodes[d.source].group];
	    });
	    var node = svg.append("g").attr("class", "nodes").attr("class", "node-" + i).selectAll("g").data(gr.nodes).enter().append("g");
	    var circles = node.append("circle").attr("class", "circle-" + i).attr("r", 10).attr("fill", function(d) {
	    	
	        return color(d.id);
	    }).call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));


	    var labels = node.append("text").text(function(d) {
	        return d.name;
	    }).attr('x', 7).attr('y', 3).attr("class", "t").style('fill', 'white');

	    node.append("title").text(function(d) {
	        return d.name;
	    });

	    simulation.nodes(gr.nodes).on("tick", ticked);
	    //simulation.force('link').links(gr.links);
	    simulation.force('link', d3.forceLink(gr.links).id(function(d) {
	        return d.id;
	    }));
		simulation.force("link", d3.forceLink(gr.links).distance(function(d) {
		    return d.distance;
		}).strength(0.1));

   svg.selectAll('circle').on('click', function(d, i) {
	       d3.select(this).transition().attr('r', 15);

			var c = document.getElementById("img-container");
			while (c.firstChild) {
			    c.removeChild(c.firstChild);
			}

	       	var img = document.createElement("img");
	    	img.setAttribute("src", d.image);
	    	img.setAttribute("class", "img");
	    	console.log(d.image)
	    	c.appendChild(img)


	    }).on('mouseover', function(d, i) {

	      	console.log("mouseover", d);
	        console.log("mouseover", i);
	    }).on('mouseout', function(d, i) {
	      console.log("mouseout", d);
	    });


		

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

	



});





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


});