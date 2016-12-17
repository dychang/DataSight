//TODO: Fix legend so its not so large and covering stuff
//TODO: Replace the val1,val2,val3 with the values that the user picks

var app = angular.module('DataAggApp', []);
app.controller('DataImportCtrl',[ '$scope', '$http', function($scope, $http) {
	$scope.reader = new FileReader();

	//Event Listeners
	$scope.reader.onload = function(e) {
	  $scope.fileText = $scope.reader.result;
	  console.log($scope.fileText);
	}

	//Function Definitions
	$scope.readFile = function() {
		$scope.selectedFile = $('#input').get(0).files[0];
		$scope.fileName = $scope.selectedFile.name;
		console.log($scope.selectedFile);

		$scope.reader.readAsText($scope.selectedFile);
	}

	//Handler for chart type selection buttons
	$scope.chartTypeBtn = function(chartType) {
		$scope.chartType = chartType;
		$("#confirmModal").modal("toggle");
	}

	$scope.create_graph = function(chartType) {

		d3.select("svg").remove();

		if (chartType == 'Scatter') {

			/* 
			 * value accessor - returns the value to encode for a given data object.
			 * scale - maps value to a visual display encoding, such as a pixel position.
			 * map function - maps from data value to display value
			 * axis - sets up axis
			 */ 

			 var val1 = "NUMVOTES1";
			 var val2 = "NUMVOTES2";
			 var val3 = "NAME";

			var margin = {top: 20, right: 20, bottom: 30, left: 40},
			    width = 960 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom;

			/* 
			 * value accessor - returns the value to encode for a given data object.
			 * scale - maps value to a visual display encoding, such as a pixel position.
			 * map function - maps from data value to display value
			 * axis - sets up axis
			 */ 

			// setup x 
			var xValue = function(d) { return d[val1];}, // data -> value
			    xScale = d3.scale.linear().range([0, width]), // value -> display
			    xMap = function(d) { return xScale(xValue(d));}, // data -> display
			    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

			// setup y
			var yValue = function(d) { return d[val2];}, // data -> value
			    yScale = d3.scale.linear().range([height, 0]), // value -> display
			    yMap = function(d) { return yScale(yValue(d));}, // data -> display
			    yAxis = d3.svg.axis().scale(yScale).orient("left");

			// setup fill color
			var cValue = function(d) { return d[val3];},
			    color = d3.scale.category20();

			// add the graph canvas to the body of the webpage
			var svg = d3.select("body").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// add the tooltip area to the webpage
			var tooltip = d3.select("body").append("div")
			    .attr("class", "tooltip")
			    .style("opacity", 0);

			// load data
			d3.csv($scope.fileName, function(error, data) {

			  // change string (from CSV) into number format
			  data.forEach(function(d) {
			    d[val1] = +d[val1];
			    d[val2] = +d[val2];
			//    console.log(d);
			  });

			  // don't want dots overlapping axis, so add in buffer to data domain
			  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
			  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

			  // x-axis
			  svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + height + ")")
			      .call(xAxis)
			    .append("text")
			      .attr("class", "label")
			      .attr("x", width)
			      .attr("y", -6)
			      .style("text-anchor", "end")
			      .text(val1);

			  // y-axis
			  svg.append("g")
			      .attr("class", "y axis")
			      .call(yAxis)
			    .append("text")
			      .attr("class", "label")
			      .attr("transform", "rotate(-90)")
			      .attr("y", 6)
			      .attr("dy", ".71em")
			      .style("text-anchor", "end")
			      .text(val2);

			  // draw dots
			  svg.selectAll(".dot")
			      .data(data)
			    .enter().append("circle")
			      .attr("class", "dot")
			      .attr("r", 3.5)
			      .attr("cx", xMap)
			      .attr("cy", yMap)
			      .style("fill", function(d) { return color(cValue(d));}) 
			      .on("mouseover", function(d) {
			          tooltip.transition()
			               .duration(200)
			               .style("opacity", .9);
			          tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d) 
			          + ", " + yValue(d) + ")")
			               .style("left", (d3.event.pageX + 5) + "px")
			               .style("top", (d3.event.pageY - 28) + "px");
			      })
			      .on("mouseout", function(d) {
			          tooltip.transition()
			               .duration(500)
			               .style("opacity", 0);
			      });

			  // draw legend
			  var legend = svg.selectAll(".legend")
			      .data(color.domain())
			    .enter().append("g")
			      .attr("class", "legend")
			      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

			  // draw legend colored rectangles
			  legend.append("rect")
			      .attr("x", width - 18)
			      .attr("width", 18)
			      .attr("height", 18)
			      .style("fill", color);

			  // draw legend text
			  legend.append("text")
			      .attr("x", width - 24)
			      .attr("y", 9)
			      .attr("dy", ".35em")
			      .style("text-anchor", "end")
			      .text(function(d) { return d;});
			});

		}

		else if (chartType == 'Bar') {

		}

		else if (chartType == 'Pie') {

		}


    }
	
}]);