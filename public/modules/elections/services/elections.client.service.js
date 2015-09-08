'use strict';

//Elections service used to communicate Elections REST endpoints
angular.module('elections').factory('Elections', ['$resource',
	function($resource) {
		return {
		    resource : $resource('elections/:electionId', { electionId: '@_id'},
		        {
		            update: {method: 'PUT'}
		        }
		    )


		};
	}
]);