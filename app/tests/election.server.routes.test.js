'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Election = mongoose.model('Election'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, election;

/**
 * Election routes tests
 */
describe('Election CRUD tests', function() {
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

		// Save a user to the test db and create new Election
		user.save(function() {
			election = {
				name: 'Election Name'
			};

			done();
		});
	});

	it('should be able to save Election instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Election
				agent.post('/elections')
					.send(election)
					.expect(200)
					.end(function(electionSaveErr, electionSaveRes) {
						// Handle Election save error
						if (electionSaveErr) done(electionSaveErr);

						// Get a list of Elections
						agent.get('/elections')
							.end(function(electionsGetErr, electionsGetRes) {
								// Handle Election save error
								if (electionsGetErr) done(electionsGetErr);

								// Get Elections list
								var elections = electionsGetRes.body;

								// Set assertions
								(elections[0].user._id).should.equal(userId);
								(elections[0].name).should.match('Election Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Election instance if not logged in', function(done) {
		agent.post('/elections')
			.send(election)
			.expect(401)
			.end(function(electionSaveErr, electionSaveRes) {
				// Call the assertion callback
				done(electionSaveErr);
			});
	});

	it('should not be able to save Election instance if no name is provided', function(done) {
		// Invalidate name field
		election.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Election
				agent.post('/elections')
					.send(election)
					.expect(400)
					.end(function(electionSaveErr, electionSaveRes) {
						// Set message assertion
						(electionSaveRes.body.message).should.match('Please fill Election name');
						
						// Handle Election save error
						done(electionSaveErr);
					});
			});
	});

	it('should be able to update Election instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Election
				agent.post('/elections')
					.send(election)
					.expect(200)
					.end(function(electionSaveErr, electionSaveRes) {
						// Handle Election save error
						if (electionSaveErr) done(electionSaveErr);

						// Update Election name
						election.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Election
						agent.put('/elections/' + electionSaveRes.body._id)
							.send(election)
							.expect(200)
							.end(function(electionUpdateErr, electionUpdateRes) {
								// Handle Election update error
								if (electionUpdateErr) done(electionUpdateErr);

								// Set assertions
								(electionUpdateRes.body._id).should.equal(electionSaveRes.body._id);
								(electionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Elections if not signed in', function(done) {
		// Create new Election model instance
		var electionObj = new Election(election);

		// Save the Election
		electionObj.save(function() {
			// Request Elections
			request(app).get('/elections')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Election if not signed in', function(done) {
		// Create new Election model instance
		var electionObj = new Election(election);

		// Save the Election
		electionObj.save(function() {
			request(app).get('/elections/' + electionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', election.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Election instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Election
				agent.post('/elections')
					.send(election)
					.expect(200)
					.end(function(electionSaveErr, electionSaveRes) {
						// Handle Election save error
						if (electionSaveErr) done(electionSaveErr);

						// Delete existing Election
						agent.delete('/elections/' + electionSaveRes.body._id)
							.send(election)
							.expect(200)
							.end(function(electionDeleteErr, electionDeleteRes) {
								// Handle Election error error
								if (electionDeleteErr) done(electionDeleteErr);

								// Set assertions
								(electionDeleteRes.body._id).should.equal(electionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Election instance if not signed in', function(done) {
		// Set Election user 
		election.user = user;

		// Create new Election model instance
		var electionObj = new Election(election);

		// Save the Election
		electionObj.save(function() {
			// Try deleting Election
			request(app).delete('/elections/' + electionObj._id)
			.expect(401)
			.end(function(electionDeleteErr, electionDeleteRes) {
				// Set message assertion
				(electionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Election error error
				done(electionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Election.remove().exec();
		done();
	});
});