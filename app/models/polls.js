'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
	author: String,
	authorId: String,
	question: String,
	date: String,
	options: [{
		name: String,
		count: Number
	}],
	votes: Number,
	ipVoted: [String]
});

module.exports = mongoose.model('Poll', Poll);
