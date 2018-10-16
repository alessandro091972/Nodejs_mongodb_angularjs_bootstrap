'use strict';

//Utentis service used to communicate Utentis REST endpoints
angular.module('utentis').factory('Utentis', ['$resource',
	function($resource) {
		return $resource('utentis/:utentiId', { utentiId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);