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
                        localElection.hasBeenVoted = true;
                    });
                    localElection.$update(function(localElection) {
                            var existingElection = Elections.resource.query({hash: el.hash}, function(response){
                                if(response.length > 0) {
                                    existingElection[0].candidates = localElection.candidates;
                                    existingElection[0].$update();
                                }
                                else {
                                    var newElection = new Elections.resource({
                                        state: localElection.state,
                                        data: localElection.data,
                                        candidates: localElection.candidates,
                                        hash: localElection.hash
                                    });
                                    newElection.$save();
                                }
                            });
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                }
            });

        };

	}
]);