const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
	id: {
		type: Number,
		required: false,
	},

	title: {
		type: String,
		required: true,
	},

	category: {
		type: String,
		required: true,
	},

	upvotes: {
		type: Number,
		required: false,
	},

	status: {
		type: String,
		required: false,
	},

	description: {
		type: String,
		required: true,
	},

	// comments: [
	// 	{
	// 		id: {
	// 			type: Number,
	// 		},

	// 		content: {
	// 			type: String,
	// 		},

	// 		createdBy: {
	// 			type: Schema.Types.ObjectId,
	// 			ref: "User",
	// 		},
	// 	},
	// ],

	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Comments",
		},
	],

	creator: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

module.exports = mongoose.model("productFeedback", feedbackSchema);
