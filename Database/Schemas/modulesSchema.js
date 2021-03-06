const Schema = require("./Schema");
const { AllowedEvents } = require("../../Internals/Constants");

/*
 * Schema for commands, keywords, and timers (third-party and gallery)
 */
module.exports = new Schema({
	name: {
		type: String,
		minlength: 2,
		maxlength: 100,
		required: true,
	},
	level: {
		type: String,
		enum: [
			"third",
			"gallery",
		],
		required: true,
	},
	type: {
		type: String,
		enum: [
			"command",
			"keyword",
			"timer",
			"event",
		],
		required: true,
	},
	key: {
		type: String,
		minlength: 2,
		maxlength: 25,
	},
	keywords: [String],
	case_sensitive: Boolean,
	admin_level: {
		type: Number,
		min: 0,
		max: 3,
	},
	interval: {
		type: Number,
		min: 300000,
		max: 86400000,
	},
	enabled_channel_ids: [String],
	usage_help: {
		type: String,
		maxlength: 150,
	},
	extended_help: {
		type: String,
		maxlength: 1000,
	},
	last_run: Date,
	store: Schema.Mixed,
	updates_available: {
		type: Number,
		min: 0,
		default: 0,
	},
	description: {
		type: String,
		maxlength: 2000,
	},
	points: {
		type: Number,
		default: 0,
		min: 0,
	},
	owner_id: String,
	featured: Boolean,
	last_updated: Date,
	state: {
		type: String,
		enum: [
			"gallery",
			"queue",
			"saved",
		],
	},
	code_id: String,
	versions: [
		new Schema({
			_id: {
				type: String,
				required: true,
			},
			code_id: String,
		}),
	],
	event: {
		type: String,
		enum: AllowedEvents,
	},
	scopes: [String],
	timeout: {
		type: Number,
		default: 5000,
		min: 100,
		max: 10000,
	},
	fields: [
		new Schema({
			_id: {
				type: String,
				required: true,
			},
			name: String,
			value: String,
		}),
	],
});
