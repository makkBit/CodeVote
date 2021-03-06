// 'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollController.server.js');
var request = require('request');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var pollHandler = new PollHandler();



	/************ URIs **************
	****************************************/
	app.route('/')
		.get(function (req, res) {
			
			//retrieves the polls data from the api and renders index.pug
			request(process.env.APP_URL+'api/polls', function (error, response, body) {

			  if (!error && response.statusCode == 200) {
			    
			  	if(req.isAuthenticated()){
			  		console.log("logged in");
			  		res.render('index',
			  			{
			  				'state':'loggedIn', 
			  				'displayName':req.user.github.displayName || req.user.twitter.displayName,
			  				'polls': body
			  			}
			  		);
			  	}
			  	else{
			  		console.log("logged out");
			  		res.render('index',
			  			{
			  				'state':'loggedOut',
			  				'polls': body
			  			}
			  		);
			  	}
			  }
			});

		});


	app.route('/profile')
		.get(isLoggedIn, function (req, res) {

			//retrieves the polls data from the api and renders index.pug
			if(req.user.github.id)
			    var apiUrl = process.env.APP_URL+'api/polls/'+ req.user.github.id;
			if(req.user.twitter.id)
				var apiUrl = process.env.APP_URL+'api/polls/'+ req.user.twitter.id;

			request(apiUrl, function (error, response, body) {

			  var isEmpty = false;
			  if(body === '[]')
			  	isEmpty = true;

			  if (!error && response.statusCode == 200) {
				res.render('profile', {
					'state': 'loggedIn',
					'displayName': req.user.github.displayName || req.user.twitter.displayName,
					'polls': body,
					'isEmpty': isEmpty
				 });

			  }

			});

		});


	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});


	app.route('/logout')
		.get(function (req, res) {
			req.session.destroy(function (err) {
    			res.redirect('/'); //Inside a callback… bulletproof!
  			});
		});


	app.route('/newpoll')
		.get(isLoggedIn, function(req, res){
			res.render('newpoll',
			  			{
			  				'state':'loggedIn', 
			  				'userName':req.user.github.displayName || req.user.twitter.displayName,
			  			});
		});

	app.route('/polls/:id')
		.get(function(req, res){

			var pollId= req.params.id;
			// var apiUrl = 'http://localhost:8080/api/polls/poll/'+pollId;
			var apiUrl = process.env.APP_URL+'api/polls/poll/'+pollId;

			request(apiUrl, function (error, response, body) {
	
				if(req.isAuthenticated()){
					
					var userId = req.user.github.id || req.user.twitter.id;
					//parses the poll api data & matches the poll id with req id
					var pollData = JSON.parse(body);
					var isPollOwner = false;
					if(pollData.authorId === userId){
						isPollOwner= true;
					}
					
					res.render('poll',
						{
							'state':'loggedIn',
							'displayName':req.user.github.displayName || req.user.twitter.displayName,
							'poll': body,
							'pollOwnerView': isPollOwner,
							'fullURL': req.protocol + '://' + req.get('host') + req.originalUrl,
							'message': req.flash('alert') 
						}
					);
				}

				else{
					res.render('poll',
						{
							'state':'loggedOut',
							'poll': body,
							'fullURL': req.protocol + '://' + req.get('host') + req.originalUrl,
							'message': req.flash('alert') 
						}
					);
				}

			});

		});






	/************ API ENDPOINTS **************
	*****************************************/
	// returns all polls json of all users
	app.route('/api/polls')
		.get(pollHandler.getPolls)
		.post(isLoggedIn, pollHandler.addPoll);
		

	// returns all polls json of only a logged in user 
	app.route('/api/polls/:userPolls')
		.get(pollHandler.getUserPolls);
		
	// returns a particular poll json
	app.route('/api/polls/poll/:id')
		.get(pollHandler.getPoll)
		.post(pollHandler.updatePoll)
		.delete(isLoggedIn, pollHandler.deletePoll);





	/**** GITHUB & TWITTER AUTHENTICATION *****
	*******************************************/
	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));


	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter',{
			successRedirect: '/',
			failureRedirect: '/login'
		}));

};