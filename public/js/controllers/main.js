angular.module('foodController', [])

	// inject the food service factory into our controller
	.controller('mainController', ['$scope','$http','Food', function($scope, $http, Food) {
		$scope.formData = {};
		$scope.loading = true;

		// GET =====================================================================
		// when landing on the page, get all foods and show them
		// use the service to get all the foods
		Food.get()
			.success(function(data) {
				$scope.foods = data;
				$scope.loading = false;
				$scope.calculateTotal();
			});

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createFood = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.name != undefined && $scope.formData.price != undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				Food.create($scope.formData)

					// if successful creation, call our get function to get all the new foods
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.foods = data; // assign our new list of foods
						$scope.calculateTotal();
					});
			}
		};

		// DELETE ==================================================================
		// delete a food after checking it
		$scope.deleteFood = function(id) {
			$scope.loading = true;
			Food.delete(id)
				// if successful creation, call our get function to get all the new foods
				.success(function(data) {
					$scope.loading = false;
					$scope.foods = data; // assign our new list of foods
					$scope.calculateTotal();
				});
		};
		// TOTAL PRICE ==================================================================
		// calculate total price after each change (create,delete)
		$scope.calculateTotal = function(){
			Food.total()
				// if successful creation, assign the new total value
				.success(function(foodData){
					$scope.total = foodData.total;
			});
		};
		// ORDER 
		$scope.order = function(predicate) {
		    $scope.predicate = predicate;
		    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		    $scope.food = orderBy($scope.food, predicate, $scope.reverse);
		};
	}]);