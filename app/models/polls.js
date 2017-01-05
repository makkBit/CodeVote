'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
	author: String,
	authorId: String,
	question: String,
	date: {
		type: Date,
		default: Date.now
	},
	options: [{
		name: String,
		count: Number
	}],
	votes: Number
});

module.exports = mongoose.model('Poll', Poll);
