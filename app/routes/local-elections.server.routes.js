'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var localElections = require('../../app/controllers/local-elections.server.controller');

	// Local elections Routes
	app.route('/local-elections')
		.get(localElections.list);

    app.route('/local-elections/:localElectionId')
        .get(localElections.read)
        .put(localElections.update);

	// Finish by binding the Local election middleware
	app.param('localElectionId', localElections.localElectionById);
};
