'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Election = mongoose.model('Election'),
	_ = require('lodash');

/**
 * Create a Election
 */
exports.create = function(req, res) {
	var election = new Election(req.body);
	election.user = req.user;

	election.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(election);
		}
	});
};

/**
 * Show the current Election
 */
exports.read = function(req, res) {
	res.jsonp(req.election);

};

/**
 * Update a Election
 */
exports.update = function(req, res) {
	var election = req.election ;

	election = _.extend(election , req.body);

	election.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(election);
		}
	});
};

/**
 * Delete an Election
 */
exports.delete = function(req, res) {
	var election = req.election ;

	election.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(election);
		}
	});
};

/**
 * List of Elections
 */
exports.list = function(req, res) {
	Election.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, elections) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(elections);
		}
	});
};

/**
 * Election middleware
 */
exports.electionByID = function(req, res, next, id) {
	Election.findById(id).populate('user', 'displayName').exec(function(err, election) {
		if (err) return next(err);
		if (! election) return next(new Error('Failed to load Election ' + id));
		req.election = election ;
		next();
	});
};

/**
 * Election authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.election.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
