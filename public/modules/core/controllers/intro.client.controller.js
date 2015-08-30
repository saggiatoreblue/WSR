'use strict';

angular.module('core').controller('IntroController', ['$scope', 'Authentication',
	function($scope, Authentication) {
        $scope.authentication = Authentication;
	}
]);