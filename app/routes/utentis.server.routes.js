'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var utentis = require('../../app/controllers/utentis.server.controller');

	// Utentis Routes
	app.route('/utentis')
		.get(utentis.list)
		.post(users.requiresLogin, utentis.create);

	app.route('/utentis/:utentiId')
		.get(utentis.read)
		.put(users.requiresLogin, utentis.hasAuthorization, utentis.update)
		.delete(users.requiresLogin, utentis.hasAuthorization, utentis.delete);

	// Finish by binding the Utenti middleware
	app.param('utentiId', utentis.utentiByID);
};
