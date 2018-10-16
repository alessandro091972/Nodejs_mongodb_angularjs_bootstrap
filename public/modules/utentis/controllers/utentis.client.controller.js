'use strict';

// Utentis controller
angular.module('utentis').controller('UtentisController', ['$scope', '$stateParams', '$location', 'Authentication', 'Utentis',
	function($scope, $stateParams, $location, Authentication, Utentis) {
		$scope.authentication = Authentication;

		// Create new Utenti
		$scope.create = function() {
			// Create new Utenti object
			var utenti = new Utentis ({
				firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        password: this.password,
        email: this.email
			});

			// Redirect after save
			utenti.$save(function(response) {
				$location.path('utentis/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Utenti
		$scope.remove = function(utenti) {
			if ( utenti ) { 
				utenti.$remove();

				for (var i in $scope.utentis) {
					if ($scope.utentis [i] === utenti) {
						$scope.utentis.splice(i, 1);
					}
				}
			} else {
				$scope.utenti.$remove(function() {
					$location.path('utentis');
				});
			}
		};

		// Update existing Utenti
		$scope.update = function() {
			var utenti = $scope.utenti;

			utenti.$update(function() {
				$location.path('utentis/' + utenti._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Utentis
		$scope.find = function() {
			$scope.utentis = Utentis.query();
		};

		// Find existing Utenti
		$scope.findOne = function() {
			$scope.utenti = Utentis.get({ 
				utentiId: $stateParams.utentiId
			});
		};
	}
]);