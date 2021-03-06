'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Local election Schema
 */

var LocalElectionCandidates = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    party: {
        type: String,
        default: '',
        trim: true
    },
    candidateUrl: {
        type: String,
        default: '',
        trim: true
    },
    email: {
        type: String,
        default: '',
        trim: true
    },
    channels: {
        type: Array
    },
    isSelected: {
        type: Boolean
    }

});
var LocalElectionData = new Schema({

    type: {
        type: String,
        default: '',
        trim: true
    },
    roles: {
        type: String,
        default: '',
        trim: true
    },
    office: {
        type: String,
        default: '',
        trim: true
    },
    district: {
        type: String,
        trim: true,
        default: ''
    }

});

var LocalElectionSchema = new Schema({
    hasBeenVoted : {
        type: Boolean,
        default: 'false'
    },
    state : {
        type: String,
        default: '',
        trim: true
    },
    data : [LocalElectionData],
    candidates: [LocalElectionCandidates],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    hash: {
        type: String,
        default: ''
    },
    created: {
        type: Date,
        default: Date.now
    }

});

mongoose.model('LocalElection', LocalElectionSchema);