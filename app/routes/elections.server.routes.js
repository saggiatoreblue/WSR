'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var elections = require('../../app/controllers/elections.server.controller');

	// Elections Routes
	app.route('/elections')
		.get(elections.list)
		.post(users.requiresLogin, elections.create);

	app.route('/elections/:electionId')
		.get(elections.read)
		.put(users.requiresLogin, elections.hasAuthorization, elections.update)
		.delete(users.requiresLogin, elections.hasAuthorization, elections.delete);




	// Finish by binding the Election middleware
	app.param('electionId', elections.electionByID);
};
