'use strict';

// Configuring the Articles module
angular.module('local-elections').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Local Elections', 'local-elections', '/local-elections');
	}
]);