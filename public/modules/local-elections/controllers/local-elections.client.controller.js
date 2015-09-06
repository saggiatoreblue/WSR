'use strict';

// Local elections controller
angular.module('local-elections').controller('LocalElectionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'LocalElections', 'Elections',
	function($scope, $stateParams, $location, Authentication, LocalElections, Elections) {
		$scope.authentication = Authentication;

        // Find a list of Local elections
        $scope.find = function() {
            $scope.localElections = LocalElections.resource.query();
        };

        $scope.voteFor = function(el, can, event) {
            LocalElections.resource.get({localElectionId: el._id},function(localElection){
                if(localElection.candidates) {
                    localElection.candidates.forEach(function(candidate){
                        candidate.isSelected = (can._id === candidate._id && can.isSelected !== true);
                    });
                    localElection.$update(function(localElection) {
                          //create new Election based on local Election data
                          //if we have already generated an election for this local Election, update election instead
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                }
            });

        };

	}
]);