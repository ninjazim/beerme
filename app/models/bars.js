'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
	yelpId: String,
	attendees: [
		{
			// user: { type: Schema.Types.ObjectId, ref: 'User' },
			username: String,
			date: Date,
		}
	],
	timestamps: { createdAt: Date, updatedAt: Date }
});
// { timestamps: {} });

module.exports = mongoose.model('Bar', Bar);
