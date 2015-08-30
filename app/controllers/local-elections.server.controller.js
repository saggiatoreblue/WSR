'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	LocalElection = mongoose.model('LocalElection'),
	_ = require('lodash');



/**
 * Update a Local election

exports.update = function(req, res) {
	var localElection = req.localElection ;

	localElection = _.extend(localElection , req.body);

	localElection.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(localElection);
		}
	});
};
 */

/**
 * Delete an Local election

exports.delete = function(req, res) {
	var localElection = req.localElection ;

	localElection.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(localElection);
		}
	});
};
 */

/**
 * List of Local elections
 */
exports.list = function(req, res) {

	LocalElection.find({user : req.user}).exec(function(err, localElections) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(localElections);
		}
	});
};

/**
 * Local election middleware
 */
exports.localElectionByID = function(req, res, next, id) { 
	LocalElection.findById(id).populate('user', 'displayName').exec(function(err, localElection) {
		if (err) return next(err);
		if (! localElection) return next(new Error('Failed to load Local election ' + id));
		req.localElection = localElection ;
		next();
	});
};

/**
 * Local election authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.localElection.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
