'use strict';

// Local elections controller
angular.module('local-elections').controller('LocalElectionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'LocalElections',
	function($scope, $stateParams, $location, Authentication, LocalElections) {
		$scope.authentication = Authentication;
		$scope.electionData = false;
		$scope.localElections = [];

        // Find a list of Local elections
        $scope.find = function() {
           LocalElections.query().$promise.then(function(data){
                if(data.length > 0) {
                    $scope.electionData = true;
                    data.forEach(function(item){
                        if(item.office) {
                            $scope.localElections.push(item);
                        }
                    });
                }
                else {
                    $scope.electionData = false;
                }

            }, function(){
                $scope.electionData = false;
            });

        };

		/* Remove existing Local election
		$scope.remove = function(localElection) {
			if ( localElection ) { 
				localElection.$remove();

				for (var i in $scope.localElections) {
					if ($scope.localElections [i] === localElection) {
						$scope.localElections.splice(i, 1);
					}
				}
			} else {
				$scope.localElection.$remove(function() {
					$location.path('local-elections');
				});
			}
		};
        */
		/* Update existing Local election
		$scope.update = function() {
			var localElection = $scope.localElection;

			localElection.$update(function() {
				$location.path('local-elections/' + localElection._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};*/

		/* Find existing Local election
		$scope.findOne = function() {
			$scope.localElection = LocalElections.get({ 
				localElectionId: $stateParams.localElectionId
			});
		};
		*/
	}
]);