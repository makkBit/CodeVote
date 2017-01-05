
'use strict';
var User = require('../models/users.js');
var Poll = require('../models/polls.js');

var PollHandler = function(){

	this.getPolls = function(req, res){
		Poll.find( {} )
		.exec(function(err, result){
			if(err) throw err;
			res.json(result);
		});
	};


	this.getUserPolls = function(req, res){
		var user = req.params.user
		console.log(user);
		Poll.find({ 'authorId': user }, function (err, result) {
		  if (err) throw err;
		  res.json(result);
		});
	};


	this.addPoll = function(req, res){
		var newPoll = new Poll();
		console.log(req.user.github.id);
		console.log(req.user.github.displayName);
		newPoll.authorId = req.user.github.id;
		newPoll.author = req.user.github.displayName;
		newPoll.question = req.body.title;

		var optionsArray = (req.body.options).split(',');
		newPoll.options = optionsArray.map(function(x){
			return {
				name: x,
				count: 0
			}
		});

		newPoll.save(function(err){
			if(err) throw err;
			console.log(newPoll);
			res.redirect('/profile');
		});

	};



};

module.exports = PollHandler;