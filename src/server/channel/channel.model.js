var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ChannelSchema = new Schema({
	uniqueId: {
		type: String,
		unique: true
	},
	slug: {
		type: String
	},
	channelNumber: {
		type: Number
	},
	title: {
		type: String
	},
	description: {
		type: String
	},
	thumb: {
		type: String
	},
	categories: [{
		type: Schema.Types.ObjectId,
		ref: 'Category'
	}],
	rating: {
		type: Number
	},
	age: {
		type: String
	},
	picture: {},
	type: {
		type: String
	},
	embedCode: {
		type: String
	},
	fix: {
		type: Boolean
	},
	thumbnail: {},
	comment: {
		type: String
	},
	media: {},
	disabled: {
		type: Boolean
	},
	views: {
		type: Number
	}
});

var Channel = mongoose.model('Channel', ChannelSchema);

module.exports = Channel;