'use strict';

// Configuring the Articles module
angular.module('utentis').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Utentis', 'utentis', 'dropdown', '/utentis(/create)?');
		Menus.addSubMenuItem('topbar', 'utentis', 'List Utentis', 'utentis');
		Menus.addSubMenuItem('topbar', 'utentis', 'New Utenti', 'utentis/create');
	}
]);