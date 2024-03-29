const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	id: {
		type: Number,
	},

	content: {
		type: String,
		required: true,
	},

	replies: [
		{
			type: Schema.Types.ObjectId,
			ref: "Replies",
		},
	],

	creatorName: {
		type: String,
	},

	creatorUsername: {
		type: String,
	},

	creatorAvatar: {
		type: String,
	},

	productFeedback: {
		type: Schema.Types.ObjectId,
		ref: "productFeedback",
	},

	creator: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

module.exports = mongoose.model("Comments", commentSchema);
