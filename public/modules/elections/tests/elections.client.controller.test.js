'use strict';

(function() {
	// Elections Controller Spec
	describe('Elections Controller Tests', function() {
		// Initialize global variables
		var ElectionsController,
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

			// Initialize the Elections controller.
			ElectionsController = $controller('ElectionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Election object fetched from XHR', inject(function(Elections) {
			// Create sample Election using the Elections service
			var sampleElection = new Elections({
				name: 'New Election'
			});

			// Create a sample Elections array that includes the new Election
			var sampleElections = [sampleElection];

			// Set GET response
			$httpBackend.expectGET('elections').respond(sampleElections);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.elections).toEqualData(sampleElections);
		}));

		it('$scope.findOne() should create an array with one Election object fetched from XHR using a electionId URL parameter', inject(function(Elections) {
			// Define a sample Election object
			var sampleElection = new Elections({
				name: 'New Election'
			});

			// Set the URL parameter
			$stateParams.electionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/elections\/([0-9a-fA-F]{24})$/).respond(sampleElection);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.election).toEqualData(sampleElection);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Elections) {
			// Create a sample Election object
			var sampleElectionPostData = new Elections({
				name: 'New Election'
			});

			// Create a sample Election response
			var sampleElectionResponse = new Elections({
				_id: '525cf20451979dea2c000001',
				name: 'New Election'
			});

			// Fixture mock form input values
			scope.name = 'New Election';

			// Set POST response
			$httpBackend.expectPOST('elections', sampleElectionPostData).respond(sampleElectionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Election was created
			expect($location.path()).toBe('/elections/' + sampleElectionResponse._id);
		}));

		it('$scope.update() should update a valid Election', inject(function(Elections) {
			// Define a sample Election put data
			var sampleElectionPutData = new Elections({
				_id: '525cf20451979dea2c000001',
				name: 'New Election'
			});

			// Mock Election in scope
			scope.election = sampleElectionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/elections\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/elections/' + sampleElectionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid electionId and remove the Election from the scope', inject(function(Elections) {
			// Create new Election object
			var sampleElection = new Elections({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Elections array and include the Election
			scope.elections = [sampleElection];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/elections\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleElection);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.elections.length).toBe(0);
		}));
	});
}());