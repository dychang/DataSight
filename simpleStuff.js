//TODO: Fix legend so its not so large and covering stuff
//TODO: Replace the val1,val2,val3 with the values that the user picks

var app = angular.module('DataAggApp', ["checklist-model"]);

app.controller('DataImportCtrl',[ '$scope', '$http', function($scope, $http) {
	$scope.reader = new FileReader();  
	$scope.user = {
    	xcols: [],
		ycols: [],
		legendcol: []
  	};

  	//Handler for Upload Button
	$('#button').click(function(){
	   $("input[type='file']").trigger('click');
	})

	//Handler for file selection - parses file selected
	$("input[type='file']").change(function(){
		$scope.flushEverything();
		$scope.readFile();
		$scope.fileName = $('#input').get(0).files[0].name;
        $scope.$apply();
		$("#buttonModal").modal("toggle");
	}) 

	// FileReader listener
	$scope.reader.onload = function(e) {
  		$scope.fileText = $scope.reader.result;
		$scope.getColumns($scope.fileText);
	}

	// Update button handler - begins file parsing
	$scope.readFile = function() {
		$scope.selectedFile = $('#input').get(0).files[0];
		$scope.fileName = $scope.selectedFile.name;

		$scope.reader.readAsText($scope.selectedFile);
	}

	// Handler for chart type selection - updates global chartType var
	// and toggles x-select modal
	$scope.chartTypeBtn = function(chartType) {
		$scope.chartType = chartType;
		$("#xSelectModal").modal("toggle");
	}

	// Gets column names from file and stores in $scope.fileColumns
	$scope.getColumns = function(file) {
        $scope.allTextLines = file.split(/\r\n|\n/);
        $scope.lines = [];
        for (var i=0; i<$scope.allTextLines.length; i++) {
            var data = $scope.allTextLines[i].split(';');

            var tarr = [];
            for (var j=0; j<data.length; j++) {
                tarr.push(data[j]);
            }
            $scope.lines.push(tarr);
        }

     	$scope.fileColumns = $scope.lines[0].toString().split(',');
	}

	// Flushes global structs relevant to column selection
	$scope.flushEverything = function() {
    	$scope.user.xcols = [];
    	$scope.user.ycols = [];
    	$scope.user.legendcol = [];
    	$scope.fileColumns = [];
  	}

  	// Removes user selected x-axis columns and toggles y-select modal
  	$scope.xSelBtn = function() {
		$scope.dispYCols = $scope.fileColumns.filter(function(d) {
		  return $scope.user.xcols.indexOf(d) < 0;
		});
		// TODO validate x col
    	$scope.user.ycols = [];
		$("#ySelectModal").modal("toggle");
  	}

  	// Toggles legend-select modal
  	$scope.ySelBtn = function() {

  		// TODO validate y col
  		// alert($scope.lines[1].split(',')[1]);
  		var y = String($scope.lines[1]).split(',')[1];
  		if(!parseFloat(y)) {
			
  			alert("Invalid column data type");
  		}

  		$scope.dispLegendCols = $scope.dispYCols.filter(function(d) {
		  return $scope.user.ycols.indexOf(d) < 0;
		});

    	$scope.user.legendcol = [];
    	
  		if($scope.chartType.toUpperCase() == "SCATTER") {
			$("#legendSelectModal").modal("toggle");
		}
		else {
			$("#confirmModal").modal("toggle");
		}
  	}

  	// Toggles confirm-select modal
  	$scope.legendSelBtn = function() {
		$("#confirmModal").modal("toggle");
  	}
 //  	$scope.updateSelection = function(position, columns, user.col) {
	//   angular.forEach(columns, function(subscription, index) {
	//     if (position != index) 
	//       subscription.checked = false;
	//   });
	// }

	$scope.create_graph = function(chartType) {

		d3.select("svg").remove();

		if (chartType == 'Scatter') {

			/* 
			 * value accessor - returns the value to encode for a given data object.
			 * scale - maps value to a visual display encoding, such as a pixel position.
			 * map function - maps from data value to display value
			 * axis - sets up axis
			 */ 

			 var val1 = $scope.user.xcols[0];
			 var val2 = $scope.user.ycols[0];
			 var val3 = $scope.user.legendcol[0];

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
			var svg = d3.select("#graph").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// add the tooltip area to the webpage
			var tooltip = d3.select("#graph").append("div")
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
			          tooltip.html(d[val3] + "<br/> (" + xValue(d) 
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

			var val1 = $scope.user.xcols[0];
			var val2 = $scope.user.ycols[0];

			var margin = {top: 20, right: 20, bottom: 70, left: 40},
    			width = 600,
    			height = 300;

		var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

		var y = d3.scale.linear().range([height, 0]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")
		    .ticks(10);

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
		    .ticks(10);

		var svgCont = d3.select("body").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", 
		          "translate(" + margin.left + "," + margin.top + ")");

		d3.csv("bar_data.csv", function(error, data) {

		    data.forEach(function(d) {
		        // d.date = parseDate(d.date);
		        d.value = +d.value;
		    });
		  
		  x.domain(data.map(function(d) { return d[val1]; }));
		  y.domain([0, d3.max(data, function(d) { return d[val2]; })]);

		  svgCont.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis)
		    .selectAll("text")
		      .style("text-anchor", "end")
		      .attr("dx", "-.8em")
		      .attr("dy", "-.55em")
		      .attr("transform", "rotate(-90)" )
		      // .text(val1)
		      ;

		  svgCont.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      // .text(val2)
		      ;

		  svgCont.selectAll("bar")
		      .data(data)
		    .enter().append("rect")
		      .style("fill", "teal")
		      .attr("x", function(d) { return x([d[val1]]); })
		      .attr("width", x.rangeBand())
		      .attr("y", function(d) { return y(d[val2]); })
		      .attr("height", function(d) { return height - y(d[val2]); });

});
		}

		else if (chartType == 'Pie') {
			// TEMP VALS:
			// var fileName = 'pie_data.csv'
			// var categoryName = 'age';
			// var categoryValue = 'population';
			var fileName = $scope.fileName;

			var param = $scope.user;
			var categoryName = param.xcols[0];
			var categoryValue = param.ycols[0];

			var width = 960;
			var height = 500;
			var radius = Math.min(width, height) / 2;

			var color = d3.scale.ordinal()
							.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

			var arc = d3.svg.arc()
						.outerRadius(radius - 10)
						.innerRadius(0);

			var labelArc = d3.svg.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

			var pie = d3.layout.pie()
						.sort(null)
						.value(function(d) { return d[categoryValue]; });

			var svg = d3.select("#graph").append("svg")
						.attr("width", width)
						.attr("height", height)
						.append("g")
						.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			d3.csv(fileName, type, function(error, data) {
				if (error) throw error;

				var g = svg.selectAll(".arc")
							.data(pie(data))
							.enter().append("g")
							.attr("class", "arc");

				g.append("path")
					.attr("d", arc)
					.style("fill", function(d) { return color(d.data[categoryName]); });

				g.append("text")
					.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
					.attr("dy", ".35em")
					.text(function(d) { return d.data[categoryName]; });
				});

			function type(d) {
				d[categoryValue] = +d[categoryValue];
				return d;
			}
		}

	$("#visualModal").modal("toggle");
    }
	
}]);