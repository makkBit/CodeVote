'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../models/users');
var Poll = require('../models/polls');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	passport.use(new GitHubStrategy({
		clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'github.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					console.log('user already in db');
					return done(null, user);
				} else {
					var newUser = new User();

					newUser.github.id = profile.id;
					newUser.github.username = profile.username;
					newUser.github.displayName = profile.displayName;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}
						console.log('user new in db');
						return done(null, newUser);
					});
				}
			});
		});
	}));

	passport.use(new TwitterStrategy({
    	consumerKey: configAuth.twitterAuth.consumerKey,
    	consumerSecret: configAuth.twitterAuth.consumerSecret,
    	callbackURL: configAuth.twitterAuth.callbackURL
	  },
	  function(token, tokenSecret, profile, done) {
	  	process.nextTick(function(){
	  		User.findOne({ 'twitter.id': profile.id }, function (err, user) {
		      if (err){
		      	return done(err);
		      }
		      if (user){				
		      	return done(null, user)
		      }
		      else{
		      	var newUser = new User();
		      	var profileRaw = JSON.parse(profile._raw);

		      	newUser.twitter.id = profile.id;
		      	newUser.twitter.displayName = profile.displayName;
		      	newUser.twitter.username = profile.username;
		      	newUser.twitter.description = profileRaw.description;
		      	newUser.twitter.location = profileRaw.location;
		      	console.log(newUser);

		      	newUser.save(function (err){
		      		if(err){
		      			throw err;
		      		}
		      		return done(null, newUser);
		      	});

		      }
		    });

	  	});

	 }));


};
