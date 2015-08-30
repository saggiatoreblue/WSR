'use strict';

//Setting up route
angular.module('local-elections').config(['$stateProvider',
	function($stateProvider) {
		// Local elections state routing
		$stateProvider.
		state('listLocalElections', {
			url: '/local-elections',
			templateUrl: 'modules/local-elections/views/list-local-elections.client.view.html'
		}).
		state('createLocalElection', {
			url: '/local-elections/create',
			templateUrl: 'modules/local-elections/views/create-local-election.client.view.html'
		}).
		state('viewLocalElection', {
			url: '/local-elections/:localElectionId',
			templateUrl: 'modules/local-elections/views/view-local-election.client.view.html'
		}).
		state('editLocalElection', {
			url: '/local-elections/:localElectionId/edit',
			templateUrl: 'modules/local-elections/views/edit-local-election.client.view.html'
		});
	}
]);