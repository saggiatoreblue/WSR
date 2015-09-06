'use strict';

// Elections controller
angular.module('elections').controller('ElectionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Elections',
	function($scope, $stateParams, $location, Authentication, Elections) {
		$scope.authentication = Authentication;


		// Create new Election
		$scope.create = function() {
			// Create new Election object
			var election = new Elections.resource ({
				name: this.name
			});

			// Redirect after save
			election.$save(function(response) {
				$location.path('elections/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Election
		$scope.remove = function(election) {
			if ( election ) { 
				election.$remove();

				for (var i in $scope.elections) {
					if ($scope.elections [i] === election) {
						$scope.elections.splice(i, 1);
					}
				}
			} else {
				$scope.election.$remove(function() {
					$location.path('elections');
				});
			}
		};

		// Update existing Election
		$scope.update = function() {
			var election = $scope.election;

			election.$update(function() {
				$location.path('elections/' + election._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Elections
		$scope.find = function() {
			$scope.elections = Elections.resource.query();
		};

		// Find existing Election
		$scope.findOne = function() {
			$scope.election = Elections.resource.get({
				electionId: $stateParams.electionId
			});
		};
	}
]);