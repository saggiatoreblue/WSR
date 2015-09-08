'use strict';

var request = require('request'),
    mongoose = require('mongoose'),
    LocalElection = mongoose.model('LocalElection'),
    errorHandler = require('../controllers/errors.server.controller'),
    crypto = require('crypto'),
    _ = require('lodash');

exports.getElectionData = function(user) {
    //Cache elections from google to local Mongo Instance
    var apiKey = 'key=AIzaSyBxqYgPhriO1WtnctrPdLYCR_A5rIXPmVM';
    var rootUrl = 'https://www.googleapis.com/civicinfo/v2/voterinfo?';
    var addressParm = '&address=';
    var address = encodeURIComponent(user.address + ' ' + user.city + ' ' + user.state + ' ' + user.zip);
    var electionId = '&electionId=2000';
    var url = rootUrl + apiKey + addressParm + address + electionId;

    request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var state = JSON.parse(body).normalizedInput.state;
            var results = JSON.parse(body).contests;
            LocalElection.remove({user: user},function(err){
                if(err) {
                    errorHandler.getErrorMessage(err);
                }
                else {
                    results.forEach(function(result){
                        var current_date = (new Date()).valueOf().toString();
                        var random = Math.random().toString();
                        var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
                        var localElection = new LocalElection({
                            state: state,
                            user: user,
                            data :[{
                                district : result.district.name,
                                office : result.office,
                                type: result.type,
                                roles: result.roles

                            }],
                            hash: hash,
                            candidates: []
                        });
                        if(result.candidates) {
                            result.candidates.forEach(function(candidate){
                                localElection.candidates.push({
                                    name: candidate.name,
                                    party: candidate.party,
                                    candidateUrl: candidate.candidateUrl,
                                    email : candidate.email,
                                    channels : candidate.channels,
                                    isSelected : false
                                });
                            });
                        }
                        localElection.save(function(err){
                            if(err) {
                                errorHandler.getErrorMessage(err);
                            }
                            else {
                                console.log('election data cached');
                            }
                        });
                    });
                }
            });

        }
        else {
            LocalElection.remove({user: user}, function(err){
                if(err) {
                    errorHandler.getErrorMessage(err);
                    console.log('error clearing election data');
                }

            });

        }
    });
};