'use strict';

(function() {
	// Utentis Controller Spec
	describe('Utentis Controller Tests', function() {
		// Initialize global variables
		var UtentisController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Utentis controller.
			UtentisController = $controller('UtentisController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Utenti object fetched from XHR', inject(function(Utentis) {
			// Create sample Utenti using the Utentis service
			var sampleUtenti = new Utentis({
				name: 'New Utenti'
			});

			// Create a sample Utentis array that includes the new Utenti
			var sampleUtentis = [sampleUtenti];

			// Set GET response
			$httpBackend.expectGET('utentis').respond(sampleUtentis);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.utentis).toEqualData(sampleUtentis);
		}));

		it('$scope.findOne() should create an array with one Utenti object fetched from XHR using a utentiId URL parameter', inject(function(Utentis) {
			// Define a sample Utenti object
			var sampleUtenti = new Utentis({
				name: 'New Utenti'
			});

			// Set the URL parameter
			$stateParams.utentiId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/utentis\/([0-9a-fA-F]{24})$/).respond(sampleUtenti);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.utenti).toEqualData(sampleUtenti);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Utentis) {
			// Create a sample Utenti object
			var sampleUtentiPostData = new Utentis({
				name: 'New Utenti'
			});

			// Create a sample Utenti response
			var sampleUtentiResponse = new Utentis({
				_id: '525cf20451979dea2c000001',
				name: 'New Utenti'
			});

			// Fixture mock form input values
			scope.name = 'New Utenti';

			// Set POST response
			$httpBackend.expectPOST('utentis', sampleUtentiPostData).respond(sampleUtentiResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Utenti was created
			expect($location.path()).toBe('/utentis/' + sampleUtentiResponse._id);
		}));

		it('$scope.update() should update a valid Utenti', inject(function(Utentis) {
			// Define a sample Utenti put data
			var sampleUtentiPutData = new Utentis({
				_id: '525cf20451979dea2c000001',
				name: 'New Utenti'
			});

			// Mock Utenti in scope
			scope.utenti = sampleUtentiPutData;

			// Set PUT response
			$httpBackend.expectPUT(/utentis\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/utentis/' + sampleUtentiPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid utentiId and remove the Utenti from the scope', inject(function(Utentis) {
			// Create new Utenti object
			var sampleUtenti = new Utentis({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Utentis array and include the Utenti
			scope.utentis = [sampleUtenti];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/utentis\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUtenti);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.utentis.length).toBe(0);
		}));
	});
}());