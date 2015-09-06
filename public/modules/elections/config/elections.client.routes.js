'use strict';

//Setting up route
angular.module('elections').config(['$stateProvider',
	function($stateProvider) {
		// Elections state routing
		$stateProvider.
		state('listElections', {
			url: '/elections',
			templateUrl: 'modules/elections/views/list-elections.client.view.html'
		}).
		state('createElection', {
			url: '/elections/create',
			templateUrl: 'modules/elections/views/create-election.client.view.html'
		}).
		state('viewElection', {
			url: '/elections/:electionId',
			templateUrl: 'modules/elections/views/view-election.client.view.html'
		}).
		state('editElection', {
			url: '/elections/:electionId/edit',
			templateUrl: 'modules/elections/views/edit-election.client.view.html'
		});
	}
]);