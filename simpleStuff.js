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

	$scope.run_Scatter = function() {

        // Set the dimensions of the canvas / graph
        $scope.margin = {top: 30, right: 20, bottom: 30, left: 50},
            $scope.width = 600 - $scope.margin.left - $scope.margin.right,
            $scope.height = 270 - $scope.margin.top - $scope.margin.bottom;

        // Parse the date / time
        $scope.parseDate = d3.time.format("%d-%b-%y").parse;

        // Set the ranges
        $scope.x = d3.time.scale().range([0, $scope.width]);
        $scope.y = d3.scale.linear().range([$scope.height, 0]);

        // Define the axes
        $scope.xAxis = d3.svg.axis().scale($scope.x)
            .orient("bottom").ticks(5);

        $scope.yAxis = d3.svg.axis().scale($scope.y)
            .orient("left").ticks(5);

        // Define the line
        $scope.valueline = d3.svg.line()
            .x(function(d) { return $scope.x(d.date); })
            .y(function(d) { return $scope.y(d.close); });
            
        // Adds the svg canvas
        $scope.svg = d3.select("body")
            .append("svg")
                .attr("width", $scope.width + $scope.margin.left + $scope.margin.right)
                .attr("height", $scope.height + $scope.margin.top + $scope.margin.bottom)
            .append("g")
                .attr("transform", 
                      "translate(" + $scope.margin.left + "," + $scope.margin.top + ")");

        // Get the data
        $scope.d3 = d3.csv($scope.fileName, function(error, data) {
            data.forEach(function(d) {
                d.date = $scope.parseDate(d.date);
                d.close = +d.close;
            });

            // Scale the range of the data
            $scope.x.domain(d3.extent(data, function(d) { return d.date; }));
            $scope.y.domain([0, d3.max(data, function(d) { return d.close; })]);

            // Add the valueline path.
            $scope.svg.append("path")
                .attr("class", "line")
                .attr("d", $scope.valueline(data));

            // Add the scatterplot
            $scope.svg.selectAll("dot")
                .data(data)
              .enter().append("circle")
                .attr("r", 3.5)
                .attr("cx", function(d) { return $scope.x(d.date); })
                .attr("cy", function(d) { return $scope.y(d.close); });

            // Add the X Axis
            $scope.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + $scope.height + ")")
                .call($scope.xAxis);

            // Add the Y Axis
            $scope.svg.append("g")
                .attr("class", "y axis")
                .call($scope.yAxis);

        });
    }
	
}]);