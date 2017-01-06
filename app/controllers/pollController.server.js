
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


	this.getPoll = function(req, res){
		var pollId = req.params.id;
		if (pollId !== 'bootstrap.min.css.map'){
			Poll.findOne({'_id': pollId}, function(err, result){
				if(err) throw err;
				res.json(result);
			});
		}
		
	};


	this.getUserPolls = function(req, res){
		var user = req.params.userPolls;
		Poll.find({ 'authorId': user }, function (err, result) {
		  if (err) throw err;
		  res.json(result);
		});
	};


	this.addPoll = function(req, res){
		var newPoll = new Poll();

		var date = new Date();
		var months = ['Jan','Feb','Mar','April','May','June',
    			  'July','Aug','Sept','Oct','Nov',
    			  'Dec'];
    	newPoll.date = months[date.getMonth()]+" "+date.getDate()+", "+
    			  date.getFullYear();

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
			console.log("newPoll is: "+newPoll);
			res.redirect('/profile');
		});

	};

	this.updatePoll = function(req, res){

		console.log(req.body.selectedOption);

		Poll.update( { '_id':req.params.id, 'options.name': req.body.selectedOption },
				{ 
					$inc: { 'options.$.count': 1 } 
				}
			)
		.exec(function(err, result){
			if(err) throw err;
			res.redirect('/polls/'+req.params);
		});

	};



};

module.exports = PollHandler;