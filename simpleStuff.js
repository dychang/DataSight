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

	        $scope.margin = {top: 20, right: 20, bottom: 30, left: 40},
			    $scope.width = 960 - $scope.margin.left - $scope.margin.right,
			    $scope.height = 500 - $scope.margin.top - $scope.margin.bottom;

			/* 
			 * value accessor - returns the value to encode for a given data object.
			 * scale - maps value to a visual display encoding, such as a pixel position.
			 * map function - maps from data value to display value
			 * axis - sets up axis
			 */ 

			// setup x 
			$scope.xValue = function(d) { return d.Calories;}, // data -> value
			    $scope.xScale = d3.scale.linear().range([0, $scope.width]), // value -> display
			    $scope.xMap = function(d) { return $scope.xScale($scope.xValue(d));}, // data -> display
			    $scope.xAxis = d3.svg.axis().scale($scope.xScale).orient("bottom");

			// setup y
			$scope.yValue = function(d) { return d["Protein (g)"];}, // data -> value
			    $scope.yScale = d3.scale.linear().range([$scope.height, 0]), // value -> display
			    $scope.yMap = function(d) { return $scope.yScale($scope.yValue(d));}, // data -> display
			    $scope.yAxis = d3.svg.axis().scale($scope.yScale).orient("left");

			// setup fill color
			$scope.cValue = function(d) { return d.Manufacturer;},
			    $scope.color = d3.scale.category10();

			// add the graph canvas to the body of the webpage
			$scope.svg = d3.select("body").append("svg")
			    .attr("width", $scope.width + $scope.margin.left + $scope.margin.right)
			    .attr("height", $scope.height + $scope.margin.top + $scope.margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + $scope.margin.left + "," + $scope.margin.top + ")");

			// add the tooltip area to the webpage
			$scope.tooltip = d3.select("body").append("div")
			    .attr("class", "tooltip")
			    .style("opacity", 0);

			// load data
			$scope.d3 = d3.csv($scope.fileName, function(error, data) {

			  // change string (from CSV) into number format
			  data.forEach(function(d) {
			    d.Calories = +d.Calories;
			    d["Protein (g)"] = +d["Protein (g)"];
			//    console.log(d);
			  });

			  // don't want dots overlapping axis, so add in buffer to data domain
			  $scope.xScale.domain([d3.min(data, $scope.xValue)-1, d3.max(data, $scope.xValue)+1]);
			  $scope.yScale.domain([d3.min(data, $scope.yValue)-1, d3.max(data, $scope.yValue)+1]);

			  // x-axis
			  $scope.svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + $scope.height + ")")
			      .call($scope.xAxis)
			    .append("text")
			      .attr("class", "label")
			      .attr("x", $scope.width)
			      .attr("y", -6)
			      .style("text-anchor", "end")
			      .text("Calories");

			  // y-axis
			  $scope.svg.append("g")
			      .attr("class", "y axis")
			      .call($scope.yAxis)
			    .append("text")
			      .attr("class", "label")
			      .attr("transform", "rotate(-90)")
			      .attr("y", 6)
			      .attr("dy", ".71em")
			      .style("text-anchor", "end")
			      .text("Protein (g)");

			  // draw dots
			  $scope.svg.selectAll(".dot")
			      .data(data)
			    .enter().append("circle")
			      .attr("class", "dot")
			      .attr("r", 3.5)
			      .attr("cx", $scope.xMap)
			      .attr("cy", $scope.yMap)
			      .style("fill", function(d) { return $scope.color($scope.cValue(d));}) 
			      .on("mouseover", function(d) {
			          tooltip.transition()
			               .duration(200)
			               .style("opacity", .9);
			          tooltip.html(d["Name"] + "<br/> (" + $scope.xValue(d) 
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
			  $scope.legend = $scope.svg.selectAll(".legend")
			      .data($scope.color.domain())
			    .enter().append("g")
			      .attr("class", "legend")
			      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

			  // draw legend colored rectangles
			  $scope.legend.append("rect")
			      .attr("x", $scope.width - 18)
			      .attr("$scope.width", 18)
			      .attr("$scope.height", 18)
			      .style("fill", $scope.color);

			  // draw legend text
			  $scope.legend.append("text")
			      .attr("x", $scope.width - 24)
			      .attr("y", 9)
			      .attr("dy", ".35em")
			      .style("text-anchor", "end")
			      .text(function(d) { return d;})
			});

		}

		else if (chartType == 'Bar') {

		}

		else if (chartType == 'Pie') {

		}


    }
	
}]);