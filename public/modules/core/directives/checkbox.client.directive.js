'use strict';

angular.module('core').directive('checkbox', [
	function() {
		return {
			restrict: 'C',
			link: function postLink(scope, element, attrs) {
                element.click(function(){
                     var others = element.parents('ul').find('.checkbox');
                     others.not(element).removeClass('active');
                     element.toggleClass('active');
                });
			}
		};
	}
]);