'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Utenti = mongoose.model('Utenti'),
	_ = require('lodash');

/**
 * Create a Utenti
 */
exports.create = function(req, res) {
	var utenti = new Utenti(req.body);
	utenti.user = req.user;

	utenti.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
    /* alessandro : aggiunto supporto per websocket
      NON FUNZIONA . PRESO DA https://vexxhost.com/resources/tutorials/mean-socket-io-integration-tutorial/
    */
    var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
socketio.sockets.emit('utenti.created', utenti); // emit an event for all connected clients
			res.jsonp(utenti);
		}
	});
};

/**
 * Show the current Utenti
 */
exports.read = function(req, res) {
	res.jsonp(req.utenti);
};

/**
 * Update a Utenti
 */
exports.update = function(req, res) {
	var utenti = req.utenti ;

	utenti = _.extend(utenti , req.body);

	utenti.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(utenti);
		}
	});
};

/**
 * Delete an Utenti
 */
exports.delete = function(req, res) {
	var utenti = req.utenti ;

	utenti.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(utenti);
		}
	});
};

/**
 * List of Utentis
 */
exports.list = function(req, res) { 

/*
 riga originale
Utenti.find().sort('-created').populate('user', 'displayName').exec(function(err, utentis) {

con la modifica che ho fatto, l'utente visualizza soltanto gli utenti che ha creato lui solo.
*/


Utenti.find({user:req.user.id}).sort('-created').populate('user', 'displayName').exec(function(err, utentis) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {      
    console.log('ciaooo '+utentis[0].user +' ----> '+req.user.id);
      
			res.jsonp(utentis);
		}
	});
};

/**
 * Utenti middleware
 */
exports.utentiByID = function(req, res, next, id) { 
	Utenti.findById(id).populate('user', 'displayName').exec(function(err, utenti) {
		if (err) return next(err);
		if (! utenti) return next(new Error('Failed to load Utenti ' + id));
		req.utenti = utenti ;
		next();
	});
};

/**
 * Utenti authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.utenti.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
