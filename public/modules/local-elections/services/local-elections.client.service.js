'use strict';

//Local elections service used to communicate Local elections REST endpoints
angular.module('local-elections').factory('LocalElections', ['$resource',
	function($resource) {
		return {
		    resource : $resource('local-elections/:localElectionId', { localElectionId: '@_id'}, {update: {method: 'PUT'} })
    };
}
]);