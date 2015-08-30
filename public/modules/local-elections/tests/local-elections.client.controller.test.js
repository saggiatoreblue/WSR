'use strict';

(function() {
	// Local elections Controller Spec
	describe('Local elections Controller Tests', function() {
		// Initialize global variables
		var LocalElectionsController,
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

			// Initialize the Local elections controller.
			LocalElectionsController = $controller('LocalElectionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Local election object fetched from XHR', inject(function(LocalElections) {
			// Create sample Local election using the Local elections service
			var sampleLocalElection = new LocalElections({
				name: 'New Local election'
			});

			// Create a sample Local elections array that includes the new Local election
			var sampleLocalElections = [sampleLocalElection];

			// Set GET response
			$httpBackend.expectGET('local-elections').respond(sampleLocalElections);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.localElections).toEqualData(sampleLocalElections);
		}));

		it('$scope.findOne() should create an array with one Local election object fetched from XHR using a localElectionId URL parameter', inject(function(LocalElections) {
			// Define a sample Local election object
			var sampleLocalElection = new LocalElections({
				name: 'New Local election'
			});

			// Set the URL parameter
			$stateParams.localElectionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/local-elections\/([0-9a-fA-F]{24})$/).respond(sampleLocalElection);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.localElection).toEqualData(sampleLocalElection);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(LocalElections) {
			// Create a sample Local election object
			var sampleLocalElectionPostData = new LocalElections({
				name: 'New Local election'
			});

			// Create a sample Local election response
			var sampleLocalElectionResponse = new LocalElections({
				_id: '525cf20451979dea2c000001',
				name: 'New Local election'
			});

			// Fixture mock form input values
			scope.name = 'New Local election';

			// Set POST response
			$httpBackend.expectPOST('local-elections', sampleLocalElectionPostData).respond(sampleLocalElectionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Local election was created
			expect($location.path()).toBe('/local-elections/' + sampleLocalElectionResponse._id);
		}));

		it('$scope.update() should update a valid Local election', inject(function(LocalElections) {
			// Define a sample Local election put data
			var sampleLocalElectionPutData = new LocalElections({
				_id: '525cf20451979dea2c000001',
				name: 'New Local election'
			});

			// Mock Local election in scope
			scope.localElection = sampleLocalElectionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/local-elections\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/local-elections/' + sampleLocalElectionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid localElectionId and remove the Local election from the scope', inject(function(LocalElections) {
			// Create new Local election object
			var sampleLocalElection = new LocalElections({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Local elections array and include the Local election
			scope.localElections = [sampleLocalElection];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/local-elections\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLocalElection);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.localElections.length).toBe(0);
		}));
	});
}());