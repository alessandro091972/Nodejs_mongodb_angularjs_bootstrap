'use strict';

//Setting up route
angular.module('utentis').config(['$stateProvider',
	function($stateProvider) {
		// Utentis state routing
		$stateProvider.
		state('team', {
			url: '/team',
			templateUrl: 'modules/utentis/views/team.client.view.html'
		}).
		state('listUtentis', {
			url: '/utentis',
			templateUrl: 'modules/utentis/views/list-utentis.client.view.html'
		}).
		state('createUtenti', {
			url: '/utentis/create',
			templateUrl: 'modules/utentis/views/create-utenti.client.view.html'
		}).
		state('viewUtenti', {
			url: '/utentis/:utentiId',
			templateUrl: 'modules/utentis/views/view-utenti.client.view.html'
		}).
		state('editUtenti', {
			url: '/utentis/:utentiId/edit',
			templateUrl: 'modules/utentis/views/edit-utenti.client.view.html'
		});
	}
]);