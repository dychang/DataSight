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
	
}]);