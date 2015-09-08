'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Local election Schema
 */

var ElectionCandidates = new Schema({
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
var ElectionData = new Schema({

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

var ElectionSchema = new Schema({
    state : {
        type: String,
        default: '',
        trim: true
    },
    data : [ElectionData],
    candidates: [ElectionCandidates],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    hash: {
        type: String,
        default: '',
        unique: true
    }
});


mongoose.model('Election', ElectionSchema);