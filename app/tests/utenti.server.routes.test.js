'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Utenti = mongoose.model('Utenti'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, utenti;

/**
 * Utenti routes tests
 */
describe('Utenti CRUD tests', function() {
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

		// Save a user to the test db and create new Utenti
		user.save(function() {
			utenti = {
				name: 'Utenti Name'
			};

			done();
		});
	});

	it('should be able to save Utenti instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Utenti
				agent.post('/utentis')
					.send(utenti)
					.expect(200)
					.end(function(utentiSaveErr, utentiSaveRes) {
						// Handle Utenti save error
						if (utentiSaveErr) done(utentiSaveErr);

						// Get a list of Utentis
						agent.get('/utentis')
							.end(function(utentisGetErr, utentisGetRes) {
								// Handle Utenti save error
								if (utentisGetErr) done(utentisGetErr);

								// Get Utentis list
								var utentis = utentisGetRes.body;

								// Set assertions
								(utentis[0].user._id).should.equal(userId);
								(utentis[0].name).should.match('Utenti Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Utenti instance if not logged in', function(done) {
		agent.post('/utentis')
			.send(utenti)
			.expect(401)
			.end(function(utentiSaveErr, utentiSaveRes) {
				// Call the assertion callback
				done(utentiSaveErr);
			});
	});

	it('should not be able to save Utenti instance if no name is provided', function(done) {
		// Invalidate name field
		utenti.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Utenti
				agent.post('/utentis')
					.send(utenti)
					.expect(400)
					.end(function(utentiSaveErr, utentiSaveRes) {
						// Set message assertion
						(utentiSaveRes.body.message).should.match('Please fill Utenti name');
						
						// Handle Utenti save error
						done(utentiSaveErr);
					});
			});
	});

	it('should be able to update Utenti instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Utenti
				agent.post('/utentis')
					.send(utenti)
					.expect(200)
					.end(function(utentiSaveErr, utentiSaveRes) {
						// Handle Utenti save error
						if (utentiSaveErr) done(utentiSaveErr);

						// Update Utenti name
						utenti.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Utenti
						agent.put('/utentis/' + utentiSaveRes.body._id)
							.send(utenti)
							.expect(200)
							.end(function(utentiUpdateErr, utentiUpdateRes) {
								// Handle Utenti update error
								if (utentiUpdateErr) done(utentiUpdateErr);

								// Set assertions
								(utentiUpdateRes.body._id).should.equal(utentiSaveRes.body._id);
								(utentiUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Utentis if not signed in', function(done) {
		// Create new Utenti model instance
		var utentiObj = new Utenti(utenti);

		// Save the Utenti
		utentiObj.save(function() {
			// Request Utentis
			request(app).get('/utentis')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Utenti if not signed in', function(done) {
		// Create new Utenti model instance
		var utentiObj = new Utenti(utenti);

		// Save the Utenti
		utentiObj.save(function() {
			request(app).get('/utentis/' + utentiObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', utenti.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Utenti instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Utenti
				agent.post('/utentis')
					.send(utenti)
					.expect(200)
					.end(function(utentiSaveErr, utentiSaveRes) {
						// Handle Utenti save error
						if (utentiSaveErr) done(utentiSaveErr);

						// Delete existing Utenti
						agent.delete('/utentis/' + utentiSaveRes.body._id)
							.send(utenti)
							.expect(200)
							.end(function(utentiDeleteErr, utentiDeleteRes) {
								// Handle Utenti error error
								if (utentiDeleteErr) done(utentiDeleteErr);

								// Set assertions
								(utentiDeleteRes.body._id).should.equal(utentiSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Utenti instance if not signed in', function(done) {
		// Set Utenti user 
		utenti.user = user;

		// Create new Utenti model instance
		var utentiObj = new Utenti(utenti);

		// Save the Utenti
		utentiObj.save(function() {
			// Try deleting Utenti
			request(app).delete('/utentis/' + utentiObj._id)
			.expect(401)
			.end(function(utentiDeleteErr, utentiDeleteRes) {
				// Set message assertion
				(utentiDeleteRes.body.message).should.match('User is not logged in');

				// Handle Utenti error error
				done(utentiDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Utenti.remove().exec();
		done();
	});
});