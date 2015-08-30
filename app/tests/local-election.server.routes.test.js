'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	LocalElection = mongoose.model('LocalElection'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, localElection;

/**
 * Local election routes tests
 */
describe('Local election CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Local election
		user.save(function() {
			localElection = {
				name: 'Local election Name'
			};

			done();
		});
	});

	it('should be able to save Local election instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Local election
				agent.post('/local-elections')
					.send(localElection)
					.expect(200)
					.end(function(localElectionSaveErr, localElectionSaveRes) {
						// Handle Local election save error
						if (localElectionSaveErr) done(localElectionSaveErr);

						// Get a list of Local elections
						agent.get('/local-elections')
							.end(function(localElectionsGetErr, localElectionsGetRes) {
								// Handle Local election save error
								if (localElectionsGetErr) done(localElectionsGetErr);

								// Get Local elections list
								var localElections = localElectionsGetRes.body;

								// Set assertions
								(localElections[0].user._id).should.equal(userId);
								(localElections[0].name).should.match('Local election Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Local election instance if not logged in', function(done) {
		agent.post('/local-elections')
			.send(localElection)
			.expect(401)
			.end(function(localElectionSaveErr, localElectionSaveRes) {
				// Call the assertion callback
				done(localElectionSaveErr);
			});
	});

	it('should not be able to save Local election instance if no name is provided', function(done) {
		// Invalidate name field
		localElection.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Local election
				agent.post('/local-elections')
					.send(localElection)
					.expect(400)
					.end(function(localElectionSaveErr, localElectionSaveRes) {
						// Set message assertion
						(localElectionSaveRes.body.message).should.match('Please fill Local election name');
						
						// Handle Local election save error
						done(localElectionSaveErr);
					});
			});
	});

	it('should be able to update Local election instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Local election
				agent.post('/local-elections')
					.send(localElection)
					.expect(200)
					.end(function(localElectionSaveErr, localElectionSaveRes) {
						// Handle Local election save error
						if (localElectionSaveErr) done(localElectionSaveErr);

						// Update Local election name
						localElection.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Local election
						agent.put('/local-elections/' + localElectionSaveRes.body._id)
							.send(localElection)
							.expect(200)
							.end(function(localElectionUpdateErr, localElectionUpdateRes) {
								// Handle Local election update error
								if (localElectionUpdateErr) done(localElectionUpdateErr);

								// Set assertions
								(localElectionUpdateRes.body._id).should.equal(localElectionSaveRes.body._id);
								(localElectionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Local elections if not signed in', function(done) {
		// Create new Local election model instance
		var localElectionObj = new LocalElection(localElection);

		// Save the Local election
		localElectionObj.save(function() {
			// Request Local elections
			request(app).get('/local-elections')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Local election if not signed in', function(done) {
		// Create new Local election model instance
		var localElectionObj = new LocalElection(localElection);

		// Save the Local election
		localElectionObj.save(function() {
			request(app).get('/local-elections/' + localElectionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', localElection.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Local election instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Local election
				agent.post('/local-elections')
					.send(localElection)
					.expect(200)
					.end(function(localElectionSaveErr, localElectionSaveRes) {
						// Handle Local election save error
						if (localElectionSaveErr) done(localElectionSaveErr);

						// Delete existing Local election
						agent.delete('/local-elections/' + localElectionSaveRes.body._id)
							.send(localElection)
							.expect(200)
							.end(function(localElectionDeleteErr, localElectionDeleteRes) {
								// Handle Local election error error
								if (localElectionDeleteErr) done(localElectionDeleteErr);

								// Set assertions
								(localElectionDeleteRes.body._id).should.equal(localElectionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Local election instance if not signed in', function(done) {
		// Set Local election user 
		localElection.user = user;

		// Create new Local election model instance
		var localElectionObj = new LocalElection(localElection);

		// Save the Local election
		localElectionObj.save(function() {
			// Try deleting Local election
			request(app).delete('/local-elections/' + localElectionObj._id)
			.expect(401)
			.end(function(localElectionDeleteErr, localElectionDeleteRes) {
				// Set message assertion
				(localElectionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Local election error error
				done(localElectionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		LocalElection.remove().exec();
		done();
	});
});