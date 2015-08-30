'use strict';

var request = require('request'),
    mongoose = require('mongoose'),
    Election = mongoose.model('LocalElection'),
    errorHandler = require('../controllers/errors.server.controller'),
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
            var results = JSON.parse(body).contests;
            Election.remove({user: user},function(err){
                if(err) {
                    errorHandler.getErrorMessage(err);
                }
                else {
                    results.forEach(function(result){
                        var election = new Election({
                            district : result.district.name,
                            office : result.office,
                            candidates : result.candidates,
                            user: user
                        });
                        election.save(function(err){
                            if(err) {
                                //do something the user can see
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
            Election.remove({user: user}, function(err){
                if(err) {
                    errorHandler.getErrorMessage(err);
                    console.log('error clearing election data');
                }

            });

        }
    });
};