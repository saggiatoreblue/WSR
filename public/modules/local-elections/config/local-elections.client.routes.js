'use strict';

//Setting up route
angular.module('local-elections').config(['$stateProvider',
	function($stateProvider) {
		// Local elections state routing
		$stateProvider.
		state('listLocalElections', {
			url: '/local-elections',
			templateUrl: 'modules/local-elections/views/list-local-elections.client.view.html'
		});

	}
]);