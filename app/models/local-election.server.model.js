'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Local election Schema
 */
var LocalElectionSchema = new Schema({
	office: {
		type: String,
		default: '',
		trim: true
	},
    candidates : {
        type: Array
    },
    district: {
        type: String,
        trim: true,
        default: ''
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('LocalElection', LocalElectionSchema);